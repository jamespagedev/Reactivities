import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import agent from "../../app/api/Agent";
import { useStore } from "../../app/stores/store";
import useQuery from "../../app/util/hooks";
import LoginForm from "./LoginForm";

const statusDefaults = {
  verifying: "Verifying",
  failed: "Failed",
  success: "Success",
};

// interface Props {}

export default function ConfirmEmail(): JSX.Element {
  const { modalStore } = useStore();
  const email = useQuery().get("email") as string;
  const token = useQuery().get("token") as string;
  const [status, setStatus] = useState(statusDefaults.verifying);

  function handleConfirmEmailResend() {
    agent.account
      .resendEmailConfirmation(email)
      .then(() => {
        toast.success("Verification email resent - please check your email");
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    agent.account
      .verifyEmail(token, email)
      .then(() => setStatus(statusDefaults.success))
      .catch(() => setStatus(statusDefaults.failed));
  }, [token, email]);

  function getBody() {
    switch (status) {
      case statusDefaults.verifying:
        return <p>Verifying...</p>;
      case statusDefaults.failed:
        return (
          <div>
            <p>
              Verification failed. You can try resending the verification link
              to your email
            </p>
            <Button
              primary
              onClick={handleConfirmEmailResend}
              size="huge"
              content="Resend email"
            />
          </div>
        );
      case statusDefaults.success:
        return (
          <div>
            <p>Email has been verified - you can now login</p>
            <Button
              primary
              onClick={() => modalStore.openModal(<LoginForm />)}
              size="huge"
              content="Login"
            />
          </div>
        );
    }
  }

  return (
    <Segment placeholder textAlign="center">
      <Header icon>
        <Icon name="envelope" />
        Email verification
      </Header>
      <Segment.Inline>{getBody()}</Segment.Inline>
    </Segment>
  );
}
