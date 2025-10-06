import { MessageFlags } from "discord.js";
import { ErrorHandlerRegistry } from "@core/registry/errorHandler";
import { Logger } from "@core/logger";

/**
 * Example: Setting up error handlers
 *
 * Error handlers provide centralized error handling for different contexts.
 * You can register handlers for specific error types or a global fallback.
 */

// Register a handler for command errors
ErrorHandlerRegistry.register("command", async (error, context) => {
  if (context.type !== "command") return;

  Logger.error(`Command Error (${context.command.name}): ${error.message}`);
  Logger.error(error.stack ?? "");

  const response = {
    content: "An error occurred while executing this command.",
    flags: [MessageFlags.Ephemeral] as const
  };

  try {
    if (context.interaction.deferred || context.interaction.replied) {
      await context.interaction.editReply(response.content);
    }
    else {
      await context.interaction.reply(response);
    }
  }
  catch (replyError) {
    Logger.error(`Failed to send error message: ${replyError instanceof Error ? replyError.message : String(replyError)}`);
  }
});

// Register a handler for component (button/modal) errors
ErrorHandlerRegistry.register("component", async (error, context) => {
  if (context.type !== "component") return;

  Logger.error(`Component Error (${context.componentId}): ${error.message}`);
  Logger.error(error.stack ?? "");

  const response = {
    content: "An error occurred while processing this interaction.",
    flags: [MessageFlags.Ephemeral] as const
  };

  try {
    if (context.interaction.deferred || context.interaction.replied) {
      await context.interaction.editReply(response.content);
    }
    else {
      await context.interaction.reply(response);
    }
  }
  catch (replyError) {
    Logger.error(`Failed to send error message: ${replyError instanceof Error ? replyError.message : String(replyError)}`);
  }
});

// Register a handler for autocomplete errors (silently log)
ErrorHandlerRegistry.register("autocomplete", async (error, context) => {
  if (context.type !== "autocomplete") return;

  Logger.error(`Autocomplete Error (${context.command.name}): ${error.message}`);
  // Don't respond to autocomplete errors - just log them
});

// Register a handler for event errors
ErrorHandlerRegistry.register("event", async (error, context) => {
  if (context.type !== "event") return;

  Logger.error(`Event Error (${context.eventName}): ${error.message}`);
  Logger.error(error.stack ?? "");
});

// Register a handler for scheduled task errors
ErrorHandlerRegistry.register("task", async (error, context) => {
  if (context.type !== "task") return;

  Logger.error(`Task Error (${context.taskName}): ${error.message}`);
  Logger.error(error.stack ?? "");

  // Could send alert to admin channel, log to external service, etc.
});

// Register a global fallback handler (catches any errors not handled by specific handlers)
ErrorHandlerRegistry.registerGlobal(async (error, context) => {
  Logger.error(`Unhandled error in ${context.type} context: ${error.message}`);
  Logger.error(error.stack ?? "");

  // Could integrate with error tracking services like Sentry:
  // Sentry.captureException(error, { contexts: { discord: context } });
});
