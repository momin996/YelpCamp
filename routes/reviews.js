import express from "express";
import Campground from "../models/campground.js";
import Review from "../models/review.js";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn, isReviewAuthor, validateReview } from "../middleware.js";


const router = express.Router({mergeParams: true});

router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash("success", "Successully made a new review");
    res.redirect(`/campgrounds/${campground._id}`)
 }))
 
 router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res, next) => {
     const { id, reviewId } = req.params;
     await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
     await Review.findByIdAndDelete(reviewId);
     req.flash("success", "Successully deleted a review");
     res.redirect(`/campgrounds/${id}`);
 }))

 export default router