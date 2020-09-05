const debug = global.debug;
const _ = require("lodash");
const falagico = require("falagico");

const languages = {
    default: falagico.languages.Default,
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

router.get("/:lang/name", (req, res, next) => {
    var language = req.param.lang || "default";
    var name = GenerateName(language);
    res.send(`Here's a randomly generated name in ${language}:\n\n${name}`);
});

router.get("/name", (req, res, next) => {
    var language = "default";
    var name = GenerateName(language);
    res.send(`Here's a randomly generated name in ${language}:\n\n${name}`);
});

router.get("/:lang/text", (req, res, next) => {
    var language = req.param.lang || "default";
    var text = GenerateText(language);
    res.send(text);
});

router.get("/text", (req, res, next) => {
    var language = "default";
    var text = GenerateText(language);
    res.send(text);
});

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

function GenerateText(language) {
    var txt = (languages[language]) ? languages[language].Text() : '(language not found)';
    return txt;
}