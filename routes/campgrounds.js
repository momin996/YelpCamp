import express from "express";
import multer from "multer";
import catchAsync from "../utils/catchAsync.js";
import campgrounds from "../controllers/campgrounds.js"
import { isLoggedIn, isAuthor, validateCampground } from "../middleware.js";


const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.route("/")
    .get(catchAsync(campgrounds.index))
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
    .post(upload.array("image"), (req, res) => {
        console.log(req.body, req.files);
        res.send("It worked");
    })

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));


export default router;