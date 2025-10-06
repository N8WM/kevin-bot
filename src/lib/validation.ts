/**
 * Simple validation helpers using Zod patterns.
 * Install Zod with: npm install zod
 *
 * This file demonstrates the pattern for using Zod in your bot.
 * Uncomment and use once you've added Zod to your dependencies.
 */

// import { z } from "zod";

/**
 * Example: Validate command options
 */
// export const userInputSchema = z.object({
//   message: z.string().min(1).max(2000),
//   count: z.number().int().positive().max(100)
// });

// export type UserInput = z.infer<typeof userInputSchema>;

/**
 * Example: Validate and parse user input
 * @param data - Raw data to validate
 * @returns Parsed and validated data
 */
// export function validateUserInput(data: unknown): UserInput {
//   return userInputSchema.parse(data);
// }

/**
 * Example: Safe validation that returns errors
 * @param data - Raw data to validate
 * @returns Result with parsed data or error
 */
// export function safeValidateUserInput(data: unknown) {
//   return userInputSchema.safeParse(data);
// }

/**
 * Example usage in a command:
 *
 * const result = safeValidateUserInput({
 *   message: interaction.options.getString("message"),
 *   count: interaction.options.getInteger("count")
 * });
 *
 * if (!result.success) {
 *   await interaction.reply({
 *     content: `Invalid input: ${result.error.message}`,
 *     ephemeral: true
 *   });
 *   return;
 * }
 *
 * const { message, count } = result.data;
 * // Use validated data safely
 */

export {}; // Make this a module
