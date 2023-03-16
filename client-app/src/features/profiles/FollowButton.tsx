import React, { SyntheticEvent } from "react";
import { observer } from "mobx-react-lite";
import { Button, Reveal } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: Profile;
}

export default observer(function FollowButton({
  profile,
}: Props): JSX.Element | null {
  const { profileStore, userStore } = useStore();
  const { updateFollowing, loading } = profileStore;

  if (userStore.user?.username === profile.username) return null;

  function handleFollow(e: SyntheticEvent, username: string) {
    e.preventDefault();
    updateFollowing(username, !profile.following);
  }

  return (
    <Reveal animated="move">
      <Reveal.Content visible style={{ width: "100%" }}>
        <Button
          fluid
          color="teal"
          content={profile.following ? "Following" : "Not following"}
        />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: "100%" }}>
        <Button
          loading={loading}
          fluid
          basic
          color={profile.following ? "red" : "green"}
          content={profile.following ? "Unfollow" : "Follow"}
          onClick={(e) => handleFollow(e, profile.username)}
        />
      </Reveal.Content>
    </Reveal>
  );
});
