const debug = global.debug;
const config = require("../../config/config");
const _ = require("lodash");

// Import dependencies
var router = require("express").Router();

// Import mongoose model
const GeoJSON = require("./geojson_model.js");

// Define properties
var properties = {
    name: "geojson",
    desc: "GeoJSON data for custom fantasy maps.",
    methods: ["GET","POST"]
}

///////// ROUTES BEGIN ////////

// READ ALL
router.get("/", (req, res) => {
    // Accepted query parameters: map
    let query = {};
    if (req.query.map) {
        query = {
            "properties.map": req.query.map
        }
    }
    if (debug) console.log(query);
    GeoJSON.find(query, (err, list) => {
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
router.get("/:id", (req, res) => {
    // Retrieve GeoJSON feature with specified id
    const id = req.params.id;
    GeoJSON.findOne({ _id: id }, (err, data) => {
        if (!err && data) {
            if (debug) console.log(data);
            res.status(200).json({
                ok: true,
                result: MapData(data)
            });
        } else {
            if (err && debug) console.log(err);
        }
    });
});
// CREATE ONE
router.post("/", (req, res) => {
    // Required query parameter: token (for basic authentication, temporary solution)
    if (req.query.token != config.token) {
        res.status(403).json({
            ok: false,
            message: "Authentication required."
        })
        return;
    }
    // Prepare data
    const input = req.body;
    if (debug) console.log(input);
    const data = {
        type: "Feature",
        geometry: input.geometry,
        properties: input.properties
    }
    if (debug) console.log(data);
    // Create new entry
    GeoJSON.create(data, (err, newEntry) => {
        if (!err && newEntry) {
            res.status(201).json({
                ok: true,
                message: `New entry created with id ${newEntry._id}`
            });
        } else {
            if (debug && err) console.log(err);
            res.status(500).json({
                ok: false,
                message: "Something went wrong when creating new entry.",
                error: {
                    code: err.code || 0,
                    msg: HandleError(err.code) || "No error message."
                }
            });
        }
    });
});
// UPDATE ONE


//////// ROUTES END ////////

// Map data to exclude keys like "_id" from the response
// This also ensures that the returned data is in proper GeoJSON format
function MapData(data) {
    let mappedData;
    if (data.length) {
        // This means data is an array
        mappedData = data.map(item => {
            // Decide what keys to include in response
            return {
                type: item.type,
                geometry: item.geometry,
                properties: item.properties
            }
        });
    } else {
        // This is means data is a single object
        mappedData = {
            type: data.type,
            geometry: data.geometry,
            properties: data.properties
        }
    }
    return mappedData;
}

// Export router
module.exports = {
    router,
    properties
};
