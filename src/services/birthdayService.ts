import { BaseService } from "./baseService";

export type BirthdayInput = {
  userId: string;
  guildId: string;
  month: number;
  day: number;
  year?: number;
};

export class BirthdayService extends BaseService {
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

    return await this.prisma.birthday.upsert({
      where: {
        userId_guildId: {
          userId: data.userId,
          guildId: data.guildId
        }
      },
      create: data,
      update: {
        month: data.month,
        day: data.day,
        year: data.year
      }
    });
  }

  /**
   * Get a user's birthday
   */
  async getBirthday(userId: string, guildId: string) {
    return await this.prisma.birthday.findUnique({
      where: { userId_guildId: { userId, guildId } }
    });
  }

  /**
   * Remove a user's birthday
   */
  async removeBirthday(userId: string, guildId: string) {
    return await this.prisma.birthday.delete({
      where: { userId_guildId: { userId, guildId } }
    });
  }

  /**
   * Remove multiple users' birthdays
   */
  async removeBirthdays(userIds: string[], guildId: string) {
    return await this.prisma.birthday.deleteMany({
      where: { guildId, userId: { in: userIds } }
    });
  }

  /**
   * Ensure user ID is deleted
   */
  async ensureRemoved(userId: string, guildId: string) {
    try {
      this.removeBirthday(userId, guildId);
    }
    catch {
      // Silently ignore if user doesn't have a birthday
    }
  }

  /**
   * Get all birthdays in a guild, sorted by next occurrence
   */
  async getUpcomingBirthdays(guildId: string, limit: number = 5) {
    const all = await this.prisma.birthday.findMany({
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
  async getTodaysBirthdays(guildId: string, nowOverride?: Date) {
    const now = nowOverride ?? new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    return await this.prisma.birthday.findMany({
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
    return await this.prisma.birthdayConfig.upsert({
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
   * Set the ping recipient for a guild
   */
  async setPingRecipient(guildId: string, recipient: string) {
    if (!["everyone", "here", "bd-acct"].includes(recipient))
      throw new Error(`Ping recipient invalid: ${recipient}`);

    return await this.prisma.birthdayConfig.upsert({
      where: { guildId },
      create: {
        guildId,
        pingRecipient: recipient
      },
      update: {
        pingRecipient: recipient
      }
    });
  }

  /**
   * Get guild configuration
   */
  async getConfig(guildId: string) {
    return await this.prisma.birthdayConfig.findUnique({
      where: { guildId }
    });
  }
}
