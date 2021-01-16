const axios = require("axios");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { MAP_KEY } = require("../secrets.json");
const geoCoder = mbxGeocoding({
    accessToken: MAP_KEY,
});

const HttpError = require("../models/http-error");

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

        const coordinates = { lat: location[1], lng: location[0] }; // location = [lng, lat]

        return coordinates;
    }
}

module.exports = getCoordsForAddress;
