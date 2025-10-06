import { Client } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { HealthChecker } from "@lib/healthCheck";
import { Logger } from "@core/logger";

/**
 * Example: Setting up health checks for your bot
 *
 * Health checks help monitor your bot's status and can be used
 * with monitoring services, container orchestration, or load balancers.
 */

/**
 * Periodic health check - runs every minute and logs status
 */
export function setupPeriodicHealthCheck(client: Client, prisma: PrismaClient) {
  const healthChecker = new HealthChecker(client, prisma);

  setInterval(async () => {
    const status = await healthChecker.check();

    if (status.status === "unhealthy") {
      Logger.error("Bot is unhealthy!");
      Logger.error(`Discord: ${status.checks.discord.connected ? "Connected" : "Disconnected"}`);
      Logger.error(`Database: ${status.checks.database.connected ? "Connected" : "Disconnected"}`);

      // Could send alerts here
    } else {
      Logger.debug(`Health check passed - Uptime: ${Math.floor(status.uptime / 1000)}s`);
    }
  }, 60000); // Check every minute
}

/**
 * HTTP health endpoint using Node's built-in http module
 *
 * For production, consider using Express or Fastify
 */
export function setupHealthEndpoint(client: Client, prisma: PrismaClient) {
  const http = require("http");
  const healthChecker = new HealthChecker(client, prisma);

  const server = http.createServer(async (req: any, res: any) => {
    if (req.url === "/health") {
      const status = await healthChecker.check();

      res.statusCode = status.status === "healthy" ? 200 : 503;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(status, null, 2));
    } else if (req.url === "/ready") {
      const isReady = await healthChecker.isHealthy();

      res.statusCode = isReady ? 200 : 503;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ready: isReady }));
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  });

  const port = parseInt(process.env["HEALTH_CHECK_PORT"] ?? "3000");
  server.listen(port, () => {
    Logger.info(`Health check endpoint available at http://localhost:${port}/health`);
    Logger.info(`Readiness check endpoint available at http://localhost:${port}/ready`);
  });
}
