import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_THOUGHT } from "../utils/queries";
import ReactionList from "../components/ReactionList";

const SingleThought = (props) => {
  const { id: thoughtId } = useParams(); // Pull the id from the url
  console.log(thoughtId);

  // variables loading and data are destructured from the useQuery Hook. The loading variable is then used
  // to briefly show a loading <div> element, and the data variable is used to populate a thought object.
  const { loading, data } = useQuery(QUERY_THOUGHT, {
    variables: { id: thoughtId },
  }); // variables passes a parameter to the query. The id property on the variables object will become the $id parameter in the GraphQL query.

  const thought = data?.thought || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{" "}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>

      {thought.reactionCount > 0 && (
        <ReactionList reactions={thought.reactions} />
      )}
    </div>
  );

  // Above the reactions array is passed as a prop to the ReactionsList Component
  // Conditional check to prevent rendering the reactions list if that array is empty
};

export default SingleThought;
