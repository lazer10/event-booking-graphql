const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
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
    },
    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                throw new Error('User does not exist');
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error('Password is incorrect!')
            }
            const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', {
                expiresIn: '1h'
            });
            return { userId: user.id, token, tokenExpiration: 1 }
            } catch (err) {
              throw err;
        }
    }
};