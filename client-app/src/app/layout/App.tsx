import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { observer } from "mobx-react-lite";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useStore } from "../stores/store";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import { Container } from "semantic-ui-react";
import HomePage from "../../features/home/HomePage";

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
      <ScrollRestoration />
      <ToastContainer position="bottom-right" hideProgressBar />
      <ModalContainer />
      {pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <NavBar />
          {/* Note: Needs better structure for react-router v6 */}
          <Container style={{ marginTop: "7em" }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
}

export default observer(App);
