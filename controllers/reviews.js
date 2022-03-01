import Campground from "../models/campground.js";
import Review from "../models/review.js";


const createReview = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash("success", "Successully made a new review");
    res.redirect(`/campgrounds/${campground._id}`)
 };

const deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successully deleted a review");
    res.redirect(`/campgrounds/${id}`);
};


const users = {
    createReview,
    deleteReview
};

export default users;