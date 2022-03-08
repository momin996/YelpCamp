import mongoose from "mongoose";
import cities from "./cities.js";
import pkg from './seedHelpers.js';
import Campground from "../models/campground.js";

const { places, descriptors } = pkg;

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "62165f5152a9ec6352e0679b",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/djxs5wzox/image/upload/v1646498168/Yelpcamp/vtib5awdccsufvahoozn.jpg',
                  fileName: 'Yelpcamp/vtib5awdccsufvahoozn'
                },
                {
                  url: 'https://res.cloudinary.com/djxs5wzox/image/upload/v1646498176/Yelpcamp/ajyw9jlzbbugtpix0wl9.jpg',
                  fileName: 'Yelpcamp/ajyw9jlzbbugtpix0wl9'
                }
              ],
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi eum, praesentium at reiciendis, earum fugiat quod ad dolore qui inventore rerum ut esse enim aperiam repudiandae dolorum assumenda debitis optio.",
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})