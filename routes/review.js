const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isReviewAuthor,validateReview,isLoggedIn } = require("../middleware.js");
const reviewController=require("../controllers/reviews.js");




//create
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


//delete review
router.delete("/:reviewId",isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;