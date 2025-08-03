const express=require('express');
const router=express.Router();
const appReceived=require('../models/applyjob');
const nodemailer=require('nodemailer');
router.get("/employeer/applications",async (req,res)=>{
    if(!req.session.employer)
{
 return res.redirect("/")
}
    console.log("company name:",req.session.employer?.name)
    try{
        const app=await appReceived.find({companyName:req.session.employer?.name})
        if(app){
            console.log(app);
    return res.render('employeer/applications',{app,title:"Applications"})
    }}
    catch(err)
    {
        console.log(err)
    }
})
// POST route to update status and send email
router.post('/employeer/update-status/:id', async (req, res) => {
    if(!req.session.employer)
{
 return res.redirect("/")
}
  const { id } = req.params;
  const { status } = req.body;

  try {
    
    const application = await appReceived.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).send("Application not found");
    }

    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "sainikataria2002@gmail.com",      
        pass: "kroalnhfwkvnywjp"     
      }
    });

    
    const mailOptions = {
      from: `"${application.companyName} HR" "sainikataria2002@gmail.com"}`,
      to: application.email,
      subject: `Application ${status} - ${application.job_title}`,
      html: `
        <p>Dear ${application.firstname},</p>
        <p>Your application for the position of <strong>${application.job_title}</strong> at <strong>${application.companyName}</strong> has been <strong>${status}</strong>.</p>
        ${status === 'Approved'
          ? '<p>We will contact you shortly with further steps.</p>'
          : '<p>We thank you for applying and encourage you to apply again in the future.</p>'}
        <p>Best regards,<br>${application.companyName} HR</p>
      `
    };

    
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${application.email} regarding status: ${status}`);

    
    res.redirect('/employeer/applications');
  } catch (error) {
    console.error("Error updating status or sending email:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports=router;