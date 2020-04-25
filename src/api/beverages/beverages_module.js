const debug = global.debug;

// Import dependencies
var router = require("express").Router();

// Import mongoose model
const Beverage = require("./beverage_model");

///////// ROUTES BEGIN ////////

// READ ALL
router.get("/", (req, res) => {
    // Accepted query parameters: none    
    const query = {};    
    Beverage.find(query, (err, allItems) => {
        if (err || allItems == []) {
            data = {
                ok: false,
                count: 0,
                results: []
            }
            res.status(404).json(data);
        } else {
            data = {
                ok: true,
                count: allItems.length,
                results: MapData(allItems)
            }
            res.status(200).json(data);
        }
    });
})
// READ ONE
// CREATE ONE
router.post("/", (req, res) => {
    res.send("Soon...");
});

//////// ROUTES END ////////

// Map data to exclude keys like "_id" from the response
function MapData(data) {
    const mappedData = data.map(item => {
        // Decide what keys to include in response
        return {
            name: item.name,
            types: item.types,
            containers: item.containers
        }
    });
    return mappedData;
}

// Export router
module.exports = router;