// const express = require("express");
// require("dotenv").config();
// const userRoute = express.Router();
// const { UserModel } = require("../models/userModel");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const multer = require('multer');
// const storage = multer.memoryStorage(); // Store the file in memory
// const upload = multer({ storage: storage });

// // Get all users
// userRoute.get("/", async (req, res) => {
//     try {
//         const allUsers = await UserModel.find();
//         res.status(200).send({ message: "Success", data: allUsers });
//     } catch (error) {
//         res.status(500).send({ message: "Server error", error });
//     }
// });

// // Get a specific user by ID
// // userRoute.get("/:id", async (req, res) => {
// //     try {
// //         const specificUser = await UserModel.findById(req.params.id);
// //         if (!specificUser) {
// //             return res.status(404).send({ message: "User not found" });
// //         }
// //         res.status(200).send({ message: "Success", data: specificUser });
// //     } catch (error) {
// //         res.status(500).send({ message: "Server error", error });
// //     }
// // });
// userRoute.get("/:id", async (req, res) => {
//     try {
//         const specificUser = await UserModel.findById(req.params.id)
//             .populate({
//                 path: "blogs",
//                 populate: [
//                     { path: "author", select: "name email profilePicture" },
//                     { path: "comments.user", select: "name" },
//                     { path: "likes", select: "name" }
//                 ],
//                 options: { sort: { createdAt: -1 } }
//             });

//         if (!specificUser) {
//             return res.status(404).send({ message: "User not found" });
//         }

//         res.status(200).send({ message: "Success", data: specificUser });
//     } catch (error) {
//         res.status(500).send({ message: "Server error", error });
//     }
// });


// // Update user profile
// userRoute.patch("/edit/:id", upload.single('profilePicture'), async (req, res) => {
//     try {
//         const { name, email, bio } = req.body; // Extract other fields
//         const userId = req.params.id;

//         const updateData = { name, email, bio }; // Include bio

//         if (req.file) {
//             // Handle the uploaded file (e.g., upload to cloud storage)
//             // For demonstration, you can convert it to base64
//             updateData.profilePicture = req.file.buffer.toString('base64');
//         }

//         const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });

//         if (!updatedUser) {
//             return res.status(404).send({ message: "User not found" });
//         }

//         res.status(200).send({ message: "Profile updated successfully", data: updatedUser });
//     } catch (error) {
//         res.status(500).send({ message: "Server error", error: error.message });
//     }
// });


// // User registration
// userRoute.post("/register", async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         if (!name || !email || !password) {
//             return res.status(400).send({ message: "All fields are required" });
//         }

//         const existingUser = await UserModel.findOne({ email });
//         if (existingUser) {
//             return res.status(409).send({ message: "User with this email already exists" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = await UserModel.create({ name, email, password: hashedPassword });

//         res.status(201).send({ message: `${name} successfully registered`, data: newUser });
//     } catch (error) {
//         res.status(500).send({ message: "Server error", error });
//     }
// });

// // User login
// userRoute.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).send({ message: "Email and password are required" });
//         }

//         const user = await UserModel.findOne({ email });
//         if (!user) {
//             return res.status(404).send({ message: "User not found" });
//         }

//         const validPassword = await bcrypt.compare(password, user.password);
//         if (!validPassword) {
//             return res.status(401).send({ message: "Invalid credentials" });
//         }
//         const expiresIn = 10 * 60 * 60; 
//         const { password: _, ...userWithoutPassword } = user.toObject();
//         const token = jwt.sign(
//             { userId: user._id, username: user.name },
//             process.env.SECRET_KEY,
//             { expiresIn }
//         );

//         res.send({
//             message: `${user.name} successfully logged in`,
//             token,
//             profile: userWithoutPassword,
//             expiresIn,
//         });
//     } catch (error) {
//         res.status(500).send({ message: "Server error", error });
//     }
// });

// module.exports = { userRoute };

const express = require("express");
const multer = require("multer");
require("dotenv").config();
const userRoute = express.Router();
const { UserModel } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");

// Ensure uploads directory exists
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
userRoute.patch("/edit/:id", upload.single("image"), async (req, res) => {
    try {
        const userToEdit = await UserModel.findById(req.params.id);
        if (!userToEdit) {
            return res.status(404).send({ message: "User not found" });
        }

        const updatedData = { ...req.body };
        if (req.file) {
            updatedData.image = `/uploads/${req.file.filename}`;
        }

        await UserModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).send({ message: "Profile Updated Successfully", data: updatedData });
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

