const express = require("express"),
  cors = require("cors"),
  bodyParser = require("body-parser");

const { sequelize } = require("./models"),
  auth = require("./middleware/auth");

// return instance of the app
app = express();

// setting up the cors config
app.use(cors());

// setting up bodyParser for parsing the incoming request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// incoming request go through the middleware before procceeding, making sure that user is authenticated
app.use(auth);

sequelize
  .sync() //{ force: true }
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
