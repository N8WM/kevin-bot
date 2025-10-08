import { ApplicationCommandType, SlashCommandBuilder, ChannelType, PermissionFlagsBits, MessageFlags, ContainerBuilder, TextDisplayBuilder } from "discord.js";
import { CommandHandler } from "@core/registry/command";
import { ServiceManager } from "@services";

const handler: CommandHandler<ApplicationCommandType.ChatInput> = {
  type: ApplicationCommandType.ChatInput,
  data: new SlashCommandBuilder()
    .setName("birthday-config")
    .setDescription("Configure birthday announcements (mods only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub
        .setName("set-channel")
        .setDescription("Set the channel for birthday announcements")
        .addChannelOption((opt) =>
          opt
            .setName("channel")
            .setDescription("Channel for announcements")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("set-ping")
        .setDescription("Configure who is pinged in announcements")
        .addStringOption((opt) =>
          opt
            .setName("recipient")
            .setDescription("Who is pinged")
            .addChoices(
              { name: "@everyone", value: "everyone" },
              { name: "@here", value: "here" },
              { name: "@<bd-acct> only (default)", value: "bd-acct" }
            )
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("view")
        .setDescription("View current birthday configuration")
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

    if (subcommand === "set-channel") {
      const channel = interaction.options.getChannel("channel", true);

      await ServiceManager.birthday.setAnnouncementChannel(
        interaction.guildId,
        channel.id
      );

      await interaction.reply({
        content: `Birthday announcements will be sent to <#${channel.id}>`,
        flags: [MessageFlags.Ephemeral]
      });
    }

    else if (subcommand === "set-ping") {
      const recipient = interaction.options.getString("recipient", true);

      await ServiceManager.birthday.setPingRecipient(
        interaction.guildId,
        recipient
      );

      await interaction.reply({
        content: `Birthday pings will be sent to ${recipient}.`,
        flags: [MessageFlags.Ephemeral]
      });
    }

    else if (subcommand === "view") {
      const config = await ServiceManager.birthday.getConfig(interaction.guildId);

      if (!config?.announcementChannel) {
        await interaction.reply({
          components: [new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent([
            "**Birthday Announcement Configuration**",
            "Birthday announcements are not configured.",
            "Use `/birthday-config set-channel` to set up."
          ].join("\n")))],
          flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
        return;
      }

      await interaction.reply({
        components: [new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent([
          `**Birthday Announcement Configuration**`,
          ``,
          `Announcement Channel: <#${config.announcementChannel}>`,
          `Ping Recipient: \`${config.pingRecipient}\``,
          ``,
          `-# Updated ${(config.updatedAt as Date).toLocaleDateString()}`
        ].join("\n")))],
        flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
      });
    }
  },

  options: {
    deleted: false
  }
};

export default handler;
