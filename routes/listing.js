const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const methodOverride = require("method-override");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    // console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);

    } else {
        next();
    }
};


//index route
router.get("/", wrapAsync(async (req, res) => {

    const allListings = await Listing.find({});
        // console.log("Flash message in GET /listings:", req.flash("success")); // Debugging log
    res.render("./listings/index.ejs", { allListings })
}));

//new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});


//show Route
router.get("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
       return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });

}));




//create route
router.post("/", validateListing,
    wrapAsync(async (req, res, next) => {
        // console.log("req.body.listing:", req.body.listing); // Debugging log
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success","New Listing Created");
        
        res.redirect("/listings");
    }));


//edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
         req.flash("error","Listing you requested does not exist!");
       return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });

}));

//update
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    // const listing = await Listing.findById(id);



    // if (!req.body.listing.image || req.body.listing.image.trim() === "") {
    //     req.body.listing.image = listing.image.url;
    // }

    
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted!");
    res.redirect("/listings");
}));


module.exports = router;