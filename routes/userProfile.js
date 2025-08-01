const express=require('express');
const router=express.Router()
const userProfile=require("../models/usermodel");
const uploads=require("../multerconfig_user");
router.get("/employee/profile",async (req,res)=>{
    if(!req.session.user)
{
 return res.redirect("/")
}
    console.log(req.session.user?.email)
    try{
        if(!req.session.user)
        {
            return res.redirect("/employee")
        }
        
        const profile=await userProfile.findOne({userid:req.session.user.id})
        if(!profile){
            return res.render("employee/profile",{
                profile:null,
                success:false,
                sessionUser: req.session.user,
                title:"Profile Page"
            });
        }
        if(profile){
    res.render("employee/profile",{
    profile,
    success:true,
     sessionUser: req.session.user,
     title:"Profile Page"
  });
}
}
catch(err)
{
    console.log(err);
}
})



function calculateAge(dobString) {
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}


router.post("/employee/profile", uploads, async (req, res) => {
    if(!req.session.user)
{
 return res.redirect("/")
}
  const {
    fname,
    lname,
    summary,
    education,
    profession,
    mobile,
    skills,
    experience,
    address,
    city,
    state,
    dob
  } = req.body;
  const age=calculateAge(dob);
  const summaryArr = summary ? summary.split(".").map(s => s.trim()) : [];
  const educationArr = education ? education.split(".").map(e => e.trim()) : [];
  const skillsArr = skills ? skills.split(",").map(s => s.trim()) : [];

  // const logo = req.files['logo']?.[0];
  // const resume=req.files['resume']?.[0];
  const logo = req.files['logo']?.[0]?.filename;    // Save filename only or full path
  const resume = req.files['resume']?.[0]?.filename;


  console.log(logo);
  console.log(resume);

  try {
    // Update if exists, otherwise create
    await userProfile.findOneAndUpdate(
      { userid: req.session.user.id },
      {
        logo,
        resume,
        fullname: { firstname: fname, lastname: lname },
        dateofbirth:dob,
        age:age,
        summary: summaryArr,
        education: educationArr,
        experience,
        currentprofession: profession,
        skills: skillsArr,
        mobile,
        address,
        city,
        state,
        email: req.session.user.email,
        userid: req.session.user.id
      },
      { upsert: true, new: true }
    );

    return res.redirect("/employee/profile");
  } catch (err) {
    console.log("Error updating profile:", err);
    return res.status(500).send("Profile update failed");
  }
});



module.exports=router;