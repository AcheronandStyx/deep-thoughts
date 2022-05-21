const { User, Thought } = require("../models");

const resolvers = {
  // desctrucure username to search by username
  Query: {
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    // place this inside of the `Query` nested object right after `thoughts`
    // we destructure the _id argument value and place it into our .findOne() method to look up a single thought by its _id
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },

    //get all users
    users: async () => {
      return User.find()
        .select("-__v -password")
        .populate("friends")
        .populate("thoughts");
    },
    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password") // - = omit these fields
        .populate("friends")
        .populate("thoughts");
    },
  },
};

module.exports = resolvers;
