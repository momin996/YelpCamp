import express from "express";
import users from "../controllers/users.js"
import catchAsync from "../utils/catchAsync.js";
import passport from "passport";

const router = express.Router();

router.route("/register")
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser));

router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: "/login"}), catchAsync(users.loginUser));

router.get("/logout", users.logoutUser);

export default router;