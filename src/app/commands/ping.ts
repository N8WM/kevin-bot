import {
  ApplicationCommandType,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";

import { CommandHandler } from "@core/registry";

const handler: CommandHandler<ApplicationCommandType.ChatInput> = {
  type: ApplicationCommandType.ChatInput,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responds with pong!")
    .setContexts(InteractionContextType.Guild),

  async run({ interaction }) {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    await interaction.editReply(
      `Pong! 🏓\nLatency: ${latency}ms\nAPI Latency: ${apiLatency}ms`
    );
  },
};

export default handler;
