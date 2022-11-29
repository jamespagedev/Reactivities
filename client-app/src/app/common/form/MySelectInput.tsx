import React from "react";
import { Form, Label, Select } from "semantic-ui-react";
import { useField } from "formik";

export default function MySelectInput(props: Props): JSX.Element {
  const [field, meta, helpers] = useField(props.name);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <Select
        clearable
        options={props.options}
        value={field.value || null}
        onChange={(ev, data) => helpers.setValue(data.value)}
        onBlur={() => helpers.setTouched(true)}
        placeholder={props.placeholder}
      />
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
  options: any;
  label?: string;
}
