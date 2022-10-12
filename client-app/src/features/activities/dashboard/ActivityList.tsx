import React, { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

export default function ActivityList({
  activities,
  selectActivity,
  deleteActivity,
  submitting,
}: Props): JSX.Element {
  const [target, setTarget] = useState("");

  function handleActivityDelete(
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) {
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  }

  return (
    <Segment>
      <Item.Group divided>
        {activities.map((a: Activity) => (
          <Item key={a.id}>
            <Item.Content>
              <Item.Header as="a">{a.title}</Item.Header>
              <Item.Meta>{a.date}</Item.Meta>
              <Item.Description>
                <div>{a.description}</div>
                <div>
                  {a.city}, {a.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  onClick={() => selectActivity(a.id)}
                  floated="right"
                  content="View"
                  color="blue"
                />
                <Button
                  name={a.id}
                  loading={submitting && target === a.id}
                  onClick={(e) => handleActivityDelete(e, a.id)}
                  floated="right"
                  content="Delete"
                  color="red"
                />
                <Label basic content={a.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
}

interface Props {
  activities: Array<Activity>;
  selectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
  submitting: boolean;
}
