const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Employer=require("../models/employeer");
const path=require("path");
const nodemailer=require('nodemailer');
router.get("/",(req,res)=>{
  res.render("index");
})
router.get("/employee", (req, res) => {
  res.render("employee/employee", { message: null, success: false });  // Looks for views/employee.ejs
});
// GET - Show Registration/Login Form
router.get("/register", (req, res) => {
  res.render("employee", { message: null, success: false });
});

// POST - Register
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST: /register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!email || !name || !password) {
      return res.render("employee/employee", {
        message: "Fill all Details",
        success: false,
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.render("employee/employee", {
        message: "User already registered!",
        success: false,
      });
    }

    // ✅ Store temp data in session
    const otp = generateOTP();
    req.session.tempUser = { name, email, password };
    req.session.otp = otp;
    req.session.otpExpires = Date.now() + 10 * 60 * 1000;

    // ✅ Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sainikataria2002@gmail.com",
        pass: "kroalnhfwkvnywjp",
      },
    });

    await transporter.sendMail({
      from: '"Job Portal" <no-reply@jobportal.com>',
      to: email,
      subject: "Your OTP for Email Verification",
      html: `<h3>Your OTP is: ${otp}</h3><p>This is valid for 10 minutes.</p>`,
    });

    // ✅ Render OTP entry form
    return res.render("employee/verify-otp", {
      email: email,
      message: "OTP sent to your email",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//otp
// POST: /verify-otp
router.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;
  const { tempUser, otp: sessionOtp, otpExpires } = req.session;

  if (!tempUser || !sessionOtp) {
    return res.render("employee/employee", {
      message: "Session expired. Please register again.",
      success: false,
    });
  }

  if (Date.now() > otpExpires) {
    return res.render("employee/employee", {
      message: "OTP expired. Please register again.",
      success: false,
    });
  }

  if (otp !== sessionOtp) {
    return res.render("employee/verify-otp", {
      email: tempUser.email,
      message: "Incorrect OTP. Please try again.",
    });
  }

  try {
    const newUser = new User(tempUser);
    await newUser.save();

    // clear session
    req.session.tempUser = null;
    req.session.otp = null;
    req.session.otpExpires = null;

    return res.render("employee/employee", {
      message: "Registration successful! You can now log in.",
      success: true,
    });
  } catch (err) {
    console.error("Error saving user after OTP:", err);
    return res.render("employee/employee", {
      message: "Something went wrong.",
      success: false,
    });
  }
});


//employeer register
router.get('/employeer',(req,res)=>{
  res.render("employeer/employeer",{ message: null, success: false });
})
router.post('/employer_reg',async(req,res)=>{
  const {name,email,password}=req.body;
  try{
    const exists=await Employer.findOne({email});
    if (exists) {
      return res.render("employeer/employeer", {
        message: "Email already registered!",
        success: false,
        title:"Login Page"
      });
    }
if(email=='' || name=="" || password==""){
      return res.render("employeer/employeer",{
        message:"Fill all Details",
        success:false
      });
    }
    const newEmployer = new Employer({ name, email, password });
    await newEmployer.save();
    
    return res.render("employeer/employeer", {
      message: "Registration successful! Redirecting...",
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
  
  
})
//employeer Login
router.post("/employer_login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const employer = await Employer.findOne({ email });

    if (!employer) {
      return res.render("employeer/employeer", {
        message: "Employeer not found!",
        success: false,
      });
    }

    if (employer.password !== password) {
      return res.render("employeer/employeer", {
        message: "Invalid password!",
        success: false,
      });
    }
    req.session.user = {
      id: employer._id,
      name: employer.name,
      email: employer.email,
    };
    if(req.session.user){
    return res.redirect("employeer/dashboard")
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//Logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// POST - Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("employee/employee", {
        message: "User not found!",
        success: false,
      });
    }

    if (user.password !== password) {
      return res.render("employee/employee", {
        message: "Invalid password!",
        success: false,
      });
    }

      req.session.user = {
      id: user._id,
      name: user.name,
      email:user.email,
    };
    if(req.session.user)
    {
     return res.redirect("/employee/jobs");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET - Jobs Page
// router.get("/employee/jobs", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/employee/jobs.html"));
// });

module.exports = router;
