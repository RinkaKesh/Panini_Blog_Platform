const express = require("express");
const { CommentModel } = require("../models/commentModel");
const {authMiddleware} = require("../middlewares/authmiddleware");

const commentRoute = express.Router();

// Add a comment
commentRoute.post("/", authMiddleware, async (req, res) => {
    try {
        const { blogId, content } = req.body;
        const newComment = await CommentModel.create({ blogId, userId: req.userId, content });
        res.status(201).send({ message: "Comment added successfully", data: newComment });
    } catch (error) {
        res.status(500).send({ message: "Error adding comment", error });
    }
});

module.exports = { commentRoute };
