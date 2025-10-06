import { TaskHandler } from "@core/registry/task";
import { Logger } from "@core/logger";

/**
 * Example: Daily cleanup task
 *
 * Runs every day to clean up old data, check bot health, etc.
 */

const handler: TaskHandler = {
  name: "Daily Cleanup",
  schedule: "every 1d", // Run every day
  runOnStart: false, // Don't run immediately on startup

  async execute(client) {
    Logger.info(`Running daily cleanup task...`);

    // Example cleanup operations:

    // 1. Clean up old database records
    // await prisma.temporaryData.deleteMany({
    //   where: {
    //     createdAt: {
    //       lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Older than 7 days
    //     }
    //   }
    // });

    // 2. Log bot statistics
    Logger.info(`Bot is in ${client.guilds.cache.size} guilds`);
    Logger.info(`Serving ${client.users.cache.size} users`);

    // 3. Check memory usage
    const used = process.memoryUsage();
    Logger.info(`Memory usage: ${Math.round(used.heapUsed / 1024 / 1024)} MB`);

    Logger.info("Daily cleanup completed");
  }
};

export default handler;
