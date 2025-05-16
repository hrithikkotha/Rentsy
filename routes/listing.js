const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const methodOverride = require("method-override");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(validateListing, wrapAsync(listingController.createListing));

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isOwner, isLoggedIn, validateListing, wrapAsync(listingController.updateListing))
    .delete(isOwner, isLoggedIn, wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(listingController.renderEditForm));



module.exports = router;