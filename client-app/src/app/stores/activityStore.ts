import { makeAutoObservable, reaction, runInAction } from "mobx";
import { format } from "date-fns";
import agent from "../api/Agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();
  predicate = new Map().set("all", true);

  constructor() {
    // makeObservable(this, { // all dependancies are imported from "mobx"
    //   title: observable,
    //   setTitle: action,
    //   // setTitle: action.bound, <-- use if setTitle was a function instead of an arrow function
    // });
    makeAutoObservable(this);

    reaction(
      () => this.predicate.keys(),
      () => {
        this.pagingParams = new PagingParams();
        this.activityRegistry.clear();
        this.loadActivities();
      }
    );
  }

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  };

  setPredicate = (predicate: string, value: string | Date) => {
    const resetPredicate = () => {
      this.predicate.forEach((value, key) => {
        if (key !== "startDate") this.predicate.delete(key);
      });
    };
    switch (predicate) {
      case "all":
        resetPredicate();
        this.predicate.set("all", true);
        break;
      case "isGoing":
        resetPredicate();
        this.predicate.set("isGoing", true);
        break;
      case "isHost":
        resetPredicate();
        this.predicate.set("isHost", true);
        break;
      case "startDate":
        this.predicate.delete("startDate");
        this.predicate.set("startDate", value);
    }
  };

  get axiosParams() {
    const params = new URLSearchParams();
    params.append("pageNumber", this.pagingParams.pageNumber.toString());
    params.append("pageSize", this.pagingParams.pageSize.toString());
    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, (value as Date).toISOString());
      } else {
        params.append(key, value);
      }
    });
    return params;
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, "dd MMM yyyy"); // key for objects
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Array<Activity> })
    );
  }

  loadActivities = async () => {
    this.setLoadingInitial(true);
    try {
      const result = await agent.activities.list(this.axiosParams);
      result.data.forEach((activity) => {
        this.setActivity(activity);
      });
      this.setPagination(result.pagination);
      this.setLoadingInitial(false); // notice no need for using runInAction()
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false); // notice no need for using runInAction()
    }
  };

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.setLoadingInitial(true);
      try {
        activity = await agent.activities.details(id);
        this.setActivity(activity);
        runInAction(() => {
          this.selectedActivity = activity;
        });
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  };

  private setActivity = (activity: Activity) => {
    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees!.some(
        (a) => a.username === user.username
      );
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees?.find(
        (x) => x.username === activity.hostUsername
      );
    }
    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);
  };

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    try {
      await agent.activities.create(activity);
      const newActivity = new Activity(activity);
      newActivity.hostUsername = user!.username;
      newActivity.attendees = [attendee];
      this.setActivity(newActivity);
      /* runInAction used for
        when async/await is being used
        and
        anytime <this.variable = something>, instead of using the functions such as <this.function(variable)>
      */
      runInAction(() => {
        this.selectedActivity = newActivity;
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.activities.update(activity);
      runInAction(() => {
        if (activity.id) {
          let updateActivity = {
            ...this.getActivity(activity.id),
            ...activity,
          };
          this.activityRegistry.set(activity.id, updateActivity as Activity);
          this.selectedActivity = updateActivity as Activity;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateAttendance = async () => {
    const user = store.userStore.user;
    runInAction(() => (this.loading = true));
    try {
      await agent.activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees =
            this.selectedActivity.attendees?.filter(
              (a) => a.username !== user?.username
            );
          this.selectedActivity.isGoing = false;
        } else {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }
        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  cancelActivityToggle = async () => {
    this.loading = true;
    try {
      await agent.activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled =
          !this.selectedActivity?.isCancelled;
        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
      console.log("error");
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  clearSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  updateAttendeeFollowing = (username: string) => {
    this.activityRegistry.forEach((activity) => {
      activity.attendees.forEach((attendee) => {
        if (attendee.username === username) {
          attendee.following
            ? attendee.followersCount--
            : attendee.followersCount++;
          attendee.following = !attendee.following;
        }
      });
    });
  };
}
