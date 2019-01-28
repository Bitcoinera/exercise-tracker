const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/exercise-tracker', {useMongoClient: true});

const userSchema = mongoose.Schema ({
    username: {
        type: String,
        required: [true, 'username is required']
    }
})

const exerciseSchema = mongoose.Schema ({
    username: {
        type: String,
        required: [true, 'username is required']
    },
    description: {
        type: String,
        default: ''
    },
    duration: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        required: [true, 'date is required to add exercise. Correct format is yyyy-mm-dd']
    }
})

const User = mongoose.connection.model('User', userSchema);
const Exercise = mongoose.connection.model('Exercise', exerciseSchema);

module.exports = {
    User,
    Exercise
}