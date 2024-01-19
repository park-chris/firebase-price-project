import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";

export const test = onSchedule("every day 18:00", async () => {
  logger.info("test functions is start at 18:00");
});
