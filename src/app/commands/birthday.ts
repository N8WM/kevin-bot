import { ApplicationCommandType, ContainerBuilder, MessageFlags, SlashCommandBuilder, TextDisplayBuilder } from "discord.js";
import { CommandHandler } from "@core/registry/command";
import { ServiceManager } from "@services";
import { Logger } from "@core/logger";
import { hasPermissions } from "@lib/permissions";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const handler: CommandHandler<ApplicationCommandType.ChatInput> = {
  type: ApplicationCommandType.ChatInput,
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("Birthday tracker commands")
    .addSubcommand((sub) =>
      sub
        .setName("set")
        .setDescription("Set your (or someone else's) birthday")
        .addStringOption((opt) =>
          opt
            .setName("month")
            .setDescription("Birth month")
            .addChoices(MONTHS.map((m) => ({ name: m, value: m })))
            .setRequired(true)
        )
        .addIntegerOption((opt) =>
          opt
            .setName("day")
            .setDescription("Day of month (1-31)")
            .setMinValue(1)
            .setMaxValue(31)
            .setRequired(true)
        )
        .addIntegerOption((opt) =>
          opt
            .setName("year")
            .setDescription("Birth year (optional)")
            .setMinValue(1900)
            .setMaxValue(new Date().getFullYear())
        )
        .addUserOption((opt) =>
          opt
            .setName("user")
            .setDescription("Who's birthday? (optional, if it's not you)")
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("list")
        .setDescription("View upcoming birthdays in this server")
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Remove your (or someone else's) birthday")
        .addUserOption((opt) =>
          opt
            .setName("user")
            .setDescription("Who's birthday? (optional, if it's not you)")
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("get")
        .setDescription("Get your (or someone else's) birthday")
        .addUserOption((opt) =>
          opt
            .setName("user")
            .setDescription("Who's birthday? (optional, if it's not you)")
        )
    ),

  async run({ interaction }) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "This command can only be used in a server!",
        flags: [MessageFlags.Ephemeral]
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "set") {
      const monthName = interaction.options.getString("month", true);
      const day = interaction.options.getInteger("day", true);
      const year = interaction.options.getInteger("year");
      const userArg = interaction.options.getUser("user");
      const user = userArg && userArg.id !== interaction.user.id ? userArg : null;

      const month = MONTHS.indexOf(monthName) + 1;
      if (month === 0) {
        await interaction.reply({
          content: "Invalid month! Please select from the options.",
          flags: [MessageFlags.Ephemeral]
        });
        return;
      }

      try {
        await ServiceManager.birthday.setBirthday({
          userId: user?.id ?? interaction.user.id,
          guildId: interaction.guildId,
          month,
          day,
          year: year ?? undefined
        });

        const dateStr = `${monthName} ${day}${year ? `, ${year}` : ""}`;
        const userStr = user ? `${user}'s` : "Your";

        await interaction.reply({
          content: `${userStr} birthday has been set to **${dateStr}**!`,
          flags: [MessageFlags.Ephemeral]
        });
      }
      catch (error) {
        await interaction.reply({
          content: `Error: ${error instanceof Error ? error.message : "Invalid date"}`,
          flags: [MessageFlags.Ephemeral]
        });
      }
    }

    else if (subcommand === "list") {
      const savedBirthdays = await ServiceManager.birthday.getUpcomingBirthdays(interaction.guildId);
      const members = await Promise.allSettled(savedBirthdays.map((b) => interaction.guild?.members.fetch(b.userId)));
      const birthdays = savedBirthdays.filter((_, i) => members.at(i)?.status === "fulfilled");
      const toRemove = savedBirthdays.filter((_, i) => members.at(i)?.status === "rejected");

      if (toRemove.length > 0)
        await ServiceManager.birthday.removeBirthdays(
          toRemove.map((b) => b.userId),
          interaction.guildId
        ).catch(Logger.error);

      if (birthdays.length === 0) {
        await interaction.reply({
          content: "No birthdays registered in this server yet!",
          flags: [MessageFlags.Ephemeral]
        });
        return;
      }

      const container = new ContainerBuilder();

      let message = "**Upcoming Birthdays**\n\n";
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

      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(message));

      await interaction.reply({
        components: [container],
        flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
      });
    }

    else if (subcommand === "remove") {
      const userArg = interaction.options.getUser("user");
      const user = userArg && userArg.id !== interaction.user.id ? userArg : null;

      try {
        await ServiceManager.birthday.removeBirthday(
          user?.id ?? interaction.user.id,
          interaction.guildId
        );

        const userStr = user ? `${user}'s` : "Your";
        await interaction.reply({
          content: `${userStr} birthday has been removed from tracking.`,
          flags: [MessageFlags.Ephemeral]
        });
      }
      catch {
        const userDoesntStr = user ? `${user} doesn't` : "You don't";
        await interaction.reply({
          content: `${userDoesntStr} have a birthday set!`,
          flags: [MessageFlags.Ephemeral]
        });
      }
    }

    else if (subcommand === "get") {
      const userArg = interaction.options.getUser("user");
      const user = userArg && userArg.id !== interaction.user.id ? userArg : null;

      const birthday = await ServiceManager.birthday.getBirthday(
        user?.id ?? interaction.user.id,
        interaction.guildId
      );

      if (!birthday) {
        const userDoesntStr = user ? `${user} doesn't` : "You don't";
        await interaction.reply({
          content: `${userDoesntStr} have a birthday set!`,
          flags: [MessageFlags.Ephemeral]
        });
        return;
      }

      const yearStr = birthday.year ? `, ${birthday.year}` : "";
      const monthName = MONTHS[birthday.month - 1];
      const dateStr = `${monthName} ${birthday.day}${yearStr}`;

      await interaction.reply({
        content: `<@${birthday.userId}> - ${dateStr}\n`,
        flags: [MessageFlags.Ephemeral]
      });
    }
  },

  options: {
    middleware: [
      ({ interaction }) => {
        const sub = interaction.options.getSubcommand(false);
        if (sub !== "set" && sub !== "remove") return { continue: true };

        const target = interaction.options.getUser("user");
        if (!target || target.id === interaction.user.id) return { continue: true };

        if (!hasPermissions(interaction, ["ManageGuild"])) {
          return {
            continue: false,
            error: "You can only manage your own birthday."
          };
        }
        return { continue: true };
      }
    ]
  }
};

export default handler;
