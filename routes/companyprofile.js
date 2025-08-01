const express = require("express");
const router = express.Router();
const profiles = require("../models/co_model");
const profileLogo = require("../multerconfig");
router.get("/companyprofile", async (req, res) => {
      if(!req.session.user)
{
 return res.redirect("/")
}
    try {
        if(!req.session.user || !req.session.user.id)
        {
             return res.render("employeer/employeer", {
        message: "Login First!",
        success: false,
        title:"Profile",
        message:null
      });
        }
        const profile = await profiles.findOne({ employerId: req.session.user.id });
        if (!profile) {
            return res.render("employeer/profile", {
                profile: null,
                success: false,
                title:"Profile",
                message:null
            });
        }
        if (profile) {
            return res.render("employeer/profile.ejs", { profile, success: true,title:"Profile" ,message:null});
        }
    } catch (err) {
        console.log(err);
    }
});
router.post("/companyprofile/create",profileLogo.single("logo"),async (req, res) => {
      if(!req.session.user)
{
 return res.redirect("/")
}
        try {
            const {
                companyname,
                bio,
                companytype,
                mobile,
                email,
                linkedin,
                facebook,
                twitter,
                address,
                city,
                state,
            } = req.body;
            const exists = await profiles.findOne({
                employerId: req.session.user?.id,
            });
            const logo = req.file ? req.file.filename : null;
            const profiledata ={
                logo,
                companyname,
                bio,
                companytype,
                mobile,
                email,
                socialprofile:{
                    linkedin,
                    facebook,
                    twitter
                },
                address,
                city,
                state,
                employerId: req.session.user?.id,
            };

            if (exists) {
                await profiles.updateOne(
                    { employerId: req.session.user?.id },
                    { $set:profiledata }
                );
                const profile=await profiles.findOne({employerId:req.session.user?.id})
                return res.render("employeer/profile",{
                    profile,
                    success:true,
                    title:"Profile Updated",
                    message:"Profile Updated Successfully"
                })
            } else {
                const upProfile=new profiles(profiledata);
                await upProfile.save();
                const profile=await profiles.findOne({employerId:req.session.user?.id})
                 return res.render("employeer/profile",{
                    profile,
                    success:true,
                    title:"Profile Added",
                    message:"Profile Updated Successfully"
                })
            }
        } catch (err) {
            console.log(err);
        }
    }
);
module.exports = router;
