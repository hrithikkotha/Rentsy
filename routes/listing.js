const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const methodOverride = require("method-override");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");




//index route
router.get("/", wrapAsync(async (req, res) => {

    const allListings = await Listing.find({});
    // console.log("Flash message in GET /listings:", req.flash("success")); // Debugging log
    res.render("./listings/index.ejs", { allListings })
}));

//new route
router.get("/new", isLoggedIn, (req, res) => {


    res.render("listings/new.ejs");
});


//show Route
router.get("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({ 
        path: "reviews",
        populate: { 
            path: "author",
        },
     })
     .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });

}));




//create route
router.post("/", validateListing,
    wrapAsync(async (req, res, next) => {
        // console.log("req.body.listing:", req.body.listing); // Debugging log
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created");

        res.redirect("/listings");
    }));


//edit route
router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });

}));

//update
router.put("/:id", isOwner, isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;

    if (typeof req.body.listing.image === "string") {
        req.body.listing.image = {
            url: req.body.listing.image,
            filename: "custom"
        };
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", isOwner, isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
}));


module.exports = router;