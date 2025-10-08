import { Events } from "discord.js";

import { EventHandler } from "@core/registry";
import { ServiceManager } from "@services";

const handler: EventHandler<Events.GuildMemberRemove> = {
  async execute(member) {
    ServiceManager.birthday.ensureRemoved(member.id, member.guild.id);
  }
};

export default handler;
