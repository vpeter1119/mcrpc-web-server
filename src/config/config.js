const config = require("./config.json");
require("dotenv").config();

config.mongoUri = process.env.MONGODB_URI;
config.production = process.env.PRODUCTION == "false" ? false : true;
config.port = process.env.PORT || 3000;

function ExportConf() {
    return config;
}

module.exports = ExportConf();