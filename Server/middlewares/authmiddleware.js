require("dotenv").config() 
const jwt = require("jsonwebtoken")  
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log("Decoded Token:", decoded);

        if (!decoded.userId) {
            return res.status(403).json({ message: "Invalid token - No userId found" });
        }
        req.user = decoded; 
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(403).json({ message: "Invalid token", error: error.message });
    }
};
module.exports = { authMiddleware };


