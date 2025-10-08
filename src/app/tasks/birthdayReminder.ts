import {
  MessageFlags,
  TextChannel,
  TextDisplayBuilder
} from "discord.js";

import { Logger } from "@core/logger";
import { TaskHandler } from "@core/registry/task";
import { ServiceManager } from "@services";
import { ensureValidBirthdays } from "@app/util/birthdays";
import { build as buildBirthdayBody } from "@app/components/containers/birthdayContainer";

const handler: TaskHandler = {
  name: "Birthday Reminder",
  schedule: "0 0 0 * * *", // Run once per day
  runOnStart: false, // Don't run immediately on startup

  async execute({ client, context }) {
    Logger.debug("Checking for birthdays today...");

    // Get all guilds the bot is in
    for (const guild of client.guilds.cache.values()) {
      // Get guild config
      const config = await ServiceManager.birthday.getConfig(guild.id);
      if (!config?.announcementChannel) {
        Logger.debug(`No birthday announcement channel configured for guild ${guild.name}`);
        continue;
      }

      const fetch = () => ServiceManager.birthday.getTodaysBirthdays(guild.id, context?.date);
      const birthdays = await ensureValidBirthdays(fetch, guild);

      if (birthdays.length === 0) {
        continue;
      }

      // Find the announcement channel
      const channel = guild.channels.cache.get(config.announcementChannel);
      if (!channel || !channel.isTextBased()) continue;

      // Create birthday message
      const maybePing = config.pingRecipient !== "bd-acct" ? `-# *@${config.pingRecipient}*` : undefined;

      const maybeHeader = maybePing ? [new TextDisplayBuilder().setContent(maybePing)] : [];

      const body = await buildBirthdayBody(
        guild,
        channel.id,
        { userIds: birthdays.map((b) => b.userId) }
      );

      const components = [
        ...maybeHeader,
        body
      ];

      try {
        await (channel as TextChannel).send({
          components,
          flags: [MessageFlags.IsComponentsV2]
        });
        Logger.info(`Sent birthday message for ${birthdays.length} user(s) in ${guild.name}`);
      }
      catch (error) {
        Logger.error(`Failed to send birthday message in ${guild.name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
};

export default handler;
