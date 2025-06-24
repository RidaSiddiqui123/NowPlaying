import app from "./server.js"
import mongodb from "mongodb"
//import mongoose from "mongoose"
import ReviewsDAO from "./dao/reviewsDAO.js"
import dotenv from 'dotenv';

dotenv.config();

//Connect to MongoDB
const MongoClient = mongodb.MongoClient;
const port = 8000;
const mongoURL  = "mongodb+srv://rida:IpkYdNb5x2jJjcn6@cluster0.gm3dmu3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

MongoClient.connect(
    mongoURL,
  {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true
  })
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    //send database connection to ReviewsDAO, which will be used to access the database
    await ReviewsDAO.injectDB(client)
    app.listen(port,  () => {
      console.log(`listening on port ${port}`)
    })
  })

