import { bumpVersion } from "../utils/cache-version";
import prisma from "../config/prisma.client";
import cron from "node-cron";


export const startTimeSlotExpirationJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();

      const result = await prisma.timeSlot.updateMany({
        where: {
          status: "AVAILABLE",
          startTime: { lte: now }
        },
        data: {
          status: "EXPIRED"
        }
      });

      if (result.count > 0) {
        console.log(`[Cron] Expired ${result.count} slot(s)`);
      }

      if (result.count > 0) {
        await bumpVersion("time-slots:version");
        await bumpVersion("available-slot:version");
      }

    } catch (err) {
      console.error("[Cron] Slot expiration failed:", err);
    }
  });

  console.log("[Cron] Time slot expiration job started");
};