import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header, List } from "semantic-ui-react";

function App() {
  const [activities, setActivities] = useState<Array<Activity>>([]);

  async function initActivities() {
    const res: { data: Array<ResActivity>; status: number } = await axios.get(
      "http://localhost:5000/api/activities"
    );
    const newActivities = res.data.map((a: ResActivity) => {
      return { ...a, date: new Date(a.date) };
    });
    console.log("res:", newActivities);
    setActivities(newActivities);
  }

  useEffect(() => {
    initActivities();
  }, []);
  return (
    <div>
      <Header as="h2" icon="users" content="Reactivities" />
      <List>
        {activities.map((a: Activity) => (
          <List.Item key={a.id}>{a.title}</List.Item>
        ))}
      </List>
    </div>
  );
}

interface ResActivity {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  city: string;
  venue: string;
}

interface Activity {
  id: string;
  title: string;
  date: Date;
  description: string;
  category: string;
  city: string;
  venue: string;
}

export default App;
