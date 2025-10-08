import { Logger } from "@core/logger";
import { PrismaClient } from "@prisma/client";

import { GuildService } from "./guildService";
import { BirthdayService } from "./birthdayService";

export class ServiceManager {
  static guild: GuildService;
  static birthday: BirthdayService;

  static initialized = false;

  static init(prisma: PrismaClient) {
    if (ServiceManager.initialized) {
      Logger.warn("ServiceManager should only be initialized once");
      return;
    }

    ServiceManager.guild = new GuildService(prisma);
    ServiceManager.birthday = new BirthdayService(prisma);

    ServiceManager.initialized = true;
  }
}
