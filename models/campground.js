import mongoose from "mongoose";
import Review  from "./review.js";
// const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const opts = { toJSON: {virtuals: true}}

const ImageSchema = new Schema({
    url: String,
    fileName: String
});

ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_200");
})

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: {
        type: Number,
        min: 0
    },
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
}, opts);

CampgroundSchema.virtual("properties.popupMarkup").get(function() {
    return `<h4><strong><a href="/campgrounds/${this._id}">${this.title}</a></strong></h4>
            <p>${this.location}</p>`
})

CampgroundSchema.post("findOneAndDelete", async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
});

const Campground = mongoose.model("Campground", CampgroundSchema);
export default Campground;