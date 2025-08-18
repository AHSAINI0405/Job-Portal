const cron = require("node-cron");
const Job = require("../models/jobs");
const Application = require("../models/applyjob");

cron.schedule(
  "0 0 * * *", // every midnight
  async () => {
    const now = new Date();
    console.log(`[CRON STARTED] Running cleanup at: ${now}`);

    try {
      // Find expired jobs
      const expiredJobs = await Job.find({ lastDate: { $lt: now } });
      console.log(`[CRON] Jobs found to delete: ${expiredJobs.length}`);

      const jobResult = await Job.deleteMany({ lastDate: { $lt: now } });
      console.log(`[CRON] Jobs deleted: ${jobResult.deletedCount}`);

      // Find expired applications
      const expiredApplications = await Application.find({ lastDate: { $lt: now } });
      console.log(`[CRON] Applications found to delete: ${expiredApplications.length}`);

      const applyResult = await Application.deleteMany({ lastDate: { $lt: now } });
      console.log(`[CRON] Applications deleted: ${applyResult.deletedCount}`);

      console.log("[CRON COMPLETED] Cleanup finished successfully.");
    } catch (err) {
      console.error("[CRON ERROR] Cleanup failed:", err);
    }
  },
  {
    timezone: "Asia/Kolkata", // adjust if needed
  }
);

// For testing: uncomment to run every minute
// cron.schedule("* * * * *", () => {
//   console.log("Test cron running at:", new Date());
// });
