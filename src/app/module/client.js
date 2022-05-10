const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Client = new Schema({
    Name: String,
    Email: String,
    Password: String,
    Gender: String,
    Phone: String,
    DateOfBirth: Date,
    Address: String,
    Thumbnail: String,
    RegisterCourse: [
        {
            "_id": String,
            "courseName": String
        }
    ]
})

module.exports = mongoose.model("Client", Client);