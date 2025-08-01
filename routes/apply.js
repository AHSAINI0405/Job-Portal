const express = require('express');
const router = express.Router();
const jobs = require('../models/jobs');
const users = require('../models/usermodel');
const apply = require('../models/applyjob');

// 🧠 Middleware: Reusable validation function
function isEmpty(value) {
  return !value || value.trim() === "";
}

// 🟩 GET: Render Apply Job Page
router.get("/employee/applyjob/:id", async (req, res) => {
    if(!req.session.user)
{
 return res.redirect("/")
}
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.redirect("/employee");

    const job = await jobs.findById(req.params.id);
    const user = await users.findOne({ userid: userId });

    if(!user)
    {
      return res.render("employee/profile",{
        success:false,
        profile:null,
        title:"Apply"
      })
    }
    if (!job) {
      return res.status(404).send("Job or user not found");
    }

    return res.render("employee/applyjob", {
      job,
      user,
      success: true,
      sessionUser: req.session.user,
      title:"Apply"
    });

  } catch (err) {
    console.error("GET applyjob error:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// 🟩 POST: Apply to Job
router.post("/employee/applyjob/:id", async (req, res) => {
    if(!req.session.user)
{
 return res.redirect("/")
}
  const {
    firstname, lastname, summary, mobile, education,
    skills, city, state, experience, currentprof,
    email, current_ctc, exp_ctc, jobtype,resume
  } = req.body;

  const userId = req.session.user?.id;


  const requiredFields = [firstname, lastname, summary, mobile, education, skills, city, state, experience, currentprof, email, current_ctc, exp_ctc, jobtype];
  if (requiredFields.some(isEmpty)) {
    return renderApplyFormWithError(req, res, "Please fill in all fields.");
  }

  
  const currentCTC = parseFloat(current_ctc);
  const expectedCTC = parseFloat(exp_ctc);
  if (isNaN(currentCTC) || isNaN(expectedCTC) || currentCTC < 0 || expectedCTC < 0) {
    return renderApplyFormWithError(req, res, "CTC must be a positive number.");
  }

  try {
    const job = await jobs.findById(req.params.id);
    const user = await users.findOne({ userid: userId });

    if(!user)
    {
      return res.render("/employee/profile",{
        success:false
      })
    }
    if (!job) return res.status(404).send("Job or user not found");

    const application = new apply({
      firstname,
      lastname,
      summary,
      mobile,
      education,
      skills: skills.split(",").map(s => s.trim()),
      city,
      state,
      experience,
      currentprof,
      email,
      userid: userId,
      current_ctc: currentCTC,
      exp_ctc: expectedCTC,
      jobtype,
      job_id: job._id,
      job_title: job.title,
      lastDate: job.lastDate,
      companyName: job.companyname,
      resume
    });

    await application.save();

    const userJobs = await apply.find({ userid: userId });

    return res.render("employee/applied", {
      message: "Applied Successfully",
      success: true,
      jobs: userJobs,
      title:"Apply"
    });

  } catch (err) {
    console.error("POST applyjob error:", err);
    return res.status(500).send("Server error while applying");
  }
});

// 🧠 Helper: Centralized form rendering on error
async function renderApplyFormWithError(req, res, errorMessage) {
  const job = await jobs.findById(req.params.id);
  const user = await users.findOne({ userid: req.session.user?.id });

  return res.render("employee/applyjob", {
    job,
    user,
    success: false,
    message: errorMessage,
    sessionUser: req.session.user,
    title:"Apply"
  });
}

module.exports = router;
