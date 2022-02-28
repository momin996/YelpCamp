import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import methodOverride from 'method-override';
import mongoose from "mongoose";
import ejsMate from "ejs-mate";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import ExpressError from "./utils/ExpresError.js";
import userRoutes from "./routes/users.js"
import campgroundRoutes from "./routes/campgrounds.js"
import reviewRoutes from "./routes/reviews.js"
import User from "./models/user.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { Strategy as LocalStrategy } from "passport-local";
// const LocalStrategy = require("passport-local");
// npm run dev

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
    console.log("Connection to DB successful");
});

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.set("views", join(__dirname, "/views"));

app.engine("ejs", ejsMate);

// Make public directory accesible directly
app.use(express.static(join(__dirname, "public")));
// Get form data in req object as body
app.use(express.urlencoded({extended:true}));
// Override Form Methods
app.use(methodOverride("_method"));
// Configure Session
const sessionConfig = {
    secret: "thisshouldbeabettersecrect",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000*60*60*24*7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// Route Handlers
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

// Root Route
app.get("/", (req, res) => {
    res.render("home");
});

// Unhandled Routes
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

// Express Error Middleware
app.use((err, req, res , next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Ohh NO, Something went wrong!!!";
    res.status(statusCode).render("error", {err});
});

// Starting Express Server
app.listen(port, () =>{
    console.log(`Listening on port ${port}`);
});