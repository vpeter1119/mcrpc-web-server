// This model is based on the RFC 7946 standard.
// See https://geojson.org/
// Properties are needed for rendering geojson features in Leaflet.js
// See https://leafletjs.com/reference-1.6.0.html

const mongoose = require("mongoose");

const options = {
    //Insert any schema options here
    timestamps: true,
}

const geoJSONSchema = mongoose.Schema(
    {
        type: { type: String ,required: true }, // This should always be "Feature"
        geometry: {
            type: { type: String, required: true }, // Possible values: "Point", "LineString", "Polygon"
            coordinates: { type: Array, required: true }, // format: [<Latitude>,<Longitude>]
        },
        properties: {
            map: String,
            name: String,
            minZoom: Number,
            maxZoom: Number,
            url: String,
            desc: String,
            markerOptions: Object,
            category: String,
            icon: String
        }
    },
    options
);

const GeoJSON = mongoose.model("GeoJSON", geoJSONSchema, "GeoJSON");

module.exports = GeoJSON;