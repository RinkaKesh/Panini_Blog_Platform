
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const connection = require("./config/connection");
const { blogRoute } = require("./routes/blogRoute");
const { userRoute } = require("./routes/userRoute");
const { authMiddleware } = require("./middlewares/authmiddleware");

const app = express();
const uploadDir = path.join(__dirname, "uploads");


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// CORS Configuration
const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors());
app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});


app.use("/blogs", blogRoute);
app.use("/user", userRoute);


if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, async () => {
        try {
            await connection();
            console.log("Connected to DB");
        } catch (error) {
            console.log(error);
        }
    });
}


if (process.env.NODE_ENV === "production") {
    connection()
        .then(() => console.log("Production DB connected"))
        .catch((err) => console.log("Production DB error:", err));
}

module.exports = app;
