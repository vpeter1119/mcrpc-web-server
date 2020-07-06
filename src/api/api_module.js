var router = require("express").Router();

// Declare the API endpoints and import the modules
router.use("/beverages", require("./beverages/beverages_module"));
router.use("/geojson", require("./geojson/geojson_module"));
router.use("/inventory", require("./inventory/inventory_module"));
router.use("/moments", require("./moments/moments_module"));
router.use("/notes", require("./notes/notes_module"));
router.use("/desperados", require("./desperados/desp_module"));

// Create an array of routes => ["/<route1>","/<route2>"]
let routes = [];
router.stack.forEach(middleware => {
    let string = middleware.regexp.toString();
    let path = "/" + string.split("/")[2].replace(/\\/g, "");
    /* We could add the supported methods here */
    routes.push(path);
});

// API root route displays a message and the array of available routes
router.get("/", (req, res) => {
    var jsonResponse = {
        message: "This is the api root. Use the endpoints, Luke!",
        endpoints: routes
    }
    res.status(200).json(jsonResponse);
})

module.exports = router;