import { ApplicationCommandType, SlashCommandBuilder } from "discord.js";
import { CommandHandler } from "@core/registry/command";

/**
 * Example: Slash command with autocomplete
 *
 * This demonstrates how to create a command with autocomplete suggestions.
 * As the user types, Discord will call the autocomplete handler to get suggestions.
 */

const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape", "Honeydew"];

const handler: CommandHandler<ApplicationCommandType.ChatInput> = {
  type: ApplicationCommandType.ChatInput,
  data: new SlashCommandBuilder()
    .setName("favorite")
    .setDescription("Set your favorite fruit")
    .addStringOption(opt =>
      opt
        .setName("fruit")
        .setDescription("Choose a fruit")
        .setAutocomplete(true)
        .setRequired(true)
    ),

  async run({ interaction }) {
    const fruit = interaction.options.getString("fruit", true);
    await interaction.reply(`Your favorite fruit is: ${fruit}`);
  },

  async autocomplete({ interaction }) {
    const focused = interaction.options.getFocused();

    // Filter fruits based on user input
    const filtered = fruits.filter(fruit =>
      fruit.toLowerCase().includes(focused.toLowerCase())
    );

    // Return up to 25 choices (Discord limit)
    await interaction.respond(
      filtered.slice(0, 25).map(fruit => ({
        name: fruit,
        value: fruit.toLowerCase()
      }))
    );
  }
};

export default handler;
