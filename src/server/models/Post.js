import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Mongoose schema for the 'Post' collection.
 */
const PostSchema = new Schema({
    /**
     * Title of the post.
     */
    title: {
        type: String,
        required: true
    },
    /**
     * Body content of the post.
     */
    body: {
        type: String,
        required: true
    },
    /**
     * Date and time when the post was created.
     */
    createdAt: {
        type: Date,
        default: Date.now
    },
    /**
     * Date and time when the post was last updated.
     */
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Post", PostSchema);