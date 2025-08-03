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
// MongoDB Connection
mongoose.connect("mongodb+srv://amitsaini:BIrQCs8R08yF0Vyj@jobportaldb.5pvwbhg.mongodb.net/?retryWrites=true&w=majority&appName=jobportaldbno", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));
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
