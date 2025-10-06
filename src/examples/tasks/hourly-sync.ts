import { TaskHandler } from "@core/registry/task";
import { Logger } from "@core/logger";
import { ServiceManager } from "@services";

/**
 * Example: Hourly guild sync
 *
 * Syncs guild data with the database every hour.
 */

const handler: TaskHandler = {
  name: "Hourly Guild Sync",
  schedule: "every 1h", // Run every hour
  runOnStart: true, // Run on startup to ensure data is synced

  async execute(client) {
    Logger.debug("Running hourly guild sync...");

    try {
      const guildIds = client.guilds.cache.map(g => g.id);
      const updated = await ServiceManager.guild.refreshGuilds(guildIds);

      Logger.info(`Synced ${updated} guilds with database`);
    } catch (error) {
      Logger.error(`Failed to sync guilds: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

export default handler;
