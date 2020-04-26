const mongoose = require("mongoose");

const options = {
    //Insert any schema options here
}

const beverageSchema = mongoose.Schema(
    {
        name: { type: String },
        types: { type: Array },
        containers: { type: Array }
    },
    options
);

const Beverage = mongoose.model("Beverage", beverageSchema);

module.exports = Beverage;