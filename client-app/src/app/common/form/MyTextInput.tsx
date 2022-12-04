import React from "react";
import { Form, Label } from "semantic-ui-react";
import { useField } from "formik";

export default function MyTextInput(props: Props): JSX.Element {
  const [field, meta] = useField(props.name);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <input {...field} {...props} />
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}

interface Props {
  placeholder: string;
  name: string;
  type?: string;
  label?: string;
}
