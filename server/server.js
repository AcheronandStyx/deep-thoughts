const express = require("express");
// import ApolloServer
const { ApolloServer } = require("apollo-server-express");
// auth middleware
const { authMiddleware } = require("./utils/auth");
const path = require("path");

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;

// create a new apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // When you instantiate a new instance of ApolloServer, you can pass in a context method that's set to return whatever you want available in the resolvers.
  context: authMiddleware, // This ensures that every request performs an authentication check -> imported from utils/auth
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// create a new instance of an apollo server with the GraphQL Schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // integrate our apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  // Serve up static assets
  // First, we check to see if the Node environment is in production.
  // If it is, we instruct the Express.js server to serve any files in the React application's build directory in the client folder.
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }

  // if we make a GET request to any location on the server that doesn't have an explicit route defined, respond with the production-ready React front-end code.
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // log where we can go to test our GQL API
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
