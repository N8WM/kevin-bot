import { ActivityType } from "discord.js";
import { TaskHandler } from "@core/registry/task";
import { Logger } from "@core/logger";
import { ServiceManager } from "@services";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

const handler: TaskHandler = {
  name: "Update Bot Status",
  schedule: "0 */10 * * * *", // Every 10 minutes
  runOnStart: true,

  async execute({ client }) {
    try {
      const guildCount = client.guilds.cache.size;
      const birthdayCount = await ServiceManager.birthday.count();
      const status = `${plural(guildCount, "server")}, ${plural(birthdayCount, "birthday")}`;

      client.user?.setActivity({ name: status, type: ActivityType.Custom });
    }
    catch (error) {
      Logger.error(`Failed to update bot status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

export default handler;
