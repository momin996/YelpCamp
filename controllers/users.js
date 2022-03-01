import User from "../models/user.js";


const renderRegisterForm = (req, res) => {
    res.render("users/register");
};

const registerUser = async (req, res, next) => {
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
    
};

const renderLoginForm = (req, res) => {
    res.render("users/login");
};

const loginUser = async (req, res, next) => {
    req.flash("success", "Welcome back!!!");
    const returnUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(returnUrl);
};

const logoutUser = (req, res) => {
    req.logOut();
    req.flash("success", "Goodbye!!!");
    res.redirect("/campgrounds");
};

const users = {
    renderRegisterForm,
    registerUser,
    renderLoginForm,
    loginUser,
    logoutUser
};

export default users;