/**
 * Testing utilities for Discord bot development.
 * These are helpers for testing commands and interactions.
 *
 * For full testing setup, consider using:
 * - Jest or Vitest for test runner
 * - discord.js test helpers or mock libraries
 */

import { Client, Guild, User, GuildMember, TextChannel } from "discord.js";

/**
 * Mock Discord client factory
 * Useful for unit testing without connecting to Discord
 */
export function createMockClient(overrides?: Partial<Client>): Client {
  return {
    isReady: () => true,
    ws: {
      ping: 50,
    },
    user: {
      id: "bot-id",
      username: "TestBot",
      tag: "TestBot#0000",
    },
    guilds: {
      cache: new Map(),
      fetch: async () => new Map(),
    },
    ...overrides,
  } as unknown as Client;
}

/**
 * Mock user factory
 */
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "user-id",
    username: "TestUser",
    tag: "TestUser#0000",
    bot: false,
    discriminator: "0000",
    ...overrides,
  } as unknown as User;
}

/**
 * Mock guild factory
 */
export function createMockGuild(overrides?: Partial<Guild>): Guild {
  return {
    id: "guild-id",
    name: "Test Guild",
    members: {
      cache: new Map(),
      fetch: async () => ({}) as GuildMember,
    },
    channels: {
      cache: new Map(),
      fetch: async () => ({}) as TextChannel,
    },
    ...overrides,
  } as unknown as Guild;
}

/**
 * Mock member factory
 */
export function createMockMember(overrides?: Partial<GuildMember>): GuildMember {
  return {
    id: "member-id",
    user: createMockUser(),
    roles: {
      cache: new Map(),
      add: async () => ({}) as GuildMember,
      remove: async () => ({}) as GuildMember,
    },
    permissions: {
      has: () => true,
    },
    ...overrides,
  } as unknown as GuildMember;
}

/**
 * Mock interaction factory for testing commands
 * Note: This is a simplified mock. For real testing, consider using
 * a proper mocking library or discord.js test utilities.
 */
export function createMockInteraction(overrides?: any) {
  return {
    user: createMockUser(),
    guild: createMockGuild(),
    member: createMockMember(),
    client: createMockClient(),
    commandName: "test",
    replied: false,
    deferred: false,
    ephemeral: false,
    reply: async (content: any) => {
      console.log("[Mock Reply]", content);
      return {} as any;
    },
    editReply: async (content: any) => {
      console.log("[Mock Edit Reply]", content);
      return {} as any;
    },
    deferReply: async () => {
      console.log("[Mock Defer Reply]");
    },
    isChatInputCommand: () => true,
    isCommand: () => true,
    isButton: () => false,
    isModalSubmit: () => false,
    options: {
      getString: (name: string) => null,
      getInteger: (name: string) => null,
      getBoolean: (name: string) => null,
      getUser: (name: string) => null,
      getChannel: (name: string) => null,
      getRole: (name: string) => null,
    },
    ...overrides,
  };
}

/**
 * Example test case structure (for Jest/Vitest):
 *
 * import { describe, it, expect } from "vitest"; // or jest
 * import { createMockInteraction } from "@util/testing";
 * import pingCommand from "@app/commands/ping";
 *
 * describe("Ping Command", () => {
 *   it("should respond with pong", async () => {
 *     const interaction = createMockInteraction();
 *     const client = createMockClient();
 *
 *     await pingCommand.run({ interaction, client });
 *
 *     expect(interaction.replied).toBe(true);
 *   });
 * });
 */
