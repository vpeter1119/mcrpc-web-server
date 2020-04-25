var router = require("express").Router();

// Declare the API endpoints and import the modules
router.use("/moments", require("./moments/moments_module"));

// Set up api root route
router.get("/", (req, res) => {
    res.send("This is the api root. Use the endpoints, Luke!");
})

module.exports = router;