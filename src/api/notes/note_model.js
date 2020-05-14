const mongoose = require("mongoose");

const options = {
    //Insert any schema options here
    timestamps: true
}

const noteSchema = mongoose.Schema({
  user: { type: String },
  category: { type: String },
  text: { type: String }
}, options);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;