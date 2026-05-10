import cron from "node-cron";
import bookingService from "../service/booking.service";

export const startBookingCompletionJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const count = await bookingService.autoCompleteBookings();

      if (count > 0) {
        console.log(`[Cron] Auto-completed ${count} booking(s)`);
      }

    } catch (err) {
      console.error("[Cron] Failed:", err);
    }
  });

  console.log("[Cron] Booking completion job started");
};


