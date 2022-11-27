import React from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import ActivityForm from "../../features/activities/form/ActivityForm";
import { observer } from "mobx-react-lite";
import { Route, Routes as Switch, useLocation } from "react-router-dom";

function App() {
  // const location = useLocation(); // react-router v6 requires a different fix
  const { pathname } = useLocation(); // hack for react-router v6 hiding NavBar for HomePage
  return (
    <>
      {pathname !== "/" && <NavBar />}
      <Container style={{ marginTop: "7em" }}>
        {/* Note: Needs better structure for react-router v6 */}
        <Switch>
          <Route path="/" element={<HomePage />} />
          <Route path="/activities" element={<ActivityDashboard />} />
          <Route path="/activities/:id" element={<ActivityDetails />} />
          {["/createActivity", "/manage/:id"].map((path, i) => (
            <Route path={path} element={<ActivityForm />} key={i} />
          ))}
        </Switch>
      </Container>
    </>
  );
}

export default observer(App);
