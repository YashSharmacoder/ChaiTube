import dotenv from "dotenv";
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
    path: './.env'
})



connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
    console.log(`Server is running at port : ${process.env.PORT}`)
    
})
})
.catch((err) => {
    console.log("MONGO db connection faile !!! ",err);
    
})