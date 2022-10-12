import React, { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid";
import agent from "../api/Agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const [activities, setActivities] = useState<Array<Activity>>([]);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function initActivities() {
    try {
      const activities: Array<Activity> = await agent.activities.list();
      const activitiesFormatted: Array<Activity> = activities.map(
        (a: Activity) => ({
          ...a,
          date: a.date.split("T")[0],
        })
      );
      setActivities(activitiesFormatted);
    } catch (err) {
      console.log("initActivities error:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find((x) => x.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity(); // edit or create
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  async function handleCreateOrEditActivity(activity: Activity) {
    try {
      setSubmitting(true);
      if (activity.id) {
        await agent.activities.update(activity);
        setActivities([
          ...activities.filter((x) => x.id !== activity.id),
          activity,
        ]);
      } else {
        activity.id = uuid();
        await agent.activities.create(activity);
        setActivities([...activities, activity]);
      }
      setSelectedActivity(activity);
      setEditMode(false);
    } catch (err) {
      console.log("handleCreateOrEditActivity error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteActivity(id: string) {
    try {
      setSubmitting(true);
      await agent.activities.delete(id);
      setActivities([...activities.filter((x) => x.id !== id)]);
    } catch (err) {
      console.log("handleDeleteActivity error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    initActivities();
  }, []);
  return loading ? (
    <LoadingComponent content="Loading app" />
  ) : (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
