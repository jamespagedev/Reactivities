import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/Agent";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";

export default class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.account.login(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      window.history.pushState(null, "", "/activities");
      window.location.reload();
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    window.localStorage.removeItem("jwt");
    this.user = null;
    window.history.pushState(null, "", "/");
    window.location.reload();
  };

  getUser = async () => {
    try {
      const user = await agent.account.current();
      runInAction(() => (this.user = user));
    } catch (error) {
      console.log(error);
    }
  };

  register = async (creds: UserFormValues) => {
    try {
      const user = await agent.account.register(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      window.history.pushState(null, "", "/activities");
      window.location.reload();
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  setImage = (image: string) => {
    if (this.user) this.user.image = image;
  };
}
