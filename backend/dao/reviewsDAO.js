import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO {
  //connect to database
  static async injectDB(conn) {
    //if database connection is already established, return (dont do anything)
    if (reviews) {
      return
    }
    try {
      reviews = await conn.db("reviews").collection("reviews")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in userDAO: ${e}`,
      )
    }
  }

  static async addReview(mediaType, movieId, user, review, rating) {
    try {
      const reviewDoc = {
        mediaType: mediaType,
        movieId: movieId,
        user: user,
        review: review,
        ...(rating > 0 ? { rating } : {})
      }
      return await reviews.insertOne(reviewDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }

  static async getReview(reviewId) {
    try {
      return await reviews.findOne({ _id: new ObjectId(reviewId) })
    } catch (e) {
      console.error(`Unable to get review: ${e}`)
      return { error: e }
    }
  }

  static async updateReview(reviewId, user, review) {
    console.log("rev", reviewId)
    try {
      const updateResponse = await reviews.updateOne(
        { _id: new ObjectId(reviewId) },
        { $set: { user: user, review: review } }
      )
      return updateResponse
    } catch (e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e }
    }
  }


  static async deleteReview(reviewId) {
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: new ObjectId(reviewId),
      })
      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }

  static async getReviewsById(movieId, mediaType) {
    console.log("Querying with:", { movieId: parseInt(movieId), mediaType })
    try {
      const cursor = await reviews.find({ movieId: parseInt(movieId), mediaType: mediaType })
      return cursor.toArray()
    } catch (e) {
      console.error(`Unable to get reviews: ${e}`)
      return { error: e }
    }
  }

}