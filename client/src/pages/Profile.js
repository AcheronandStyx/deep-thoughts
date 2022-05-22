import React from "react";
import { Navigate, useParams } from "react-router-dom";

import ThoughtForm from "../components/ThoughtForm";
import ThoughtList from "../components/ThoughtList";
import FriendList from "../components/FriendList";

import { useQuery, useMutation } from "@apollo/client";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
import { ADD_FRIEND } from "../utils/mutations";
import Auth from "../utils/auth";
const Profile = () => {
  // we need to destructure the mutation function from ADD_FRIEND so we can use it in a click function

  const { username: userParam } = useParams();
  const [addFriend] = useMutation(ADD_FRIEND);
  console.log(userParam);
  //  if there's a value in userParam that we got from the URL bar, we'll use that value to run the QUERY_USER query.
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};

  // navigate to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile:username" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // f there is no user data to display, we know that we aren't logged in or at another user's profile page.
  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links
        above to sign up or log in!
      </h4>
    );
  }
  // callback function for the onClikc attr
  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id },
      });
    } catch (e) {
      console.error(e);
    }
  };

  // The useParams Hook retrieves the username from the URL, which is then passed to the useQuery Hook.
  // The user object that is created afterwards is used to populate the JSX.
  // This includes passing props to the ThoughtList component to render a list of thoughts unique to this user.
  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : "your"} profile.
        </h2>

        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList
            thoughts={user.thoughts}
            title={`${user.username}'s thoughts...`}
          />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
      <div className="mb-3">{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
