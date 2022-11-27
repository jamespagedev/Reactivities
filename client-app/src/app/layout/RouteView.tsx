import React, { ReactNode } from "react";
import { Container } from "semantic-ui-react";

interface Props {
  children: ReactNode;
}

export default function RouteView({ children }: Props): JSX.Element {
  return <Container style={{ marginTop: "7em" }}>{children}</Container>;
}
