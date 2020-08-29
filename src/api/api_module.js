var router = require("express").Router();

// Import API modules
const auth = require("./auth/auth_module");
const beverages = require("./beverages/beverages_module");
const desperados = require("./desperados/desp_module");
const geojson = require("./geojson/geojson_module");
const generate = require("./generate/generate_module");
const inventory = require("./inventory/inventory_module");
const moments = require("./moments/moments_module");
const notes = require("./notes/notes_module");

// Declare the API endpoints and import the modules
router.use("/auth", auth);
router.use("/beverages", beverages);
router.use("/desperados", desperados);
router.use("/geojson", geojson);
router.use("/generate", generate.router);
router.use("/inventory", inventory);
router.use("/moments", moments);
router.use("/notes", notes);

// Get information on API endpoints
var emptyProps = {
    desc: "N/A",
    methods: []
};
var apiProps = {
    auth: auth.properties || emptyProps,
    beverages: beverages.properties || emptyProps,
    desperados: desperados.properties || emptyProps,
    geojson: geojson.properties || emptyProps,
    generate: generate.properties || emptyProps,
    inventory: inventory.properties || emptyProps,
    moments: moments.properties || emptyProps,
    notes: notes.properties || emptyProps,
}

// Create an array of routes => ["/<route1>","/<route2>"]
let routes = [];
router.stack.forEach(middleware => {
    let string = middleware.regexp.toString();
    let path = "/" + string.split("/")[2].replace(/\\/g, "");
/* We could add the supported methods here */
    let apiName = path.slice(1, path.length);
    apiRoute = {
        path: path,
        desc: apiProps[apiName].desc,
        methods: apiProps[apiName].methods
    }
    routes.push(apiRoute);
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