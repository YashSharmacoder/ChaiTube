import express from "express";
import cookieParser from "cookie-parser";




const app =express();

import cors from "cors";

app.use(
  cors({
    origin: [
      "https://yashtube.vercel.app", // Aapka live Vercel frontend URL
      "http://localhost:5173",       // Local testing ke liye
    ],
    credentials: true, // Agar cookies ya authorization headers use kar rahe hain
  })
);

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true,limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



//routes
import userRouter from './routes/user.route.js'
import videoRouter from './routes/video.route.js'
import tweetRouter from "./routes/tweet.route.js"
import commentRouter from "./routes/comment.route.js"
import playlistRouter from './routes/playlist.route.js'
import subscriptionRouter from './routes/subscription.route.js'
import likeRouter from './routes/like.route.js'
import dashboardRouter from './routes/dashboard.route.js'
import healthcheckRouter from './routes/healthcheck.routes.js'

app.get("/test", (req,res) =>{
    console.log("test route hit");
    res.send("yash");
    
})



//routes declaration

app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/tweets",tweetRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/playlists",playlistRouter)
app.use("/api/v1/subscriptions",subscriptionRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// http://localhost:8000/api/v1/users/register


export { app }