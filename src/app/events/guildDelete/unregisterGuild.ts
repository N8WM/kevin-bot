import { Events } from "discord.js";

import { Logger } from "@core/logger";
import { EventHandler } from "@core/registry";
import { ServiceManager } from "@services";

/**
 * Clean up when the bot is removed from a guild
 */
const handler: EventHandler<Events.GuildDelete> = {
  async execute(guild) {
    Logger.info(`Left guild: ${guild.name} (${guild.id})`);

    // Note: Guild deletion is already handled by refreshGuilds on startup
    // This event is mainly for logging and any immediate cleanup
    Logger.debug(`Guild ${guild.name} will be removed from database on next refresh`);
  }
};

export default handler;
