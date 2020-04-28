const mongoose = require("mongoose");

const options = {
    //Insert any schema options here
}

const inventorySchema = mongoose.Schema(
    {
        character_name: { type: String },
        user_id: { type: String },
        password: { type: String },
        containers: { type: Array }
    },
    options
);

const Inventory = mongoose.model("Inventory", inventorySchema, "Inventory");

module.exports = Inventory;