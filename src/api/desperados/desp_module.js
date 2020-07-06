const mongoose = require("mongoose");
const debug = global.debug;
const _ = require("lodash");

let attributes = require("./data/attributes.json");
let templates = require("./data/templates.json");

// Import dependencies
var router = require("express").Router();

// Import mongoose model
const DespUser = require("./desp_user_model.js");

///////// ROUTES BEGIN ////////

// USERS

// READ ALL
router.get("/users", (req, res) => {
    // Accepted query parameters: none
    const query = {};
    // Add any query parameters
    if (debug) console.log(query);
    DespUser.find(query, (err, list) => {
        if (err || list == []) {
            data = {
                ok: false,
                count: 0,
                results: []
            }
            res.status(404).json(data);
        } else {
            data = {
                ok: true,
                count: list.length,
                results: MapData(list)
            }
            res.status(200).json(data);
        }
    });
});
// READ ONE
router.get("/users/:id", (req, res) => {
    // Retrieve user by id
    const id = req.params.id;
    var isValidId = ValidateId(id,res);
    if (debug) console.log("isValidId="+isValidId);
    if (isValidId) {
        DespUser.findOne({ _id: id }, (err, foundUser) => {
            if (!err && foundUser) {
                if (debug) console.log(foundUser);
                res.status(200).json({
                    ok: true,
                    result: MapData(foundUser)
                });
            } else {
                if (err && debug) console.log(err);
                res.status(404).json({
                    ok: false,
                    message: "User not found.",
                });
            }
        });
    }
});
// CREATE ONE == REGISTER
router.post("/users", (req, res) => {
    // Prepare data
    const input = req.body;
    if (debug) console.log(input);
    const data = {
        username: input.username,
        email: input.email,
        password: input.password,
        active: false,
        characters: [],
    }
    // Create new inventory
    DespUser.create(data, (err, newUser) => {
        if (!err && newUser) {
            res.status(201).json({
                ok: true,
                message: `New user created with id ${newUser.id}`
            });
        } else {
            if (debug && err) console.log(err);
            res.status(500).json({
                ok: false,
                message: "Something went wrong when creating new inventory.",
                error: {
                    code: err.code || 0,
                    msg: HandleError(err.code) || "No error message."
                }
            });
        }
    });
});

// CHARACTERS

// UPDATE ONE == CREATE CHARACTER
router.post("/users/:id", (req, res) => {
    // Accepted query parameters: none
    const id = req.params.id;
    var isValidId = ValidateId(id, res);
    if (isValidId) {
        const input = req.body;
        const character = {
            index: _.kebabCase(input.name),
            name: input.name,
            sex: input.sex || "unknown",
            age: input.age || "unknown",
            template: input.template,
            attributes: input.attributes,
            skills: input.skills || [],
            special: input.special || [],
            equipment: input.equipment || [],
        }
        if (debug) console.log(character);
        DespUser.findOneAndUpdate(
            { _id: id },
            { $push: { characters: character } },
            (err, newCharacter) => {
                if (!err && newCharacter) {
                    res.status(201).json({
                        ok: true,
                        message: `New character created with index ${newCharacter.index}`
                    });
                } else {
                    if (debug && err) console.log(err);
                    res.status(500).json({
                        ok: false,
                        message: "Something went wrong when creating new character.",
                        error: {
                            code: err.code || 0,
                            msg: HandleError(err.code) || "No error message."
                        }
                    });
                }
            }
        );
    }    
});
// READ ONE == VIEW CHARACTER
router.get("/users/:id/characters/:index", (req, res) => {
    const id = req.params.id;
    var isValidId = ValidateId(id, res);
    if (isValidId) {
        const index = req.params.index;
        if (debug) console.log("index="+index);
        DespUser.findOne({ _id: id }, (err, foundUser) => {
            if (!err && foundUser) {
                let character = foundUser.characters.find(character => {
                    return character.index == index;
                });
                if (character) {
                    res.status(200).json({
                        ok: true,
                        result: MapCharacterData(character)
                    });
                } else {
                    res.status(404).json({
                        ok: false,
                        message: "Character not found."
                    })
                }
            } else {
                if (err && debug) console.log(err);
                res.status(404).json({
                    ok: false,
                    message: "User not found.",
                });
            }
        })
    }    
})

// RULES

router.get("/attributes", (req, res) => {
    res.status(200).json({
        ok: true,
        result: attributes
    });
})

router.get("/templates", (req, res) => {
    res.status(200).json({
        ok: true,
        result: templates
    });
})

// MISC

router.get("/", (req,res) => {
    res.send("Howdy, cowboy?");
})

//////// ROUTES END ////////

// Map data to exclude keys like "_id" from the response
function MapData(data) {
    let mappedData;
    if (data.length) {
        // This means data is an array
        mappedData = data.map(item => {
            // Decide what keys to include in response
            return {
                username: item.username,
                characters: item.characters,
            }
        });
    } else {
        // This is means data is a single object
        mappedData = {
            username: data.username,
            characters: data.characters,
        }
    }
    return mappedData;
}

function MapCharacterData(data) {
    // Use this function to filter character data before sending
    return data;
}

// Handle mongoose error
function HandleError(code) {
    if (code == 11000) return "Resource already exists.";
}

// Validate ID for mongoose
function ValidateId(id, res) {
    return mongoose.Types.ObjectId.isValid(id);
    res.status(400).json({
        ok: false,
        message: "User ID is invalid."
    });
}

// Export router
module.exports = router;
