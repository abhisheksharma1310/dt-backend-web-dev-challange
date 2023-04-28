import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

/**
 * Schema for event
 */
const eventSchema = mongoose.Schema({
    type: String,
    uid: ObjectId,
    name: String,
    tagline: String,
    schedule: {
        type: Date,
        default: new Date(),
    },
    description: String,
    files: [String],
    moderator: String,
    category: String,
    sub_category: String,
    rigor_rank: Number,
    attendees: [ObjectId]
});

const events = mongoose.model('event', eventSchema);

export default events;