const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const events = async (eventIds) => {
    try {
   const events = await Event.find({ _id: { $in: eventIds } })
     events.map(event => {
            return { 
                ...event._doc, 
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator) 
            };
        });
        return events;
    } catch (err) {
        throw err
    }
};

const user = async (userId) => {
    try {
    const user = await User.findById(userId)
        return { 
            ...user._doc, 
            createdEvents: events.bind(this, user._doc.createdEvents) 
        };
    } catch (err) {
        throw err;
    }
};


module.exports = {
    events: async () => {
        try {
        const events = await Event.find()
         return events
            .map(event => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        } catch (err) {
          throw err;
        }
    },
    createEvent: async (args) => {
    const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '5f8856346a80a838e0c423b3'
    });
    let createdEvent;
    try {
       const result = await event.save();
           createdEvent = {
               ...result._doc, 
               date: new Date(event._doc.date).toISOString(),
               creator: user.bind(this, result._doc.creator)
            };
           const creator = await User.findById('5f8856346a80a838e0c423b3')
           if (!creator) {
               throw new Error('User not found');
           }
           creator.createdEvents.push(event);
            await creator.save();
           return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createUser: async (args) => {
        try {
       const userExist = await User.findOne({ email: args.userInput.email })
            if (userExist) {
                throw new Error('User Exists')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
           const result = await user.save();
            return {...result._doc, password: undefined}
        } catch (err) {
            throw err;
        }
    }
}