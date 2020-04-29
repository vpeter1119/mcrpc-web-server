const mongoose = require("mongoose");

const options = {
    //Insert any schema options here
}

const inventorySchema = mongoose.Schema(
    {
        index: { type: String, unique: true },
        character_name: { type: String },
        user_id: { type: String },
        password: { type: String },
        containers: {
            default: { type: Array }, // for items not placed in any other container
            custom: { type: Array } // for backpack, sack, pouch, etc.
        }
    },
    options
);

const Inventory = mongoose.model("Inventory", inventorySchema, "Inventory");

module.exports = Inventory;