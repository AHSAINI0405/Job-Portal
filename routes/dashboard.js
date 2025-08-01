const express=require('express');
const router=express.Router();
const path=require('path');
const Jobs=require("../models/jobs");
router.get("/employeer/dashboard",async (req,res)=>{
    try{
       if(!req.session.user)
{
 return res.redirect("/")
}
        console.log(req.session.user?.name);
    // const allJobs=await Jobs.find({ employerId: req.session.user.id })
    const allJobs=await Jobs.find({postedBy:req.session.user?.id})
    return res.render("employeer/dashboard", { jobs: allJobs || [],title:"Dashboard" });
    }
    catch(err){
        console.log(err);
        res.status(500).send("No data Found");
    }
})
module.exports=router;