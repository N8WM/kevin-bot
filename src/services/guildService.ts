import { Snowflake } from "discord.js";

import { Guild } from "@prisma/client";
import { Result } from "@core/types/result";
import { BaseService } from "./baseService";

export enum GuildStatus {
  Success = "Success",
  SnowflakeAlreadyExists = "This server is already registered",
  SnowflakeDoesNotExist = "This server is not registered"
}

export class GuildService extends BaseService {
  async get(snowflake: Snowflake) {
    return await this.prisma.guild.findUnique({ where: { snowflake } });
  }

  async create(snowflake: Snowflake) {
    return await this.prisma.guild.create({
      data: { snowflake }
    });
  }

  async refreshGuilds(snowflakes: Snowflake[]) {
    // Delete guilds the bot is no longer in
    await this.prisma.guild.deleteMany({
      where: { snowflake: { notIn: snowflakes } }
    });

    // Get all existing guilds
    const existing = await this.prisma.guild.findMany({
      where: { snowflake: { in: snowflakes } }
    });

    const existingIds = new Set(existing.map(g => g.snowflake));
    const newGuildIds = snowflakes.filter(id => !existingIds.has(id));

    // Create new guilds
    if (newGuildIds.length > 0) {
      await this.prisma.guild.createMany({
        data: newGuildIds.map(snowflake => ({ snowflake }))
      });
    }

    // Update existing guilds
    const updated = await this.prisma.guild.updateMany({
      where: { snowflake: { in: Array.from(existingIds) } },
      data: { updatedAt: new Date() }
    });

    return {
      created: newGuildIds.length,
      updated: updated.count,
      deleted: snowflakes.length - existingIds.size - newGuildIds.length
    };
  }
}
