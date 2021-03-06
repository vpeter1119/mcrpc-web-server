const mongoose = require("mongoose");
const debug = global.debug;
const _ = require("lodash");
// This skips authentication in development environment, will remove later
let CheckAuth = debug ? function (req, res, next) { next(); } : require("../auth/check-auth");

let attributes = require("./data/attributes.json");
let templates = require("./data/templates.json");
let skills = require("./data/skills.json");
let spells = require("./data/spells.json");

// Import dependencies
var router = require("express").Router();

// Import mongoose model
const User = require("../auth/user_model");

// Define properties
const properties = {
    name: "desperados",
    desc: "Character creation and rules data for Desperados Roleplaying Game.",
    methods: ["GET","POST","PUT","DELETE"]
}

///////// ROUTES BEGIN ////////

// CHARACTERS

// CREATE CHARACTER
router.post("/users/:id/characters", CheckAuth, (req, res, next) => {
    // Accepted query parameters: none
    const id = req.params.id;
    var isValidId = ValidateId(id, res);
    if (isValidId) {
        const input = req.body;
        const template = templates.find((temp) => {
            return temp.name == input.template.name;
        }) || {};
        const character = {
            index: _.kebabCase(input.name),
            name: input.name,
            sex: input.sex || "unknown",
            age: input.age || "unknown",
            template: template,
            attributes: input.attributes || {},
            skills: input.skills || [],
            special: input.special || [],
            equipment: input.equipment || [],
        }
        if (debug) console.log(character);
        User.findOneAndUpdate(
            { _id: id },
            { $push: { 'desperados.characters': character } },
            (err) => {
                if (!err) {
                    res.status(201).json({
                        ok: true,
                        message: `New character created with index ${id}/${character.index}`
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
// VIEW ALL CHARACTERS (OF USER)
router.get("/users/:id/characters", CheckAuth, (req, res, next) => {
    const id = req.params.id;
    var isValidId = ValidateId(id, res);
    if (isValidId) {
        if (debug) console.log("requested id="+id);
        User.findById(id, (err, foundUser) => {
            if (!err && foundUser) {
                if (debug) console.log(foundUser);
                let characters = foundUser.desperados.characters;
                let filteredCharacters = characters.filter(character => {
                    return !character.isDeleted;
                })
                if (filteredCharacters) {
                    res.status(200).json({
                        ok: true,
                        result: MapCharacterData(filteredCharacters)
                    });
                } else {
                    res.status(404).json({
                        ok: false,
                        message: "No characters for this user."
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
// VIEW ONE CHARACTER
router.get("/users/:id/characters/:index", CheckAuth, (req, res, next) => {
    const id = req.params.id;
    var isValidId = ValidateId(id, res);
    if (isValidId) {
        const index = req.params.index;
        if (debug) console.log(`GET data for ${id}/${index}`);
        if (debug) console.log("index="+index);
        User.findById(id, (err, foundUser) => {
            if (!err && foundUser) {
                let character = foundUser.desperados.characters.find(character => {
                    return character.index == index;
                });
                if (character && !character.isDeleted) {
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
// UPDATE CHARACTER DATA
router.put("/users/:id/characters/:index", CheckAuth, (req, res, next) => {
    const id = req.params.id;
    var isValidId = ValidateId(id, res);
    var updateData = req.body;
    if (isValidId) {
        const index = req.params.index;
        User.findById(id, (err, foundUser) => {
            if (!err && foundUser) {
                let character = foundUser.desperados.characters.find(character => {
                    return character.index == index;
                });
                if (character) {
                    // Update and save character
                    var pos = foundUser.desperados.characters.map(function (e) { return e.index; }).indexOf(index);
                    foundUser.desperados.characters[pos] = updateData;
                    // .save() only works if modified path is marked
                    foundUser.markModified('desperados.characters');
                    foundUser.save((err, updatedUser) => {
                        if (!err && updatedUser) {
                            // OK
                            let updatedCaracter = updatedUser.desperados.characters.find(character => {
                                return character.index == index;
                            });
                            res.status(200).json({
                                ok: true,
                                message: "Character data updated.",
                                result: updatedCaracter,
                            });
                        } else {
                            // Server error
                            if (debug && err) console.log(err);
                            res.status(500).json({
                                ok: false,
                                message: HandleError(err.code) || "No error message.",
                            })
                        }
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
// DELETE CHARACTER
router.delete("/users/:id/characters/:index", CheckAuth, (req, res, next) => {
    const id = req.params.id;
    var isValidId = ValidateId(id, res);
    if (isValidId) {
        const index = req.params.index;
        User.findById(id, (err, foundUser) => {
            if (!err && foundUser) {
                let character = foundUser.desperados.characters.find(character => {
                    return character.index == index;
                });
                if (character) {
                    // Update and save character
                    var pos = foundUser.desperados.characters.map(function (e) { return e.index; }).indexOf(index);
                    foundUser.desperados.characters[pos].isDeleted = true;
                    // .save() only works if modified path is marked
                    foundUser.markModified('desperados.characters');
                    foundUser.save((err, updatedUser) => {
                        if (!err && updatedUser) {
                            // OK
                            res.status(200).json({
                                ok: true,
                                message: "Character deleted.",
                            });
                        } else {
                            // Server error
                            if (debug && err) console.log(err);
                            res.status(500).json({
                                ok: false,
                                message: HandleError(err.code) || "No error message.",
                            })
                        }
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

router.get("/rules", (req, res) => {
    const rulesData = {
        attributes: attributes,
        templates: templates,
        skill: skills,
        spells: spells
    }
    res.status(200).json({
        ok: true,
        result: rulesData
    });
})

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

router.get("/skills", (req, res) => {
    res.status(200).json({
        ok: true,
        result: skills
    });
})

router.get("/spells", (req, res) => {
    res.status(200).json({
        ok: true,
        result: spells
    });
})

router.get("/spells/:index", (req, res) => {
    const index = req.params.index;
    let spellData = spells.find(spell => {
        return spell.index == index;
    }) || null;
    if (spellData) {
        res.status(200).json({
            ok: true,
            result: spellData
        });
    } else {
        res.status(404).json({
            ok: false,
            message: `Spell with index '${index}' not found.`
        });
    }
})

// MISC

router.get("/", (req,res) => {
    res.send("Howdy, cowboy?");
})

//////// ROUTES END ////////

// Map data to exclude keys like "_id" from the response
function MapUserData(data) {
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
    let mappedData;
    if (data.length) {
        // This means data is an array
        mappedData = data.map(item => {
            // Decide what keys to include in response
            return {
                index: item.index,
                name: item.name,
                sex: item.sex,
                age: item.age,
                template: item.template,
                attributes: item.attributes,
                skills: item.skills,
                special: item.special,
                equipment: item.equipment,
            }
        });
    } else {
        // This is means data is a single object
        mappedData = {
            index: data.index,
            name: data.name,
            sex: data.sex,
            age: data.age,
            template: data.template,
            attributes: data.attributes,
            skills: data.skills,
            special: data.special,
            equipment: data.equipment,
        }
    }
    return mappedData;
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
module.exports = {
    router,
    properties
};
