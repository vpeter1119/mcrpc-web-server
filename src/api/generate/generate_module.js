const debug = global.debug;
const _ = require("lodash");
const falagico = require("falagico");

const languages = {
    elvish: falagico.languages.Elvish,
    test: falagico.languages.TestLang
}

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

router.get("/name", (req, res, next) => {
    var language = req.query.lang || "test";
    var name = GenerateName(language);
    res.send(`Here's a randomly generated name in ${language}:\n\n${name}`);
})

//////// ROUTES END ////////



// Export router
module.exports = {
    router: router,
    properties: properties
};

/* Internal Functions */

function GenerateName(language) {
    var firstName = "";
    var lastName = "";
    if (languages[language]) {
        firstName = languages[language].Word(2);
        lastName = languages[language].Word(3);
    } else {
        if (debug) console.log("Invalid language request.");
    }
    var name = (`${_.capitalize(firstName)} ${_.capitalize(lastName)}`);
    return name;
}