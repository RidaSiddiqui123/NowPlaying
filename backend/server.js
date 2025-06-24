import express from "express"
import cors from "cors"
import reviews from "./api/reviews.js"

// const cors = require("cors");
// require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json())
import ReviewsDAO from './dao/reviewsDAO.js';

app.get("/", (req, res) => {
  res.send("🎉 Backend is working and reachable!");
});

app.use("/api/reviews", reviews)
app.use("/*path", (req, res) => res.status(404).json({ error: "not found"}))

export default app


