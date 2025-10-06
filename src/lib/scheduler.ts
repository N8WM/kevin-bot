import { Client } from "discord.js";
import { Logger } from "@core/logger";
import { Task, TaskHandler } from "@core/registry/task";

/**
 * Simple task scheduler
 *
 * Supports:
 * - Cron-like expressions (basic subset)
 * - Simple intervals (every 1h, every 30m, etc.)
 */
export class TaskScheduler {
  private tasks: Map<string, Task> = new Map();
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Register a new scheduled task
   */
  register(name: string, handler: TaskHandler): void {
    const task: Task = {
      handler,
      name: handler.name || name
    };

    this.tasks.set(name, task);
    Logger.debug(`Registered scheduled task: ${task.name}`);
  }

  /**
   * Start all registered tasks
   */
  async start(): Promise<void> {
    for (const [key, task] of this.tasks.entries()) {
      try {
        // Run immediately if requested
        if (task.handler.runOnStart) {
          Logger.debug(`Running task on startup: ${task.name}`);
          await task.handler.execute(this.client);
        }

        // Schedule the task
        const interval = this.parseSchedule(task.handler.schedule);
        if (interval) {
          task.intervalId = setInterval(async () => {
            try {
              Logger.debug(`Running scheduled task: ${task.name}`);
              await task.handler.execute(this.client);
            } catch (error) {
              Logger.error(`Error in scheduled task ${task.name}: ${error instanceof Error ? error.message : String(error)}`);
            }
          }, interval);

          Logger.info(`Scheduled task ${task.name} (every ${interval}ms)`);
        }
      } catch (error) {
        Logger.error(`Failed to schedule task ${task.name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Stop all running tasks
   */
  stop(): void {
    for (const task of this.tasks.values()) {
      if (task.intervalId) {
        clearInterval(task.intervalId);
      }
    }
    Logger.info("All scheduled tasks stopped");
  }

  /**
   * Parse schedule string to milliseconds
   * Supports simple intervals like "every 1h", "every 30m", "every 1d"
   *
   * For more complex cron expressions, consider using a library like node-cron
   */
  private parseSchedule(schedule: string): number | null {
    // Simple interval format: "every 1h", "every 30m", etc.
    const intervalMatch = schedule.match(/^every (\d+)(s|m|h|d)$/);
    if (intervalMatch) {
      const amount = parseInt(intervalMatch[1]);
      const unit = intervalMatch[2];

      const multipliers: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000
      };

      return amount * multipliers[unit];
    }

    // For cron expressions, you'd need a proper cron parser
    // For now, we'll just support the simple interval format
    Logger.warn(`Unsupported schedule format: ${schedule}. Use "every <number><s|m|h|d>" format.`);
    return null;
  }

  /**
   * Get all registered tasks
   */
  getTasks(): Task[] {
    return Array.from(this.tasks.values());
  }
}
