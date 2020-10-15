const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Event = require('./models/event');

const app = express();

dotenv.config();

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput) : Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
            .then(events => {
                return events.map(event => {
                    return {...event._doc}
                })
            }).catch(err => {
                throw err;
            });
        },
        createEvent: args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date)
        })
           return event.save().then(result => {
               console.log(result);
               return {...result._doc};
           }).catch(err => {
               console.log(err);
               throw err;
           });
        }
    },
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