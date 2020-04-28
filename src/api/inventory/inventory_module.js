const debug = global.debug;

// Import dependencies
var router = require("express").Router();

// Import mongoose model
const Inventory = require("./inventory_model.js");

///////// ROUTES BEGIN ////////

// READ ALL
router.get("/", (req, res) => {
    // Accepted query parameters: 
    const query = {};
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
                count: allMoments.length,
                results: MapData(allMoments)
            }
            res.status(200).json(data);
        }
    });
})
// READ ONE
// CREATE ONE
router.post("/", (req, res) => {
    // Check data and create inventory in database
});

//////// ROUTES END ////////

// Map data to exclude keys like "_id" from the response
function MapData(data) {
    const mappedData = data.map(item => {
        // Decide what keys to include in response
        return {
            character_name: item.character_name,
            user_id: item.user_id,
            containers: item.containers
        }
    });
    return mappedData;
}

// Export router
module.exports = router;