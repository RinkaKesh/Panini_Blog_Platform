// const mongoose = require("mongoose");
// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     bio: { type: String, default: "" },
//     profilePicture: { type: String, default: "" },
//     blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }] ,
//     likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }]
// }, {
//     versionKey: false,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
// });
// userSchema.virtual("userBlogs", {
//     ref: "Blog",
//     localField: "_id",
//     foreignField: "author"
// });
// const UserModel = mongoose.model("User", userSchema);
// module.exports = { UserModel };
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        image: { type: String } 
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
