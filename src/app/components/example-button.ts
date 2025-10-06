import { ButtonHandler } from "@core/registry/component";

/**
 * Example button handler
 * Register this in your command or event handler using:
 * ComponentRegistry.registerButton("example-button", exampleButtonHandler);
 */
export const exampleButtonHandler: ButtonHandler = {
  async execute({ interaction }) {
    await interaction.reply({
      content: `Button clicked by ${interaction.user.username}!`,
      ephemeral: true
    });
  }
};
