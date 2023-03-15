import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";
import UserStore from "./userStore";
import CommentStore from "./commentStore";

interface Store {
  activityStore: ActivityStore;
  commonStore: CommonStore;
  modalStore: ModalStore;
  profileStore: ProfileStore;
  userStore: UserStore;
  commentStore: CommentStore;
}

export const store: Store = {
  activityStore: new ActivityStore(),
  commonStore: new CommonStore(),
  modalStore: new ModalStore(),
  profileStore: new ProfileStore(),
  userStore: new UserStore(),
  commentStore: new CommentStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
