import express from "express";
import Campground from "../models/campground.js";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn, isAuthor, validateCampground } from "../middleware.js";

const router = express.Router();

router.get("/", catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Successully made a new campground");
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

router.get("/:id", catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("author");
    if(!campground){
        req.flash("error", "Cannot find that campground");
        res.redirect("/campgrounds");
    } else{
        res.render("campgrounds/show", {campground});
    }
}));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash("error", "Cannot find that campground");
        res.redirect("/campgrounds");
    } else{
        res.render(`campgrounds/edit`, {campground});
    }
}));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Successully updated campground");
    res.redirect(`/campgrounds/${updatedCampground._id}`);
}));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successully deleted campground");
    res.redirect("/campgrounds");
}));

export default router;