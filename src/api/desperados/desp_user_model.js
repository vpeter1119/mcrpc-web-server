const mongoose = require("mongoose");

const options = {
    //Insert any schema options here
    timestamps: true,
}

const despUserSchema = mongoose.Schema(
    {
        username: { type: String, unique: true },
        email: { type: String, unique: true },
        password: { type: String },
        active: { type: Boolean },
        characters: [
            {
                index: { type: String, unique: true },
                name: { type: String, required: true },
                sex: { type: String },
                age: { type: String },
                template: { type: String },
                attributes: {
                    brawn: { type: Number },
                    agility: { type: Number },
                    mettle: { type: Number },
                    insight: { type: Number },
                    wits: { type: Number },
                    resolve: { type: Number },
                },
                skills: [],
                special: [],
                equipment: [],
            }
        ]
    },
    options
);

const DespUser = mongoose.model("DespUser", despUserSchema);

module.exports = DespUser;