const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const Authorization = require('./middlewares/authorization');

const app = express();

dotenv.config();
 
app.use(bodyParser.json());

app.use(Authorization);

app.use('/graphql', graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('DB Connected');
})
.catch(err => {
    console.log(err);
})

app.listen(3000, () => console.log('Listening on 3000'));