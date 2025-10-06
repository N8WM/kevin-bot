import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { CommandHandler } from "@core/registry/command";

/**
 * Example: User Context Menu Command
 *
 * Right-click on a user -> Apps -> "User Info"
 * Shows information about the selected user.
 */

const handler: CommandHandler<ApplicationCommandType.User> = {
  type: ApplicationCommandType.User,
  data: new ContextMenuCommandBuilder()
    .setName("User Info"),

  async run({ interaction }) {
    const user = interaction.targetUser;
    const member = interaction.targetMember;

    let info = `**User Info**\n`;
    info += `Username: ${user.username}\n`;
    info += `ID: ${user.id}\n`;
    info += `Created: <t:${Math.floor(user.createdTimestamp / 1000)}:R>\n`;
    info += `Bot: ${user.bot ? "Yes" : "No"}\n`;

    if (member && "joinedTimestamp" in member && member.joinedTimestamp) {
      info += `\n**Member Info**\n`;
      info += `Joined: <t:${Math.floor(member.joinedTimestamp / 1000)}:R>\n`;
      if ("roles" in member) {
        info += `Roles: ${member.roles.cache.size}\n`;
      }
    }

    await interaction.reply({
      content: info,
      ephemeral: true
    });
  }
};

export default handler;
