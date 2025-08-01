const express = require("express");
const router = express.Router();
const Jobs=require("../models/jobs")
const Employer=require("../models/employeer");
const path=require("path");
let sessionLog='';
router.get("/addNewJob",(req,res)=>{
    if(!req.session.user)
{
 return res.redirect("/")
}
  // console.log(req.session.user?.id)
  res.render("employeer/addNewJob",{
    message:null,
    success:false,
    sessionUser: req.session.user || null,
    title:"Add Job"
  });
})
router.post("/newjob",async (req,res)=>{
    if(!req.session.user)
{
 return res.redirect("/")
}
const {title,description,education,skills,vacancy,salary,lastDate,postedDate,postedBy}=req.body;
const skillArray = skills.split(',').map(skill => skill.trim()); 
const descArray=description.split('.').map(description=>description.trim());
const eduArray=education.split('.').map(education=>education.trim());
try{
    const newJob=new Jobs({
        title,description:descArray,education:eduArray,skills:skillArray,vacancy,salary,lastDate,companyname:req.session.user?.name,postedDate:Date.now(),postedBy:req.session.user?.id
    })
    await newJob.save();
    return res.render("employeer/addNewJob",{
        sessionUser: req.session.user || null,
        message:"Successfully Inserted",
        success:true,
        title:"Add Job"
    });
}
catch (error) {
    console.error("Job creation failed:", error);
    res.render("employeer/addNewJob", {
         sessionUser: req.session.user || null,
      message: "Failed to post job",
      success: false,
      title:"Add Job"
    });
  }
})
module.exports=router;