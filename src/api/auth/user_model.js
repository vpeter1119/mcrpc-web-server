const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    discordUser: { type: String },
    isActive: { type: Boolean },
    isAdmin: { type: Boolean },
    desperados: {
        characters: []
    },
    notes: [],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;