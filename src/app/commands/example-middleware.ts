import {
  ApplicationCommandType,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";

import { CommandHandler } from "@core/registry";
import { builtinMiddleware } from "@core/registry/middleware";

const handler: CommandHandler<ApplicationCommandType.ChatInput> = {
  type: ApplicationCommandType.ChatInput,
  data: new SlashCommandBuilder()
    .setName("example-middleware")
    .setDescription("Example command with middleware (5s cooldown, guild only)")
    .setContexts(InteractionContextType.Guild),

  options: {
    middleware: [
      builtinMiddleware.guildOnly(),
      builtinMiddleware.cooldown(5)
    ]
  },

  async run({ interaction }) {
    await interaction.reply("This command has middleware! Try running it again quickly.");
  },
};

export default handler;
