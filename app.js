const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");


const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to mongo");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res) => {
    res.send("home");
});



app.get("/listings", wrapAsync(async (req, res) => {

    const allListings = await Listing.find({});

    res.render("./listings/index.ejs", { allListings })
}));


app.get("/listings/new", (req, res) => {


    res.render("listings/new.ejs");
});



app.get("/listings/:id",wrapAsync( async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id);

    res.render("listings/show.ejs", { listing });

}));

//create route
app.post("/listings",
    wrapAsync(async (req, res) => {

        if(!req.body.listing){
            throw new ExpressError(400,"Send valid data for listing");
        }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id);

    res.render("listings/edit.ejs", { listing });

}));
app.put("/listings/:id",wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    res.redirect(`/listings/${id}`);
}));


app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
}));



app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {

    let { statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).send(message);
});

app.listen(port, () => {
    console.log("working");
});