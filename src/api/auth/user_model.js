const mongoose = require("mongoose");
//const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  discordUser: { type: String }
}, { timestamps: true });

//userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;