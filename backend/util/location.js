const axios = require("axios");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({
    accessToken:
        "pk.eyJ1IjoiZGFuaWVsbXVycGh5IiwiYSI6ImNranR2MXljcTA5MHIyd281cTFrMjF0YmYifQ.-QXpFJdrgYchVUxbdAF8Aw",
});

const HttpError = require("../models/http-error");

const API_KEY = "thisIsSuperSecret";

async function getCoordsForAddress(address) {
    // return {
    //     lat: 40.7484474,
    //     lng: -73.9871516,
    // };

    const cd = await geoCoder
        .forwardGeocode({
            query: address,
            limit: 1,
        })
        .send();
    if (!cd) {
        const error = new HttpError(
            "Could not find location for the specified address.",
            422
        );
        throw error;
    } else {
        const location = cd.body.features[0].geometry.coordinates;
        console.log("location location : ", location);

        const coordinates = { lat: location[1], lng: location[0] }; // location = [lng, lat]
        console.log("coordinates from location : ", coordinates);
        return coordinates;
    }
}

module.exports = getCoordsForAddress;
