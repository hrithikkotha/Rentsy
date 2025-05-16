const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const methodOverride = require("method-override");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController=require("../controllers/listings.js");


//index route
router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show Route
router.get("/:id", wrapAsync(listingController.showListing));


//create route
router.post("/", validateListing, wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(listingController.renderEditForm));

//update
router.put("/:id", isOwner, isLoggedIn, validateListing, wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id", isOwner, isLoggedIn, wrapAsync(listingController.destroyListing));


module.exports = router;