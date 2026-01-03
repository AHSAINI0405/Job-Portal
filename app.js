const express = require("express");
const path = require("path");
const app = express();
const session=require('express-session');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const newJob=require("./routes/addjob");
const allJobs=require("./routes/dashboard")
const deleteJob=require("./routes/deletejob")
const companyprofile=require("./routes/companyprofile")
const jobs=require("./routes/jobs");
const profile=require("./routes/userProfile");
const applyjob=require("./routes/apply");
const applied=require("./routes/applied");
const application=require("./routes/application")
const companydetail=require("./routes/company");

require("dotenv").config();


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));
require('./crons/cleanjob');

// Middleware
app.use(
  session({
    secret: "secret_1604", 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);
app.use((req, res, next) => {
  res.locals.sessionUser = req.session.user || null;
  next();
});
app.use((req, res, next) => {
  res.locals.sessionEmployer = req.session.employer || null;
  next();
})
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", authRoutes);
app.use("/",newJob);
app.use("/",allJobs);
app.use("/",deleteJob);
app.use("/",companyprofile);
app.use('/',jobs);
app.use('/',profile);
app.use('/',applyjob);
app.use('/',applied);
app.use('/',application)
app.use('/',companydetail);
// Server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
