const debug = global.debug;
const _ = require("lodash");
const falagico = require("falagico");

const dwarvishOptions = require('./languages/dwarvish');
const draconicOptions = require('./languages/draconic');
const kherretElvishOptions = require('./languages/elvish');
const Dwarvish = new falagico.Language(dwarvishOptions);
const Draconic = new falagico.Language(draconicOptions);
const KherretElvish = new falagico.Language(kherretElvishOptions);

const languages = {
    default: falagico.languages.Default,
    elvish: falagico.languages.Elvish,
    test: falagico.languages.TestLang,
    dwarvish: Dwarvish,
    draconic: Draconic,
    kherretelvish: KherretElvish
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

router.get("/", (req, res, next) => {
    res.write('Generate name or text in a fantasy language!\n\n');
    res.write('Use the following syntax: (...)/api/generate/\<language\>/\<content\>\n\n');
    res.write('Where \<language\> is any of the following:\n');
    Object.keys(languages).forEach(el => {
        res.write(`    ${el}\n`);
    });
    res.write('\nAnd \<content\> is "name" or "text"\n');
    res.write('\nFor example: (...)/api/generate/dwarvish/text');
    res.send();
});

router.get("/:lang/name", (req, res, next) => {
    var language = req.params.lang || "default";
    var name = GenerateName(language);
    res.send(`Here's a randomly generated name in ${language}:\n\n${name}`);
});

router.get("/name", (req, res, next) => {
    var language = "default";
    var name = GenerateName(language);
    res.send(`Here's a randomly generated name in ${language}:\n\n${name}`);
});

router.get("/:lang/text", (req, res, next) => {
    var language = req.params.lang || "default";
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