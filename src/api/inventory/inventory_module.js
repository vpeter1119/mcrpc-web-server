const debug = global.debug;
const _ = require("lodash");
const fetch = require("node-fetch");

// Import dependencies
var router = require("express").Router();

// Import mongoose model
const Inventory = require("./inventory_model.js");

///////// ROUTES BEGIN ////////

// READ ALL
router.get("/", (req, res) => {
    // Accepted query parameters: user_id
    const query = {};
    if (req.query.user_id) query.user_id = req.query.user_id;
    if (debug) console.log(query);
    Inventory.find(query, (err, list) => {
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
router.get("/:index", (req, res) => {
    // Retrieve inventory with specified index
    const index = req.params.index;
    Inventory.findOne({ index: index }, (err, foundInv) => {
        if (!err && foundInv) {
            if (debug) console.log(foundInv);
            res.status(200).json({
                ok: true,
                result: MapData(foundInv)
            });
        } else {
            if (err && debug) console.log(err);
        }
    });
});
// CREATE ONE
router.post("/", (req, res) => {
    // Prepare data
    const input = req.body;
    if (debug) console.log(input);
    const data = {
        index: _.kebabCase(input.character_name),
        character_name: input.character_name,
        user_id: input.user_id || "",
        containers: {
            default: [],
            custom: []
        }
    }
    // Create new inventory
    Inventory.create(data, (err, newInv) => {
        if (!err && newInventory) {
            res.status(201).json({
                ok: true,
                message: `New inventory created with index ${newInv.index}`
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
// UPDATE ONE
router.post("/:index", (req, res) => {
    // Accepted query parameters: container
    const index = req.params.index;
    const items = req.body.items.map(item => {
        return _.kebabCase(item);
    });
    if (debug) console.log(items);
    const item_data = GetItemData(items);
    if (debug) console.log(item_data);
});

//////// ROUTES END ////////

// Map data to exclude keys like "_id" from the response
function MapData(data) {
    let mappedData;
    if (data.length) {
        // This means data is an array
        mappedData = data.map(item => {
            // Decide what keys to include in response
            return {
                character_name: item.character_name,
                user_id: item.user_id,
                containers: item.containers
            }
        });
    } else {
        // This is means data is a single object
        mappedData = {
            character_name: data.character_name,
            user_id: data.user_id,
            containers: data.containers
        }
    }
    return mappedData;
}

function GetItemData(items) {
    //Get data for each item
    return [];
}

// Handle mongoose error
function HandleError(code) {
    if (code == 11000) return "Character with same index already exists. Please use a different name.";
}

// Export router
module.exports = router;
