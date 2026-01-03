const cron = require("node-cron");
const Job = require("../models/jobs");
const application=require("../models/applyjob")
cron.schedule("0 0 * * *", async () => {
  const now = new Date();

  try {
    const jobResult = await Job.deleteMany({ lastDate: { $lt: now } });
    const apply=await application.deleteMany({lastDate: { $lt:now }});
//     const eventResult = await Event.deleteMany({ endDate: { $lt: now } });
//     const offerResult = await Offer.deleteMany({ validTill: { $lt: now } });
  } catch (err) {
    console.error("[CRON ERROR] Cleanup failed:", err);
  }
});
