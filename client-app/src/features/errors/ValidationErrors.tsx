import React from "react";
import { Message } from "semantic-ui-react";

export default function ValidationErrors({ errors }: Props): JSX.Element {
  return (
    <Message error>
      {errors && (
        <Message.List>
          {errors.map((err: any, i: any) => (
            <Message.Item key={i}>{err}</Message.Item>
          ))}
        </Message.List>
      )}
    </Message>
  );
}

interface Props {
  errors: any;
}
