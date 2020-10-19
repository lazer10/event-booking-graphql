const User = require('../../models/user');
const bcrypt = require('bcryptjs');

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
    }
};