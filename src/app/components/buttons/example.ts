import { ButtonHandler } from "@core/registry/component";

/**
 * Example button handler
 *
 * This will be auto-registered with customId "example"
 * Use in your commands like: customId: "example"
 */
const handler: ButtonHandler = {
  async execute({ interaction }) {
    await interaction.reply({
      content: `Button clicked by ${interaction.user.username}!`,
      ephemeral: true
    });
  }
};

export default handler;
