import express from "express";
const router = express.Router();
import {
  createReview,
  getAllReviews,
  getReviewsByGeoCode,
} from "../controller/userReviews";

router.get("/", getAllReviews); // only by the user
// router.get("/u/:id", getReviewsByUser);
router.get("/g/:id", getReviewsByGeoCode);
router.post("/", createReview);
// router.delete("/:id", deleteReview);

export default router;
