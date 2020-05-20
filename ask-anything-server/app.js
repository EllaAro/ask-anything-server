const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');

const { sequelize } = require('./models');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auto = require('./middleware/auth');

// return instance of the app
app = express(); 

// setting up the cors config
app.use(cors({
    origin: '*'
}));

// tell the app to parse the body of the request
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 

// tell the app to go through the middleware before procceeding to graphql
app.use(auto);

// setting the graphql route 
app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    }
  })
);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

sequelize.sync({ force: true })
  .then(() => {
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });

  
  
