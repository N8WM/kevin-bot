import { Client } from "discord.js";

/**
 * Scheduled task handler
 */
export type TaskHandler = {
  /**
   * Cron expression for task scheduling
   *
   * Format: second minute hour day month weekday
   * Examples:
   * - "0 0 * * *" - Every day at midnight
   * - "0 *\/15 * * *" - Every 15 minutes
   * - "0 0 * * 0" - Every Sunday at midnight
   * - "0 0 1 * *" - First day of every month at midnight
   *
   * Or use simple intervals:
   * - "every 1h" - Every hour
   * - "every 30m" - Every 30 minutes
   * - "every 1d" - Every day
   */
  schedule: string;

  /**
   * Task name for logging
   */
  name?: string;

  /**
   * Execute the task
   */
  execute: (client: Client) => Promise<void>;

  /**
   * Whether to run immediately on startup (before first scheduled run)
   */
  runOnStart?: boolean;
};

export type Task = {
  handler: TaskHandler;
  name: string;
  intervalId?: NodeJS.Timeout;
  nextRun?: Date;
};
