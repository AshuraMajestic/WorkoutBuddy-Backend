const { default: mongoose } = require("mongoose");
const monggose = require("mongoose");
const validator = require("validator");

const userSchema = monggose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
    },
    email: {
        type: String,
        required: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("Invalid email");
            }
        },
    },
    phone: {
        type: Number,
        required: true,
        minLength: 10
    },
    message: {
        type: String,
        required: true,
        minLength: 3
    }
});

const User = mongoose.model("Message", userSchema);

module.exports = User;