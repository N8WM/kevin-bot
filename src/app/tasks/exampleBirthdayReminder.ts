// EXAMPLE APPLICATION - Birthday Tracker
// This file can be safely deleted when creating your own bot
// See EXAMPLE_APP.md for removal instructions

import { TaskHandler } from "@core/registry/task";
import { Logger } from "@core/logger";
import { ServiceManager } from "@services";
import { TextChannel } from "discord.js";

/**
 * Daily birthday reminder task
 *
 * Checks for birthdays every day and sends celebratory messages
 * Configure BIRTHDAY_CHANNEL_ID in your .env to set the announcement channel
 */
const handler: TaskHandler = {
  name: "Example Birthday Reminder",
  schedule: "every 1d", // Run once per day
  runOnStart: false, // Don't run immediately on startup

  async execute(client) {
    Logger.debug("Checking for birthdays today...");

    // Get all guilds the bot is in
    for (const guild of client.guilds.cache.values()) {
      // Get guild config
      const config = await ServiceManager.exampleBirthday.getConfig(guild.id);
      if (!config?.announcementChannel) {
        Logger.debug(`No birthday announcement channel configured for guild ${guild.name}`);
        continue;
      }

      const birthdays = await ServiceManager.exampleBirthday.getTodaysBirthdays(guild.id);

      if (birthdays.length === 0) {
        continue;
      }

      // Find the announcement channel
      const channel = guild.channels.cache.get(config.announcementChannel);
      if (!channel || !channel.isTextBased()) {
        Logger.warn(`Birthday channel ${config.announcementChannel} not found or not text-based in guild ${guild.name}`);
        continue;
      }

      // Create birthday message
      const mentions = birthdays.map((b: any) => `<@${b.userId}>`).join(", ");
      const message = `🎉 **Happy Birthday** ${mentions}! 🎂\n\nWishing you an amazing day! 🎈`;

      try {
        await (channel as TextChannel).send(message);
        Logger.info(`Sent birthday message for ${birthdays.length} user(s) in ${guild.name}`);
      }
      catch (error) {
        Logger.error(`Failed to send birthday message in ${guild.name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
};

export default handler;
