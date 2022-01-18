const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors");
const cookieSession = require("cookie-session");
const dotenv = require("dotenv")
const authRoute = require("./routes/auth")
const profileRoute = require("./routes/profile")
const sessionRoute = require("./routes/session")
const requestRoute = require("./routes/request")
const paymentRoute = require("./routes/payment")
const calendarRoute = require("./routes/calendar")

dotenv.config("./.env");
const port = process.env.PORT || 5000;
const app = express();
const dbURI = process.env.MONGODB_URI;

app.use(
    cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
  );
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
      origin: process.env.fehost,
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    })
);

mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true})
.then((result)=>{
    console.log('connected to database');

    app.use("/auth",authRoute);
    app.use("/profile",profileRoute);
    app.use("/session",sessionRoute);
    app.use("/request",requestRoute);
    app.use("/payment",paymentRoute);
    app.use("/calendar",calendarRoute);

    app.listen(port,()=>{
        console.log(`Server is Running on Port ${port}`);
    })
})
.catch((err)=>console.log(err));

