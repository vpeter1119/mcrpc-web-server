const debug = global.debug;
const config = require("../../config/config");

// Import dependencies
var router = require("express").Router();

// Import mongoose model
const Note = require("./note_model.js");

// Define properties
const properties = {
    name: "notes",
    desc: "Store and recall notes based on categories.",
    methods: ["GET","POST"],
}

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
router.post('/', (req, res) => {
    // 
    if (req.query.token != config.token) {
        res.status(403).json({
            message: "Authentication required."
        });
        return;
    }
    var input = req.body;
    if (debug) console.log(input);
    var data = {
        user: input.user,
        category: input.category,
        text: input.text
    };
    Note.create(data, (err, newNote) => {
        if (!err) {
            res.status(201).json({
                message: "Your note was saved."
            });
            if (debug) console.log(newNote);
        } else {
            res.status(500).json({
                message: "Something went wrong. Please try again later."
            });
            if (debug) console.log(err);
        }
    });
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
module.exports = {
    router,
    properties
};