
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        image: { type: String,default: "" } ,
        bio: { type: String, default: "" },
    },
    {
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

userSchema.virtual("userBlogs", {
    ref: "Blog",
    localField: "_id",
    foreignField: "author"
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
