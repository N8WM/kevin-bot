import { Logger } from "@core/logger";
import { PrismaClient } from "@prisma/client";

import { GuildService } from "./guildService";
import { ExampleBirthdayService } from "./exampleBirthdayService"; // EXAMPLE APP - Remove this line

export class ServiceManager {
  static guild: GuildService;
  static exampleBirthday: ExampleBirthdayService; // EXAMPLE APP - Remove this line

  static initialized = false;

  static init(prisma: PrismaClient) {
    if (ServiceManager.initialized) {
      Logger.warn("ServiceManager should only be initialized once");
      return;
    }

    ServiceManager.guild = new GuildService(prisma);
    ServiceManager.exampleBirthday = new ExampleBirthdayService(prisma); // EXAMPLE APP - Remove this line

    ServiceManager.initialized = true;
  }
}
