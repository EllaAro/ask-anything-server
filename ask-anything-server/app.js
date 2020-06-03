const express = require("express"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  graphqlHttp = require("express-graphql");

const { sequelize } = require("./models"),
  graphqlSchema = require("./graphql/schema"),
  graphqlResolver = require("./graphql/resolvers"),
  auth = require("./middleware/auth"),
  fileRoutes = require("./routes/file-upload");

// return instance of the app
app = express();

// setting up the cors config
app.use(
  cors({
    origin: "*",
  })
);

// tell the app to parse the body of the request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// tell the app to go through the middleware before procceeding to graphql
app.use(auth);

// setting the graphql route
app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

// setting file upload (images upload) route
app.use("/api/file-upload", fileRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

sequelize
  .sync() //{ force: true }
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
