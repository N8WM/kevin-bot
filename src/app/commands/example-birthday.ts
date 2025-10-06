// EXAMPLE APPLICATION - Birthday Tracker
// This file can be safely deleted when creating your own bot
// See EXAMPLE_APP.md for removal instructions

import { ApplicationCommandType, SlashCommandBuilder } from "discord.js";
import { CommandHandler } from "@core/registry/command";
import { ServiceManager } from "@services";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const handler: CommandHandler<ApplicationCommandType.ChatInput> = {
  type: ApplicationCommandType.ChatInput,
  data: new SlashCommandBuilder()
    .setName("example-birthday")
    .setDescription("Birthday tracker commands")
    .addSubcommand(sub =>
      sub
        .setName("set")
        .setDescription("Set your birthday")
        .addStringOption(opt =>
          opt
            .setName("month")
            .setDescription("Birth month")
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addIntegerOption(opt =>
          opt
            .setName("day")
            .setDescription("Day of month (1-31)")
            .setMinValue(1)
            .setMaxValue(31)
            .setRequired(true)
        )
        .addIntegerOption(opt =>
          opt
            .setName("year")
            .setDescription("Birth year (optional, for age display)")
            .setMinValue(1900)
            .setMaxValue(new Date().getFullYear())
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("list")
        .setDescription("View upcoming birthdays in this server")
    )
    .addSubcommand(sub =>
      sub
        .setName("remove")
        .setDescription("Remove your birthday from tracking")
    ),

  async run({ interaction }) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "This command can only be used in a server!",
        ephemeral: true
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "set") {
      const monthName = interaction.options.getString("month", true);
      const day = interaction.options.getInteger("day", true);
      const year = interaction.options.getInteger("year");

      const month = MONTHS.indexOf(monthName) + 1;
      if (month === 0) {
        await interaction.reply({
          content: "Invalid month! Please select from the autocomplete options.",
          ephemeral: true
        });
        return;
      }

      try {
        await ServiceManager.exampleBirthday.setBirthday({
          userId: interaction.user.id,
          guildId: interaction.guildId,
          month,
          day,
          year: year ?? undefined
        });

        const dateStr = `${monthName} ${day}${year ? `, ${year}` : ""}`;
        await interaction.reply({
          content: `✅ Your birthday has been set to **${dateStr}**!`,
          ephemeral: true
        });
      } catch (error) {
        await interaction.reply({
          content: `❌ Error: ${error instanceof Error ? error.message : "Invalid date"}`,
          ephemeral: true
        });
      }
    }

    else if (subcommand === "list") {
      const birthdays = await ServiceManager.exampleBirthday.getUpcomingBirthdays(
        interaction.guildId,
        10
      );

      if (birthdays.length === 0) {
        await interaction.reply({
          content: "No birthdays registered in this server yet!",
          ephemeral: true
        });
        return;
      }

      let message = "🎂 **Upcoming Birthdays**\n\n";
      for (const birthday of birthdays) {
        const monthName = MONTHS[birthday.month - 1];
        const dateStr = `${monthName} ${birthday.day}`;
        const daysText = birthday.daysUntil === 0
          ? "**TODAY!** 🎉"
          : birthday.daysUntil === 1
            ? "tomorrow"
            : `in ${birthday.daysUntil} days`;

        message += `<@${birthday.userId}> - ${dateStr} (${daysText})\n`;
      }

      await interaction.reply({
        content: message,
        ephemeral: false
      });
    }

    else if (subcommand === "remove") {
      try {
        await ServiceManager.exampleBirthday.removeBirthday(interaction.user.id);
        await interaction.reply({
          content: "✅ Your birthday has been removed from tracking.",
          ephemeral: true
        });
      } catch (error) {
        await interaction.reply({
          content: "You don't have a birthday set!",
          ephemeral: true
        });
      }
    }
  },

  async autocomplete({ interaction }) {
    const focused = interaction.options.getFocused();

    const filtered = MONTHS.filter(month =>
      month.toLowerCase().includes(focused.toLowerCase())
    );

    await interaction.respond(
      filtered.slice(0, 25).map(month => ({
        name: month,
        value: month
      }))
    );
  },

  options: {
    deleted: false
  }
};

export default handler;
