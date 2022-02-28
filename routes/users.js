import express from "express";
import User from "../models/user.js";
import ExpressError from "../utils/ExpresError.js";
import catchAsync from "../utils/catchAsync.js";
import passport from "passport";

const router = express.Router();

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", catchAsync(async (req, res, next) => {
    try {
        const {username, password, email} = req.body;
        const newUser = new User({username, email});
        const registerdUser = await User.register(newUser, password);
        req.login(registerdUser, (err) => {
            if(err) next(err);
            req.flash("success", "Welcome to Yelpcamp!");
            res.redirect("/campgrounds");
        })
        
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/register");
    }
    
}));

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", passport.authenticate('local', {failureFlash: true, failureRedirect: "/login"}), catchAsync(async (req, res, next) => {
    req.flash("success", "Welcome back!!!");
    const returnUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(returnUrl);
}));

router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "Goodbye!!!");
    res.redirect("/campgrounds");
})

export default router;