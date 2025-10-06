# Example Application: Birthday Tracker

This template includes a **Birthday Tracker** as an example application to demonstrate how to build a complete feature.

## What's Included

The birthday tracker demonstrates:
- ✅ Database models with Prisma
- ✅ Service layer for data operations
- ✅ Slash commands with autocomplete
- ✅ Scheduled tasks for reminders
- ✅ Complete CRUD operations

## Files Added for This Example

All birthday-related files are prefixed with `example-` or `Birthday` for easy identification:

### Database Schema
- `src/db/prisma/schema/example-birthday.prisma`

### Services
- `src/services/exampleBirthdayService.ts`

### Commands
- `src/app/commands/example-birthday.ts` - Main birthday command with subcommands
- `src/app/commands/example-birthday-config.ts` - Admin configuration command

### Tasks
- `src/app/tasks/exampleBirthdayReminder.ts` - Daily reminder task

## How to Remove This Example

When you're ready to build your own bot, simply delete these files:

```bash
# Delete database schema
rm src/db/prisma/schema/example-birthday.prisma

# Delete service
rm src/services/exampleBirthdayService.ts

# Delete commands
rm src/app/commands/example-birthday.ts
rm src/app/commands/example-birthday-config.ts

# Delete tasks
rm src/app/tasks/exampleBirthdayReminder.ts

# Remove from ServiceManager - Delete lines marked with "EXAMPLE APP" comment
# Edit src/services/serviceManager.ts and remove:
#   - import { ExampleBirthdayService } from "./exampleBirthdayService";
#   - static exampleBirthday: ExampleBirthdayService;
#   - ServiceManager.exampleBirthday = new ExampleBirthdayService(prisma);

# Regenerate Prisma client
npm run prisma:generate

# Create new migration (if needed)
npm run prisma:migrate
```

**All lines that need removal are marked with `// EXAMPLE APP` comments!**

That's it! All birthday functionality removed.

## Features

### Commands

**`/example-birthday set`** - Set your birthday
- Autocomplete for month selection
- Validates dates

**`/example-birthday list`** - See upcoming birthdays
- Shows next 10 birthdays
- Sorted chronologically

**`/example-birthday remove`** - Remove your birthday from tracking

**`/example-birthday-config set-channel`** - Configure announcement channel (Admin only)
- Per-server configuration
- Requires Manage Server permission

**`/example-birthday-config view`** - View current configuration

### Automated Reminders

Every day, the bot checks for birthdays and sends a message to the configured channel (per server) celebrating users with birthdays today.

## Learning from This Example

Study these files to learn:
1. **Prisma Models** - How to define database schemas
2. **Services** - Clean data layer separation
3. **Subcommands** - Complex command structures
4. **Autocomplete** - Interactive option selection
5. **Scheduled Tasks** - Automated daily jobs
6. **Error Handling** - Graceful validation and error messages
