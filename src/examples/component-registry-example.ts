import { ComponentRegistry } from "@core/registry/component";
import { Logger } from "@core/logger";

/**
 * Example: Registering component interaction handlers
 *
 * ComponentRegistry allows you to handle button clicks, modal submissions,
 * and select menu interactions with pattern matching.
 */

// Example: Button handler for a specific button
ComponentRegistry.registerButton("approve_request", {
  async execute({ interaction }) {
    const requestId = interaction.customId.split(":")[1]; // e.g., "approve_request:123"

    await interaction.reply({
      content: `Request ${requestId} approved!`,
      ephemeral: true,
    });

    // Update the original message to reflect approval
    await interaction.message.edit({
      content: `✅ Request approved by ${interaction.user.tag}`,
      components: [], // Remove buttons
    });
  }
});

// Example: Button handler with regex pattern (matches "reject_123", "reject_456", etc.)
ComponentRegistry.registerButton("^reject_", {
  async execute({ interaction }) {
    const requestId = interaction.customId.split("_")[1]; // e.g., "reject_123"

    await interaction.reply({
      content: `Request ${requestId} rejected.`,
      ephemeral: true,
    });

    await interaction.message.edit({
      content: `❌ Request rejected by ${interaction.user.tag}`,
      components: [],
    });
  }
});

// Example: Modal submission handler
ComponentRegistry.registerModal("feedback_modal", {
  async execute({ interaction }) {
    const rating = interaction.fields.getTextInputValue("rating");
    const comments = interaction.fields.getTextInputValue("comments");

    Logger.info(`Feedback received: ${rating}/5 - ${comments}`);

    await interaction.reply({
      content: "Thank you for your feedback!",
      ephemeral: true,
    });
  }
});

// Example: Select menu handler with regex (matches "role_select_staff", "role_select_member", etc.)
ComponentRegistry.registerSelectMenu("^role_select_", {
  async execute({ interaction }) {
    const selectedRoles = interaction.values;

    await interaction.reply({
      content: `You selected: ${selectedRoles.join(", ")}`,
      ephemeral: true,
    });
  }
});
