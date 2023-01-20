import React, { useEffect } from "react";
import NavBar from "./NavBar";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import ActivityForm from "../../features/activities/form/ActivityForm";
import { observer } from "mobx-react-lite";
import { Route, Routes as Switch, useLocation } from "react-router-dom";
import RouteView from "./RouteView";
import TestErrors from "../../features/errors/TestError";
import { ToastContainer } from "react-toastify";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/users/LoginForm";
import { useStore } from "../stores/store";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import ProfilePage from "../../features/profiles/ProfilePage";

function App() {
  // const location = useLocation(); // react-router v6 requires a different fix
  const { pathname } = useLocation(); // hack for react-router v6 hiding NavBar for HomePage
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded)
    return <LoadingComponent content="Loading app..." />;

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      <ModalContainer />
      {pathname !== "/" && <NavBar />}
      {/* Note: Needs better structure for react-router v6 */}
      <Switch>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/activities"
          element={
            <RouteView>
              <ActivityDashboard />
            </RouteView>
          }
        />
        <Route
          path="/activities/:id"
          element={
            <RouteView>
              <ActivityDetails />
            </RouteView>
          }
        />
        {["/createActivity", "/manage/:id"].map((path, i) => (
          <Route
            path={path}
            element={
              <RouteView>
                <ActivityForm />
              </RouteView>
            }
            key={i}
          />
        ))}
        <Route
          path="/profiles/:username"
          element={
            <RouteView>
              <ProfilePage />
            </RouteView>
          }
        />
        <Route
          path="/errors"
          element={
            <RouteView>
              <TestErrors />
            </RouteView>
          }
        />
        <Route
          path="/server-error"
          element={
            <RouteView>
              <ServerError />
            </RouteView>
          }
        />
        <Route
          path="/login"
          element={
            <RouteView>
              <LoginForm />
            </RouteView>
          }
        />
        <Route
          path="/*"
          element={
            <RouteView>
              <NotFound />
            </RouteView>
          }
        />
      </Switch>
    </>
  );
}

export default observer(App);
