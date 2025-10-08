import { Guild } from "discord.js";
import { Birthday } from "@prisma/client";
import { Logger } from "@core/logger";
import { ServiceManager } from "@services";

export async function ensureValidBirthdays(f: () => Promise<Birthday[]>, guild: Guild) {
  const savedBirthdays = await f();
  const members = await Promise.allSettled(savedBirthdays.map((b) => guild.members.fetch(b.userId)));
  const birthdays = savedBirthdays.filter((_, i) => members[i].status === "fulfilled");
  const toRemove = savedBirthdays.filter((_, i) => members[i].status === "rejected");

  if (toRemove.length > 0) {
    await ServiceManager.birthday.removeBirthdays(
      toRemove.map((b) => b.userId),
      guild.id
    ).catch(Logger.error);

    return await ensureValidBirthdays(f, guild);
  }

  return birthdays;
}
