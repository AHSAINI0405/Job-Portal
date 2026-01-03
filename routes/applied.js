const express=require('express');
const router=express.Router();
const appliedJobs=require('../models/applyjob');
router.get("/employee/applied", async(req,res)=>{
    if(!req.session.user)
{
 return res.redirect("/")
}
    try{
        const jobs=await appliedJobs.find({userid:req.session.user?.id});
        if(jobs)
        {
            return res.render("employee/applied",{
                jobs,
                success:true,
                message:null,
                title:"Applied Jobs"
            })
        }
        else{
            return res.render("employee/applied",{
                success:false,
                message:"Currently no job applied By you",
                title:"Apply Jobs"
            })
        }
    }
    catch(err)
    {
        console.log(err)
    }
} )
module.exports=router;