import { ApplicationCommandType, SlashCommandBuilder } from "discord.js";
import { CommandHandler } from "@core/registry/command";

/**
 * Example: Slash command with subcommands
 *
 * Usage:
 * /manage user ban @user [reason]
 * /manage user kick @user [reason]
 * /manage role add @user @role
 * /manage role remove @user @role
 */

const handler: CommandHandler<ApplicationCommandType.ChatInput> = {
  type: ApplicationCommandType.ChatInput,
  data: new SlashCommandBuilder()
    .setName("manage")
    .setDescription("Server management commands")
    .addSubcommandGroup(group =>
      group
        .setName("user")
        .setDescription("User management")
        .addSubcommand(sub =>
          sub
            .setName("ban")
            .setDescription("Ban a user")
            .addUserOption(opt => opt.setName("user").setDescription("User to ban").setRequired(true))
            .addStringOption(opt => opt.setName("reason").setDescription("Reason for ban"))
        )
        .addSubcommand(sub =>
          sub
            .setName("kick")
            .setDescription("Kick a user")
            .addUserOption(opt => opt.setName("user").setDescription("User to kick").setRequired(true))
            .addStringOption(opt => opt.setName("reason").setDescription("Reason for kick"))
        )
    )
    .addSubcommandGroup(group =>
      group
        .setName("role")
        .setDescription("Role management")
        .addSubcommand(sub =>
          sub
            .setName("add")
            .setDescription("Add a role to a user")
            .addUserOption(opt => opt.setName("user").setDescription("User").setRequired(true))
            .addRoleOption(opt => opt.setName("role").setDescription("Role to add").setRequired(true))
        )
        .addSubcommand(sub =>
          sub
            .setName("remove")
            .setDescription("Remove a role from a user")
            .addUserOption(opt => opt.setName("user").setDescription("User").setRequired(true))
            .addRoleOption(opt => opt.setName("role").setDescription("Role to remove").setRequired(true))
        )
    ),

  async run({ interaction }) {
    const group = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    if (group === "user") {
      const user = interaction.options.getUser("user", true);
      const reason = interaction.options.getString("reason") ?? "No reason provided";

      if (subcommand === "ban") {
        await interaction.reply(`Would ban ${user.tag} for: ${reason}`);
      } else if (subcommand === "kick") {
        await interaction.reply(`Would kick ${user.tag} for: ${reason}`);
      }
    } else if (group === "role") {
      const user = interaction.options.getUser("user", true);
      const role = interaction.options.getRole("role", true);

      if (subcommand === "add") {
        await interaction.reply(`Would add ${role.name} to ${user.tag}`);
      } else if (subcommand === "remove") {
        await interaction.reply(`Would remove ${role.name} from ${user.tag}`);
      }
    }
  }
};

export default handler;
