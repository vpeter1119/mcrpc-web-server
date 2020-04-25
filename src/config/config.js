const config = require("./config.json");

config.mongoUri = process.env.MONGODB_URI;
config.production = process.env.PRODUCTION == "false" ? false : true;

function ExportConf() {
    return config;
}

module.exports = ExportConf();