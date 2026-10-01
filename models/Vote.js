const mongoose = require("mongoose");
const voteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    election: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: true
    }
});


voteSchema.index(
    { user: 1, election: 1 },
    { unique: 1 }
);
const Vote = mongoose.model("Vote", voteSchema);
module.exports = Vote;