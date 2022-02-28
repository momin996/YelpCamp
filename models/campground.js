import mongoose from "mongoose";
import Review  from "./review.js";
// const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
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