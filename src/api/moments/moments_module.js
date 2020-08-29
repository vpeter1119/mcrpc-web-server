const debug = global.debug;

// Import dependencies
var router = require("express").Router();

// Import mongoose model
const Moment = require("./moment_model.js");

// Define properties
const properties = {
    name: "moments",
    desc: "Memorable moments from MCRPC sessions.",
    methods: ["GET"]
}

///////// ROUTES BEGIN ////////

// READ ALL
router.get("/", (req, res) => {
    // Accepted query parameters: from, name
    const from = req.query.from || req.query.name;
    const query = {};
    if (from && from != "") query.from = from;
    if (debug) console.log(query);
    Moment.find(query, (err, allMoments) => {
        if (err || allMoments == []) {
            data = {
                ok: false,
                count: 0,
                results: []
            }
            res.status(404).json(data);
        } else {
            data = {
                ok: true,
                count: allMoments.length,
                results: MapData(allMoments)
            }
            res.status(200).json(data);
        }
    });
})
// READ ONE
// CREATE ONE

//////// ROUTES END ////////

// Map data to exclude keys like "_id" from the response
function MapData(data) {
    const mappedData = data.map(item => {
        // Decide what keys to include in response
        return {
            from: item.from,
            text: item.text
        }
    });
    return mappedData;
}

// Export router
module.exports = {
    router,
    properties
};