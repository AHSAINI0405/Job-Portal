// POST: /verify-otp
router.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;
  const { tempUser, otp: sessionOtp, otpExpires } = req.session;

  if (!tempUser || !sessionOtp) {
    return res.render("employee/employee", {
      message: "Session expired. Please register again.",
      success: false,
      title:"Verification"
    });
  }

  if (Date.now() > otpExpires) {
    return res.render("employee/employee", {
      message: "OTP expired. Please register again.",
      success: false,
      title:"Verification"
    });
  }

  if (otp !== sessionOtp) {
    return res.render("employee/verify-otp", {
      email: tempUser.email,
      message: "Incorrect OTP. Please try again.",
      title:"Verification"
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
      title:"Verification"
    });
  } catch (err) {
    console.error("Error saving user after OTP:", err);
    return res.render("employee/employee", {
      message: "Something went wrong.",
      success: false,
      title:"Verification"
    });
  }
});
