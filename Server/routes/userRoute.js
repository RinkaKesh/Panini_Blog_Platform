
const express = require("express");
const multer = require("multer");
require("dotenv").config();
const userRoute = express.Router();
const { UserModel } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

const uploadDir = "/tmp";


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage: storage });

// Get all users
userRoute.get("/", async (req, res) => {
    try {
        const allUsers = await UserModel.find();
        res.status(200).send({ message: "success", data: allUsers });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get specific user by ID
userRoute.get("/:_id", async (req, res) => {
    try {
        const specificUser = await UserModel.findById(req.params._id);
        if (!specificUser) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ message: "success", data: specificUser });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Update user profile including image
// userRoute.patch("/edit/:id", upload.single("image"), async (req, res) => {
//     try {
//         const userToEdit = await UserModel.findById(req.params.id);
//         if (!userToEdit) {
//             return res.status(404).send({ message: "User not found" });
//         }

//         const updatedData = { ...req.body };
//         if (req.file) {
//             updatedData.image = `/tmp/${req.file.filename}`; 
//         }

//         await UserModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
//         res.status(200).send({ message: "Profile Updated Successfully", data: updatedData });
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// });
userRoute.patch("/edit/:id", upload.single("image"), async (req, res) => {
    try {
        const userToEdit = await UserModel.findById(req.params.id);
        if (!userToEdit) {
            return res.status(404).send({ message: "User not found" });
        }

        const updatedData = { ...req.body };

        // If a new image is uploaded, update the image path
        if (req.file) {
            updatedData.image = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        res.status(200).send({ message: "Profile Updated Successfully", data: updatedUser });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Register user with image upload
userRoute.post("/register", upload.single("image"), async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(409).send({ message: `User with email ${email} already exists` });
        }

        const hashedPassword = await bcrypt.hash(password, 5);
        if (!hashedPassword) {
            return res.status(500).send({ message: "Something went wrong, try later" });
        }

        const image = req.file ? `/uploads/${req.file.filename}` : "";
        const newUser = await UserModel.create({ name, email, password: hashedPassword, image });

        res.status(201).send({ message: `${name} successfully registered`, data: newUser });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Login user
userRoute.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).send({ message: "Invalid Credentials" });
        }

        const { password: _, ...userData } = user.toObject();
        const expiresIn = 10 * 60 * 60;
        const token = jwt.sign(
            { userId: user._id, username: user.name },
            process.env.SECRET_KEY,
            { expiresIn }
        );

        res.send({
            message: `${user.name} successfully logged in`,
            token: token,
            profile: userData,
            expiresIn: expiresIn,
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = { userRoute };

