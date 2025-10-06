// EXAMPLE APPLICATION - Birthday Tracker
// This file can be safely deleted when creating your own bot
// See EXAMPLE_APP.md for removal instructions

import { ApplicationCommandType, SlashCommandBuilder, ChannelType, PermissionFlagsBits } from "discord.js";
import { CommandHandler } from "@core/registry/command";
import { ServiceManager } from "@services";

const handler: CommandHandler<ApplicationCommandType.ChatInput> = {
  type: ApplicationCommandType.ChatInput,
  data: new SlashCommandBuilder()
    .setName("example-birthday-config")
    .setDescription("Configure birthday announcements (admin only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub =>
      sub
        .setName("set-channel")
        .setDescription("Set the channel for birthday announcements")
        .addChannelOption(opt =>
          opt
            .setName("channel")
            .setDescription("Channel for announcements")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("view")
        .setDescription("View current birthday configuration")
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

    if (subcommand === "set-channel") {
      const channel = interaction.options.getChannel("channel", true);

      await ServiceManager.exampleBirthday.setAnnouncementChannel(
        interaction.guildId,
        channel.id
      );

      await interaction.reply({
        content: `✅ Birthday announcements will be sent to <#${channel.id}>`,
        ephemeral: true
      });
    }

    else if (subcommand === "view") {
      const config = await ServiceManager.exampleBirthday.getConfig(interaction.guildId);

      if (!config?.announcementChannel) {
        await interaction.reply({
          content: "Birthday announcements are not configured. Use `/example-birthday-config set-channel` to set up.",
          ephemeral: true
        });
        return;
      }

      await interaction.reply({
        content: `**Birthday Configuration**\nAnnouncement Channel: <#${config.announcementChannel}>`,
        ephemeral: true
      });
    }
  },

  options: {
    deleted: false
  }
};

export default handler;
