import express from 'express'
import ReviewsCtrl from "./reviewsController.js"
const router = express.Router();

// //Hello world test
// router.route("/").get((req, res) => res.send("Hello World!"))

// Route to get reviews for a specific movie
router.route("/:mediaType/:id").get(ReviewsCtrl.apiGetReviews);

// Route to create a new review
router.route('/new').post(ReviewsCtrl.apiPostReview);

// Routes to get, update, and delete a specific review by ID
router.route('/:id')
  .get(ReviewsCtrl.apiGetReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview);

export default router;


