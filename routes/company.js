const express=require('express');
const  router=express.Router();
const companies=require("../models/co_model");
router.get("/employee/companydetail/:id",async(req,res)=>{
    console.log(req.params.id);
const company=await companies.find({employerId:req.params.id});
if(company){
    res.render("employee/companydetail",
        {
            company,
            success:true,
            title:"Comapny Detail"
        }
    )
}
})
module.exports=router;