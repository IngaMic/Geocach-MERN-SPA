const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const { WEB_TOKEN } = require("../secrets.json");

module.exports = (req, res, next) => {
    //browser behaviour handling with "OPTIONS"header before any other than GET
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        //req.body for conditioning doesn't work here, not all req have body
        const token = req.headers.authorization.split(" ")[1]; //Authorization: "Bearer TOKEN"
        if (!token) {
            throw new Error("Authentication failed");
        } else {
            const decodedToken = jwt.verify(token, WEB_TOKEN); //validating the token
            req.userData = {
                userId: decodedToken.userId, //adding Data to this req
            };
            next(); //let the req continue
        }
    } catch (err) {
        const error = new HttpError(
            "Authentication failed, please try again.",
            403
        );
        return next(error);
    }
};
