// const uuid = require("uuid/v4");
const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find a place.",
            500
        );
        return next(error);
    }

    if (!place) {
        const error = new HttpError(
            "Could not find place for the provided id.",
            404
        );
        return next(error);
    }

    res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    //there could be an alternative with populate method:
    //  let usersPlaces;
    //  try {
    //      usersPlaces = await User.findbyId(userId).populate("places");
    //  }

    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate("places");
    } catch (err) {
        const error = new HttpError(
            "Fetching places failed, please try again later.",
            500
        );
        return next(error);
    }

    // if (!places || places.length === 0) {
    if (!userWithPlaces || userWithPlaces.places.length === 0) {
        return next(
            new HttpError(
                "Could not find places for the provided user id.",
                404
            )
        );
    }

    res.json({
        places: userWithPlaces.places.map((place) =>
            place.toObject({ getters: true })
        ),
    });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: req.file.path,
        creator,
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError(
            "Creating place failed, please try again.",
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            "Could not find user for provided id.",
            404
        );
        return next(error);
    }

    console.log(user);

    try {
        await createdPlace.save();
        user.places.push(createdPlace);
        user.save();
        ///////////////////update my mongo on local////////////////////////////
        // const sess = await mongoose.startSession();
        // sess.startTransaction();
        // await createdPlace.save({ session: sess }); //save place first for it to get an id
        // user.places.push(createdPlace); //store that id in users obj
        // await user.save({ session: sess }); //save updated user obj
        // await sess.commitTransaction();
        //   //in this case if anything goes wrong the db is not changed
        //////////////////////////////////////////////////////////////
    } catch (err) {
        const error = new HttpError(
            "Creating place failed, please try again.",
            500
        );
        return next(error);
    }

    res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req); //it will look at validation object and look for errors in routerFile
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    // changing key values in an immutable way for error prevention:
    // const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
    // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
    // updatedPlace.title = title;
    // updatedPlace.description = description;
    //if the process is successfull, replacing the actual val
    // DUMMY_PLACES[placeIndex] = updatedPlace;
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not update place.",
            500
        );
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not update place.",
            500
        );
        return next(error);
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        //populate method will work because Place has ref: in user and vice versa
        place = await Place.findById(placeId).populate("creator");
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete place.",
            500
        );
        return next(error);
    }

    if (!place) {
        const error = new HttpError("Could not find place for this id.", 404);
        return next(error);
    }

    const imagePath = place.image;

    try {
        place.creator.places.pull(place);
        place.creator.save();
        await place.remove();

        //////////////////update  my mongo on a local, cant proccess sessions///////////////////////////
        // const sess = await mongoose.startSession();
        // sess.startTransaction();
        // await place.remove({ session: sess }); //remove the place
        // place.creator.places.pull(place); //remove the id from user
        // await place.creator.save({ session: sess }); //save newly looking users obj
        // await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete place.",
            500
        );
        return next(error);
    }

    fs.unlink(imagePath, (err) => {
        console.log("Err", err);
    });

    res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
