import Campground from "../models/campground.js";
import cloudinary from "../cloudinary/index.js";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});


const index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
};

const renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

const createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const newCampground = new Campground(req.body.campground);
    newCampground.geoLocation = geoData.body.features[0].geometry;
    newCampground.images = req.files.map(f => ({ url: f.path, fileName: f.filename}));
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Successully made a new campground");
    res.redirect(`/campgrounds/${newCampground._id}`);
};

const showCampground = async (req, res, next) => {
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
};

const renderEditForm = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash("error", "Cannot find that campground");
        res.redirect("/campgrounds");
    } else{
        res.render(`campgrounds/edit`, {campground});
    }
};

const updateCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const images = req.files.map(f => ({ url: f.path, fileName: f.filename}));
    updatedCampground.images.push(...images);
    updatedCampground.geoLocation = geoData.body.features[0].geometry;
    await updatedCampground.save();
    if(req.body.deleteImages){
        console.log(req.body.deleteImages);
        for(let fileName of req.body.deleteImages){
            await cloudinary.uploader.destroy(fileName);
        }
        await updatedCampground.updateOne({ $pull: { images: { fileName: {$in: req.body.deleteImages } } } });
    }
    req.flash("success", "Successully updated campground");
    res.redirect(`/campgrounds/${updatedCampground._id}`);
};

const deleteCampground = async (req, res, next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successully deleted campground");
    res.redirect("/campgrounds");
};


const campgrounds = {
    index,
    renderNewForm,
    createCampground,
    showCampground,
    renderEditForm,
    updateCampground,
    deleteCampground
};

export default campgrounds;