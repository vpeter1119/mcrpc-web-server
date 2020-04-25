// Import configuration
const {
    mongoUri,
    port,
    production
} = require("./config/config.js");
global.debug = !production;

// Require npm packages
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Set up database connection
const mongoose = require("mongoose");
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose.connect(mongoUri,mongoOptions,err => {
        if (!err) {
            console.log("Connected to database.");
        } else {
            console.log(err);
            console.log("Did not connect to database.");
        }
    }
);


// Set up body-parser
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

// Configure HTTP headers
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    next();
});

// Set up root route
app.get("/", (req, res) => {
    res.send("If you see this, the server is running. Cheers!");
});

// Import API module that contains all the endpoints
const apiModule = require("./api/api_module");
app.use("/api", apiModule);

app.listen(port, () => console.log(`Server listening on port ${port}!`));

//exports.web = app;
