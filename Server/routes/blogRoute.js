const express = require("express");
const mongoose=require("mongoose")
const { UserModel } = require("../models/userModel");
const { BlogModel } = require("../models/blogModel");
const { authMiddleware } = require("../middlewares/authmiddleware");

const blogRoute = express.Router();


blogRoute.post("/create", authMiddleware, async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const userId = req.user?.userId; // Extract user ID from auth middleware

        if (!userId) {
            return res.status(400).json({ message: "User ID (author) is required" });
        }

        const newPost = await BlogModel.create({ title, content, tags, author: userId });

        res.status(201).json({ message: "Post created successfully", data: newPost });
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error: error.message });
    }
});

// Get all blog posts with pagination
blogRoute.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const posts = await BlogModel.find()
            .populate("author", "name")
            .populate("comments.user", "name") // Show commenter names
            .populate("likes", "name") // Show who liked
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).send({ message: "Success", data: posts });
    } catch (error) {
        res.status(500).send({ message: "Error fetching posts", error });
    }
});

// Get a specific blog post by ID
blogRoute.get("/:id", async (req, res) => {
    try {
        const post = await BlogModel.findById(req.params.id)
            .populate("author", "name")
            .populate("comments.user", "name") // Populate commenter name
            .populate("likes", "name"); // Populate users who liked the post

        if (!post) return res.status(404).send({ message: "Post not found" });

        res.status(200).send({ message: "Success", data: post });
    } catch (error) {
        res.status(500).send({ message: "Error fetching post", error });
    }
});

// Update a blog post
blogRoute.patch("/:id", authMiddleware, async (req, res) => {
    try {
        const post = await BlogModel.findById(req.params.id);
        if (!post) return res.status(404).send({ message: "Post not found" });

        if (post.author.toString() !== req.user.userId)
            return res.status(403).send({ message: "Unauthorized" });

        const updatedPost = await BlogModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send({ message: "Post updated successfully", data: updatedPost });
    } catch (error) {
        res.status(500).send({ message: "Error updating post", error });
    }
});

// Delete a blog post
blogRoute.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const post = await BlogModel.findById(req.params.id);
        if (!post) return res.status(404).send({ message: "Post not found" });

        // Check if the logged-in user is the author of the blog post
        if (post.author.toString() !== req.user.userId) {
            return res.status(403).send({ message: "Unauthorized" });
        }

        await BlogModel.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting post", error });
    }
});


blogRoute.get("/user/:userId", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId)
            .populate("userBlogs")
            .lean();

        if (!user) return res.status(404).send({ message: "User not found" });

        res.status(200).send({ message: "Success", data: user.userBlogs });
    } catch (error) {
        res.status(500).send({ message: "Error fetching user blogs", error });
    }
});

// Like or unlike a post
blogRoute.post("/:id/like", authMiddleware, async (req, res) => {
    try {
        const post = await BlogModel.findById(req.params.id);
        if (!post) return res.status(404).send({ message: "Post not found" });

        const userId = new mongoose.Types.ObjectId(req.user.userId); // Ensure ObjectId format

        const alreadyLiked = post.likes.some(like => like.toString() === userId.toString());

        if (alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
            await post.save();
            return res.status(200).send({ message: "Post unliked", likes: post.likes });
        } else {
            post.likes.push(userId);
            await post.save();
            return res.status(200).send({ message: "Post liked", likes: post.likes });
        }

    } catch (error) {
        res.status(500).send({ message: "Error liking/unliking post", error: error.message });
    }
});



// Add a comment to a post
blogRoute.post("/:id/comment", authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).send({ message: "Comment content is required" });

        const post = await BlogModel.findById(req.params.id);
        if (!post) return res.status(404).send({ message: "Post not found" });

        const newComment = { user: req.user.userId, content }; // Use authenticated userId
        post.comments.push(newComment);
        await post.save();

        const updatedPost = await BlogModel.findById(req.params.id)
            .populate("comments.user", "name");

        res.status(201).send({ message: "Comment added", data: updatedPost.comments[updatedPost.comments.length - 1] });
    } catch (error) {
        res.status(500).send({ message: "Error adding comment", error });
    }
});



// Delete a comment
blogRoute.delete("/:blogId/comment/:commentId", authMiddleware, async (req, res) => {
    try {
        const post = await BlogModel.findById(req.params.postId);
        if (!post) return res.status(404).send({ message: "Post not found" });

        const commentIndex = post.comments.findIndex(
            (comment) => comment._id.toString() === req.params.commentId &&
                         comment.user.toString() === req.user.userId
        );

        if (commentIndex === -1)
            return res.status(403).send({ message: "Unauthorized or comment not found" });

        post.comments.splice(commentIndex, 1);
        await post.save();

        res.status(200).send({ message: "Comment deleted" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting comment", error });
    }
});
module.exports = { blogRoute };
