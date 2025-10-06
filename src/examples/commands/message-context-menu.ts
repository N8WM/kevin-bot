import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { CommandHandler } from "@core/registry/command";

/**
 * Example: Message Context Menu Command
 *
 * Right-click on a message -> Apps -> "Message Stats"
 * Shows statistics about the selected message.
 */

const handler: CommandHandler<ApplicationCommandType.Message> = {
  type: ApplicationCommandType.Message,
  data: new ContextMenuCommandBuilder()
    .setName("Message Stats"),

  async run({ interaction }) {
    const message = interaction.targetMessage;

    let stats = `**Message Statistics**\n`;
    stats += `Author: ${message.author.tag}\n`;
    stats += `Characters: ${message.content.length}\n`;
    stats += `Words: ${message.content.split(/\s+/).filter(w => w.length > 0).length}\n`;
    stats += `Created: <t:${Math.floor(message.createdTimestamp / 1000)}:R>\n`;

    if (message.editedTimestamp) {
      stats += `Edited: <t:${Math.floor(message.editedTimestamp / 1000)}:R>\n`;
    }

    stats += `Attachments: ${message.attachments.size}\n`;
    stats += `Embeds: ${message.embeds.length}\n`;
    stats += `Reactions: ${message.reactions.cache.size}\n`;

    await interaction.reply({
      content: stats,
      ephemeral: true
    });
  }
};

export default handler;
