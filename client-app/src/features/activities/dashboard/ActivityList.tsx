import React, { Fragment } from "react";
import { observer } from "mobx-react-lite";
import { Header } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityListItem from "./ActivityListItem";

export default observer(function ActivityList(): JSX.Element {
  const { activityStore } = useStore();
  const { groupedActivities } = activityStore;

  return (
    <>
      {groupedActivities.map(([group, activities]) => (
        <Fragment key={group}>
          <Header sub color="teal">
            {group}
          </Header>
          {activities.map((a) => (
            <ActivityListItem key={a.id} activity={a} />
          ))}
        </Fragment>
      ))}
    </>
  );
});

// interface Props {}
