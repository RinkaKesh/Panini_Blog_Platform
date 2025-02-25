const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const CommentModel = mongoose.model("Comment", commentSchema);
module.exports = { CommentModel };
