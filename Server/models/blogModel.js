const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }], 
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});
const BlogModel = mongoose.model("Blog", blogSchema);
module.exports = { BlogModel };
