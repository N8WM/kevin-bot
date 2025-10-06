# Discord Bot Template

A production-ready Discord bot template with TypeScript, Prisma, and a powerful
command/event registry system.

**📘 Includes a complete example application** - See [EXAMPLE_APP.md](EXAMPLE_APP.md) for a Birthday Tracker demo that shows all features in action!

## Features

- ✅ **TypeScript** - Full type safety with strict mode
- ✅ **Prisma** - Type-safe database ORM with PostgreSQL
- ✅ **Auto-loading** - Commands and events automatically registered from file system
- ✅ **Autocomplete Support** - Built-in autocomplete for slash command options
- ✅ **Context Menus** - User and message context menu commands
- ✅ **Middleware System** - Built-in cooldowns, permissions, and custom middleware
- ✅ **Component Handlers** - Button, modal, and select menu support with regex patterns
- ✅ **Error Handling** - Centralized error handler registry for all interaction types
- ✅ **Scheduled Tasks** - Simple task scheduler for recurring jobs
- ✅ **Path Aliases** - Clean imports with `@core/*`, `@lib/*`, `@services`, etc.
- ✅ **Environment Validation** - Validates required env vars on startup
- ✅ **Logging** - Pino logger with file and console output
- ✅ **Permission Checks** - Built-in user and bot permission validation
- ✅ **Smart Deployment** - Optional command diffing to only update changed commands
- ✅ **Health Checks** - HTTP endpoints for monitoring and container orchestration
- ✅ **Testing Utilities** - Mock factories for Discord.js objects

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Discord Bot Token ([Discord Developer Portal](https://discord.com/developers/applications))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/dbot-template.git
   cd dbot-template
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your values:

   ```env
   TOKEN=your_bot_token_here
   DEV_GUILD_IDS=guild_id_1,guild_id_2
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
   ```

4. **Set up the database**

   ```bash
   npm run prisma:migrate
   ```

5. **Run in development mode**

   ```bash
   npm run dev
   ```

6. **Build for production**

   ```bash
   npm run build
   npm start
   ```

## Example Application

This template includes a **Birthday Tracker** example to demonstrate all features:
- Database models with Prisma
- Service layer patterns
- Commands with autocomplete
- Scheduled daily reminders
- Complete CRUD operations

See **[EXAMPLE_APP.md](EXAMPLE_APP.md)** for details and easy removal instructions when you're ready to build your own bot!

## Project Structure

```text
├── src/
│   ├── app/
│   │   ├── commands/         # Bot commands (auto-loaded)
│   │   ├── components/       # Component handlers (buttons, modals)
│   │   ├── events/           # Discord events (auto-loaded)
│   │   ├── config.ts         # Application configuration
│   │   └── index.ts          # Entry point
│   ├── core/                 # Core framework (required)
│   │   ├── config/
│   │   │   ├── env.ts        # Environment validation
│   │   │   └── paths.ts      # Path resolution
│   │   ├── logger/
│   │   │   └── index.ts      # Pino logger setup
│   │   ├── registry/
│   │   │   ├── command.ts    # Command type definitions
│   │   │   ├── component.ts  # Component registry
│   │   │   ├── event.ts      # Event type definitions
│   │   │   ├── middleware.ts # Middleware system
│   │   │   ├── reader.ts     # File system reader
│   │   │   ├── registrar.ts  # Discord API command registration
│   │   │   ├── registry.ts   # Main registry logic
│   │   │   └── handlers/     # Built-in event handlers
│   │   └── types/
│   │       └── result.ts     # Result type for error handling
│   ├── db/
│   │   └── prisma/
│   │       └── schema/       # Prisma database schema
│   ├── examples/             # Example implementations
│   │   ├── commands/         # Command examples
│   │   │   ├── slash-with-autocomplete.ts
│   │   │   ├── slash-with-subcommands.ts
│   │   │   ├── user-context-menu.ts
│   │   │   └── message-context-menu.ts
│   │   ├── tasks/            # Scheduled task examples
│   │   │   ├── daily-cleanup.ts
│   │   │   └── hourly-sync.ts
│   │   ├── component-registry-example.ts
│   │   ├── error-handlers-example.ts
│   │   ├── healthcheck-example.ts
│   │   └── middleware-example.ts
│   ├── lib/                  # Optional tools
│   │   ├── commandDiff.ts    # Smart command deployment
│   │   ├── healthCheck.ts    # Health check endpoints
│   │   ├── permissions.ts    # Permission helpers
│   │   ├── scheduler.ts      # Task scheduler
│   │   └── validation.ts     # Zod validation patterns
│   ├── services/
│   │   ├── baseService.ts    # Base service class
│   │   ├── guildService.ts   # Guild database operations
│   │   └── serviceManager.ts # Service manager
│   └── test/
│       └── mocks.ts          # Testing utilities and mock factories
├── .env.example              # Example environment variables
├── eslint.config.ts          # ESLint configuration
├── prisma.config.ts          # Prisma configuration
├── tsconfig.json             # TypeScript configuration
└── package.json
```

### Directory Breakdown

- **`src/core/`** - Core framework code (required for the bot to function)
  - `config/` - Environment and path utilities
  - `logger/` - Logging system
  - `registry/` - Command/event auto-loading system, error handlers
  - `types/` - Shared type definitions

- **`src/lib/`** - Optional libraries and tools (pick what you need)
  - Smart command deployment
  - Health check endpoints
  - Task scheduler
  - Permission helpers
  - Validation utilities

- **`src/examples/`** - Implementation examples
  - Command examples (autocomplete, context menus, subcommands)
  - Scheduled task examples
  - Component registry examples
  - Error handler setup
  - Middleware examples

- **`src/test/`** - Testing utilities
  - Mock factories for Discord.js objects
  - Test helpers

- **`src/app/`** - Your bot's application code
  - `commands/` - Slash commands (auto-loaded)
  - `events/` - Discord event handlers (auto-loaded)
  - `components/` - Button/modal/select handlers (auto-loaded)
    - `buttons/` - Button handlers
    - `modals/` - Modal submission handlers
    - `selects/` - Select menu handlers
  - `tasks/` - Scheduled tasks (auto-loaded)
  - `errorHandlers/` - Error handlers by context (auto-loaded)
  - `config.ts` - Application configuration

- **`src/services/`** - Database service layer
  - Prisma-based services for data operations

## Auto-Loading System

All features are automatically loaded from their respective directories - **no manual registration required!**

The Registry automatically scans and registers:
- ✅ Commands from `src/app/commands/`
- ✅ Events from `src/app/events/`
- ✅ Components from `src/app/components/` (buttons/modals/selects)
- ✅ Tasks from `src/app/tasks/`
- ✅ Error handlers from `src/app/errorHandlers/`

Just create a file, export a default handler, and it's registered automatically on startup!

## Creating Commands

Commands are automatically loaded from `src/app/commands/`. Create a new file:

```typescript
// src/app/commands/hello.ts
import { ApplicationCommandType, SlashCommandBuilder } from "discord.js";
import { CommandHandler } from "@core/registry/command";

const handler: CommandHandler<ApplicationCommandType.ChatInput> = {
  type: ApplicationCommandType.ChatInput,
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Says hello!"),

  async run({ interaction }) {
    await interaction.reply(`Hello, ${interaction.user.username}!`);
  },
};

export default handler;
```

### Command Options

```typescript
options: {
  devOnly: true,                          // Only in dev guilds
  userPermissions: ["ManageMessages"],    // Required user permissions
  botPermissions: ["SendMessages"],       // Required bot permissions
  middleware: [                            // Custom middleware
    builtinMiddleware.cooldown(5),
    builtinMiddleware.guildOnly()
  ]
}
```

## Creating Events

Events are automatically loaded from `src/app/events/`. The folder name must
match the Discord.js event name:

```typescript
// src/app/events/messageCreate/logMessages.ts
import { Events } from "discord.js";
import { EventHandler } from "@core/registry/event";
import { Logger } from "@core/logger";

const handler: EventHandler<Events.MessageCreate> = {
  async execute(message) {
    Logger.info(`Message from ${message.author.tag}: ${message.content}`);
  },
};

export default handler;
```

## Middleware

Built-in middleware functions:

```typescript
import { builtinMiddleware } from "@core/registry/middleware";

// Guild only
builtinMiddleware.guildOnly()

// DM only
builtinMiddleware.dmOnly()

// Cooldown (seconds)
builtinMiddleware.cooldown(5)

// Require role
builtinMiddleware.requireRole("role_id_1", "role_id_2")

// Require specific users
builtinMiddleware.requireUser("user_id_1", "user_id_2")
```

### Custom Middleware

```typescript
import { Middleware } from "@core/registry/middleware";

const customMiddleware: Middleware = async ({ interaction, client }) => {
  if (/* some condition */) {
    return {
      continue: false,
      error: "Custom error message"
    };
  }

  return { continue: true };
};
```

## Component Handlers

Components (buttons, modals, select menus) are **automatically registered** from the `src/app/components/` directory.

### Buttons

```typescript
// src/app/components/buttons/approve.ts
import { ButtonHandler } from "@core/registry/component";

const handler: ButtonHandler = {
  async execute({ interaction }) {
    await interaction.reply({
      content: "Request approved!",
      ephemeral: true
    });
  }
};

export default handler;
```

The button is auto-registered with customId `"approve"` (the filename).

### Modals

```typescript
// src/app/components/modals/feedback.ts
import { ModalHandler } from "@core/registry/component";

const handler: ModalHandler = {
  async execute({ interaction }) {
    const rating = interaction.fields.getTextInputValue("rating");
    await interaction.reply("Thanks for your feedback!");
  }
};

export default handler;
```

Auto-registered with customId `"feedback"`.

### Select Menus

```typescript
// src/app/components/selects/roleSelect.ts
import { SelectMenuHandler } from "@core/registry/component";

const handler: SelectMenuHandler = {
  async execute({ interaction }) {
    await interaction.reply(`You selected: ${interaction.values.join(", ")}`);
  }
};

export default handler;
```

Auto-registered with customId `"roleSelect"`.

**Regex Pattern Matching:** Use filenames with special characters for pattern matching (e.g., `^role_select_` will match any customId starting with "role_select_").

## Autocomplete

Add autocomplete to slash command options:

```typescript
import { ApplicationCommandType, SlashCommandBuilder } from "discord.js";
import { CommandHandler } from "@core/registry/command";

const handler: CommandHandler<ApplicationCommandType.ChatInput> = {
  type: ApplicationCommandType.ChatInput,
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search for something")
    .addStringOption(opt =>
      opt
        .setName("query")
        .setDescription("Search query")
        .setAutocomplete(true)
        .setRequired(true)
    ),

  async run({ interaction }) {
    const query = interaction.options.getString("query", true);
    await interaction.reply(`Searching for: ${query}`);
  },

  async autocomplete({ interaction }) {
    const focused = interaction.options.getFocused();

    // Get suggestions based on user input
    const suggestions = ["Apple", "Banana", "Cherry"]
      .filter(item => item.toLowerCase().includes(focused.toLowerCase()))
      .map(item => ({ name: item, value: item.toLowerCase() }));

    await interaction.respond(suggestions.slice(0, 25));
  }
};
```

See `src/examples/commands/slash-with-autocomplete.ts` for more examples.

## Context Menu Commands

Create context menu commands that appear when right-clicking users or messages:

```typescript
// User context menu (right-click user -> Apps -> "User Info")
import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { CommandHandler } from "@core/registry/command";

const handler: CommandHandler<ApplicationCommandType.User> = {
  type: ApplicationCommandType.User,
  data: new ContextMenuCommandBuilder().setName("User Info"),

  async run({ interaction }) {
    const user = interaction.targetUser;
    await interaction.reply(`User: ${user.tag}`);
  }
};
```

See `src/examples/commands/` for user and message context menu examples.

## Error Handling

Error handlers are **automatically registered** from `src/app/errorHandlers/`. Create one file per context type:

```typescript
// src/app/errorHandlers/command.ts
import { ErrorHandler } from "@core/registry/errorHandler";
import { Logger } from "@core/logger";

const handler: ErrorHandler = async (error, context) => {
  if (context.type !== "command") return;

  Logger.error(`Command Error (${context.command.name}): ${error.message}`);
  Logger.error(error.stack ?? "");

  await context.interaction.reply({
    content: "An error occurred!",
    ephemeral: true
  });
};

export default handler;
```

Create handlers for each context:
- `command.ts` - Slash command errors
- `component.ts` - Button/modal/select errors
- `autocomplete.ts` - Autocomplete errors
- `event.ts` - Event handler errors
- `task.ts` - Scheduled task errors
- `global.ts` - Fallback for any unhandled errors

Each file is auto-registered based on its filename!

## Scheduled Tasks

Tasks are **automatically registered and started** from `src/app/tasks/`:

```typescript
// src/app/tasks/dailyCleanup.ts
import { TaskHandler } from "@core/registry/task";
import { Logger } from "@core/logger";

const handler: TaskHandler = {
  name: "Daily Cleanup",
  schedule: "every 1d", // Runs every day
  runOnStart: false,

  async execute(client) {
    Logger.info("Running daily cleanup...");
    // Your cleanup logic here
  }
};

export default handler;
```

Supported schedule formats:
- `"every 30s"` - Every 30 seconds
- `"every 5m"` - Every 5 minutes
- `"every 1h"` - Every hour
- `"every 1d"` - Every day

**All tasks are automatically started** when the bot becomes ready - no manual setup needed!

## Database Operations

```typescript
import { ServiceManager } from "@services";

// In your command/event handler
const guild = await ServiceManager.guild.get(guildId);
```

### Adding New Services

1. Create a new service file in `src/services/`:

```typescript
import { BaseService } from "./baseService";

export class MyService extends BaseService {
  async getData(id: string) {
    return await this.prisma.myModel.findUnique({ where: { id } });
  }
}
```

2. Register in `ServiceManager`:

```typescript
// src/services/serviceManager.ts
static init(prisma: PrismaClient) {
  ServiceManager.myService = new MyService(prisma);
  // ...
}
```

## Optional Features

### Smart Command Deployment

Enable smart command deployment to only update changed commands (reduces API calls):

```env
USE_SMART_COMMAND_DEPLOYMENT=true
```

This uses the `CommandDiffer` utility to compare local commands with registered commands and only updates what's changed.

### Health Checks

Health check endpoints are **automatically started** when enabled in your `.env`:

```env
ENABLE_HEALTH_CHECK=true
HEALTH_CHECK_PORT=3000
```

When enabled, two HTTP endpoints are automatically created:
- `http://localhost:3000/health` - Full health status (Discord + Database)
- `http://localhost:3000/ready` - Simple ready check

Perfect for Docker healthchecks, Kubernetes probes, or monitoring services!

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TOKEN` | Yes | Discord bot token |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DEV_GUILD_IDS` | No | Comma-separated guild IDs for dev commands |
| `USE_SMART_COMMAND_DEPLOYMENT` | No | Enable smart command deployment (default: false) |
| `HEALTH_CHECK_PORT` | No | Port for health check server (default: 3000) |

## Scripts

- `npm run dev` - Start in development mode with hot reload
- `npm run build` - Build for production
- `npm start` - Start production build
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:deploy` - Deploy migrations (production)

## Deployment

### Docker Compose (Recommended)

See `docker-compose.yml` for a complete setup with PostgreSQL.

```bash
docker compose up -d
```

### Manual Deployment

1. Build the project:

   ```bash
   npm run build
   ```

2. Set environment variables on your server

3. Run migrations:

   ```bash
   npm run prisma:deploy
   ```

4. Start the bot:

   ```bash
   npm start
   ```

## License

MIT
