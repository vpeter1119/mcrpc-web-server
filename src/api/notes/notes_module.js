const debug = global.debug;

// Import dependencies
var router = require("express").Router();

// Import mongoose model
const Note = require("./note_model.js");

///////// ROUTES BEGIN ////////

// READ ALL
router.get("/", (req, res) => {
    res.status(200).json({
        message: "Use the following syntax: '/api/notes/:user' with '?category=[category_name]'"
    });
})
// READ ALL FROM USER
router.get("/:user", (req, res) => {
    // Accepted query parameters: category
    const category = req.query.category;
    const query = {};
    if (category && category != "") query.category = category;
    query.user = req.params.user;
    if (debug) console.log(query);
    Note.find(query, (err, notes) => {
        if (err || notes == []) {
            data = {
                ok: false,
                count: 0,
                results: []
            }
            res.status(404).json(data);
        } else {
            data = {
                ok: true,
                count: notes.length,
                results: MapData(notes)
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
    let mappedData;
    if (data.length) {
        // This means data is an array
        mappedData = data.map(item => {
            // Decide what keys to include in response
            return {
                user: item.user,
                category: item.category,
                text: item.text
            }
        });
    } else {
        // This is means data is a single object
        mappedData = {
            user: data.user,
            category: data.category,
            text: data.text
        }
    }
    return mappedData;
}

// Export router
module.exports = router;