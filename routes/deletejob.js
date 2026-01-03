const express=require('express');
const router=express.Router();
const jobs=require("../models/jobs")
router.post("/employeer/delete/:id",async (req,res)=>{
try{
      if(!req.session.employer)
{
 return res.redirect("/")
}
    await jobs.findByIdAndDelete(req.params.id);
    res.redirect("/employeer/dashboard")
}
catch(err){
    console.error(err);
    res.status(500).send("error in deleting the job");
}
})
module.exports=router;