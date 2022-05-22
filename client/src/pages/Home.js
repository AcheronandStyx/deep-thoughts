import React from "react";
import { useQuery } from "@apollo/client"; // useQuery function to use our defiend queries
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from "../utils/queries"; // our defined queries
import ThoughtList from "../components/ThoughtList";
import Auth from "../utils/auth";
import FriendList from "../components/FriendList";

const Home = () => {
  // use useQuery hook to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  /* ^^^^^
  When we load the Home component in the application, we'll execute the query for the thought data. Because this is asynchronous, 
  just like using fetch(), Apollo's @apollo/client library provides a loading property to indicate that the request isn't done just yet. 
  When it's finished and we have data returned from the server, that information is stored in the destructured data property.
  */
  // use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
  const { data: userData } = useQuery(QUERY_ME_BASIC);

  const thoughts = data?.thoughts || []; // Optional chaining negates the need to check if an object even exists before accessing its properties.
  // ABOVE - if data exists, store it in the thoughts constant we just created. If data is undefined, then save an empty array to the thoughts component.
  console.log(thoughts);

  //If you're logged in, the loggedIn variable will be true; otherwise, it will be false
  const loggedIn = Auth.loggedIn();
  // Below ternary operator to conditionally render the <ThoughtList> component. If the query hasn't completed and loading is still defined,
  // we display a message to indicate just that. Once the query is complete and loading is undefined,
  // we pass the thoughts array and a custom title to the <ThoughtList> component as props.
  return (
    <main>
      <div className="flex-row justify-space-between">
        <div className={`col-12 mb-3 ${loggedIn && "col-lg-8"}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
        </div>
        {loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3">
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
