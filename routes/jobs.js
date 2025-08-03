const express=require('express');
const router=express.Router();
const jobs=require('../models/jobs');
const applied=require('../models/applyjob');
router.get("/employee/jobs",async (req,res)=>{
     if(!req.session.user)
{
 return res.redirect("/")
}  
    const userId = req.session.user?.id;
   const appliedJobs = await applied.find({ userid: userId }, "job_id");
   
        const appliedJobIds = appliedJobs.map(app => app.job_id);

        
        const alljobs = await jobs.find({ _id: { $nin: appliedJobIds}});

    if(alljobs){
        res.render("employee/jobs",{
            alljobs,
            message:false,
            title:"Home Page"
        })
    }
    else{
        return res.render("employee/jobs",{message:"No Job Founds",title:"Home Page"})
    }

})
module.exports=router;