import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Activity, ActivityFormValues } from "../models/activity";
import { User, UserFormValues } from "../models/user";
import { store } from "../stores/store";

type MyErrorResponse = {
  errors: { detail: string }[];
};

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = store.commonStore.token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response: AxiosResponse) => {
    await sleep(1000);
    return response;
  },
  (error: AxiosError<MyErrorResponse>) => {
    const { data, status, config } = error.response!;
    switch (status) {
      case 400:
        if (typeof data === "string") toast.error(data);
        if (config.method === "get" && data.errors.hasOwnProperty("id")) {
          /* react-router-dom v6 does not support passing history in Router
            so until a better solution comes along,
            we are implementing the following hack...
          */
          window.history.pushState(null, "", "/not-found");
          window.location.reload();
          /* end of hack */
        }
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          throw modalStateErrors.flat();
        } else {
          toast.error(data as unknown as never);
        }
        break;
      case 401:
        toast.error("unauthorized");
        break;
      case 404:
        toast.error("not found");
        /* react-router-dom v6 does not support passing history in Router
          so until a better solution comes along,
          we are implementing the following hack...
        */
        window.history.pushState(null, "", "/not-found");
        window.location.reload();
        /* end of hack */
        break;
      case 500:
        store.commonStore.setServerError(data as unknown as never);
        /* react-router-dom v6 does not support passing history in Router
          so until a better solution comes along,
          we are implementing the following hack...
        */
        window.history.pushState({}, "Server Error", "/server-error"); // react-router-dom removed history and recommends performing these actions within react lifecycles
        window.location.reload(); // unfortunatley, this wipes the store and so we cannot see the data with this and currently no fix found
        /* end of hack */
        break;
    }
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: object) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: object) =>
    axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const activities = {
  list: () => requests.get<Array<Activity>>("/activities"),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: ActivityFormValues) =>
    requests.post<void>("/activities", activity),
  update: (activity: ActivityFormValues) =>
    requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete<void>(`/activities/${id}`),
  attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
};

const account = {
  current: () => requests.get<User>("/account"),
  login: (user: UserFormValues) => requests.post<User>("/account/login", user),
  register: (user: UserFormValues) =>
    requests.post<User>("/account/register", user),
};

const agent = {
  activities,
  account,
};

export default agent;
