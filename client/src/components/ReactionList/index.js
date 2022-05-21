import React from "react";
import { Link } from "react-router-dom";

// takes reactions array as a prop
// array is mapped into a list <p> elements.  Each reaction also includes he author's name, which should route to the Profile page when clicked. 
const ReactionList = ({ reactions }) => {
  return (
    <div className="card mb-3">
      <div className="card-header">
        <span className="text-light">Reactions</span>
      </div>
      <div className="card-body">
        {reactions &&
          reactions.map((reaction) => (
            <p className="pill mb-3" key={reaction._id}>
              {reaction.reactionBody} {"// "}
              <Link
                to={`/profile/${reaction.username}`}
                style={{ fontWeight: 700 }}
              >
                {reaction.username} on {reaction.createdAt}
              </Link>
            </p>
          ))}
      </div>
    </div>
  );
};

export default ReactionList;
