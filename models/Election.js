const mongoose = require("mongoose");
const electionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["ongoing", "upcoming", "completed"],
        required: true
    },
    date: {
        type: String,
        required: true
    },
    votingTime: {
        type: String,
        required: true
    }
});
const Election = mongoose.model("Election", electionSchema);
module.exports = Election;

