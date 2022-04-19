const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Units = new Schema({
    courseId: String,
    unitName: String,
    amountLesson: Number,
    status: Boolean,
    lessons: Array,
    createDate: Date,
    updateDate: Date
});

module.exports = mongoose.model("Unit", Units);