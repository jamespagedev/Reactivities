import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Activity } from "../models/activity";
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

const request = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: object) => axios.post<T>(url).then(responseBody),
  put: <T>(url: string, body: object) => axios.put<T>(url).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const activities = {
  list: () => request.get<Array<Activity>>("/activities"),
  details: (id: string) => request.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => axios.post<void>("/activities", activity),
  update: (activity: Activity) =>
    axios.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => axios.delete<void>(`/activities/${id}`),
};

const agent = {
  activities,
};

export default agent;
