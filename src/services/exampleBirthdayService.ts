// EXAMPLE APPLICATION - Birthday Tracker
// This file can be safely deleted when creating your own bot
// See EXAMPLE_APP.md for removal instructions

import { BaseService } from "./baseService";

export type BirthdayInput = {
  userId: string;
  guildId: string;
  month: number;
  day: number;
  year?: number;
};

export class ExampleBirthdayService extends BaseService {
  /**
   * Set or update a user's birthday
   */
  async setBirthday(data: BirthdayInput) {
    // Validate date
    if (data.month < 1 || data.month > 12) {
      throw new Error("Month must be between 1 and 12");
    }

    const daysInMonth = new Date(data.year ?? 2000, data.month, 0).getDate();
    if (data.day < 1 || data.day > daysInMonth) {
      throw new Error(`Day must be between 1 and ${daysInMonth} for month ${data.month}`);
    }

    return await this.prisma.exampleBirthday.upsert({
      where: {
        userId: data.userId
      },
      create: data,
      update: {
        month: data.month,
        day: data.day,
        year: data.year,
        guildId: data.guildId
      }
    });
  }

  /**
   * Get a user's birthday
   */
  async getBirthday(userId: string) {
    return await this.prisma.exampleBirthday.findUnique({
      where: { userId }
    });
  }

  /**
   * Remove a user's birthday
   */
  async removeBirthday(userId: string) {
    return await this.prisma.exampleBirthday.delete({
      where: { userId }
    });
  }

  /**
   * Get all birthdays in a guild, sorted by next occurrence
   */
  async getUpcomingBirthdays(guildId: string, limit: number = 10) {
    const all = await this.prisma.exampleBirthday.findMany({
      where: { guildId }
    });

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    // Calculate days until birthday
    const withDaysUntil = all.map((birthday) => {
      let daysUntil = 0;
      const today = new Date(now.getFullYear(), currentMonth - 1, currentDay);
      const bdayThisYear = new Date(now.getFullYear(), birthday.month - 1, birthday.day);

      if (bdayThisYear >= today) {
        daysUntil = Math.ceil((bdayThisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      }
      else {
        const bdayNextYear = new Date(now.getFullYear() + 1, birthday.month - 1, birthday.day);
        daysUntil = Math.ceil((bdayNextYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      }

      return { ...birthday, daysUntil };
    });

    // Sort by days until birthday
    return withDaysUntil
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, limit);
  }

  /**
   * Get birthdays happening today in a specific guild
   */
  async getTodaysBirthdays(guildId: string) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    return await this.prisma.exampleBirthday.findMany({
      where: {
        guildId,
        month,
        day
      }
    });
  }

  /**
   * Set the announcement channel for a guild
   */
  async setAnnouncementChannel(guildId: string, channelId: string) {
    return await this.prisma.exampleBirthdayConfig.upsert({
      where: { guildId },
      create: {
        guildId,
        announcementChannel: channelId
      },
      update: {
        announcementChannel: channelId
      }
    });
  }

  /**
   * Get guild configuration
   */
  async getConfig(guildId: string) {
    return await this.prisma.exampleBirthdayConfig.findUnique({
      where: { guildId }
    });
  }
}
