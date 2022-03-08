import mongoose from "mongoose";
import Review  from "./review.js";
// const mongoose = require('mongoose');


const Schema = mongoose.Schema;

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
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

CampgroundSchema.post("findOneAndDelete", async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
});

const Campground = mongoose.model("Campground", CampgroundSchema);
export default Campground;