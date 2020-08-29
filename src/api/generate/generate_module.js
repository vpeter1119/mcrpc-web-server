const debug = global.debug;

// Import dependencies
var router = require("express").Router();

// Import mongoose model
//const Beverage = require("./beverage_model");

// Define properties
const properties = {
    name: "generate",
    alias: "gen",
    desc: "Generate content such as fantasy character and location names.",
    methods: ["GET"],
}

///////// ROUTES BEGIN ////////


//////// ROUTES END ////////



// Export router
module.exports = {
    router: router,
    properties: properties
};