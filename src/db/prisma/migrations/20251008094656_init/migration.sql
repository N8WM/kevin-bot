-- CreateTable
CREATE TABLE `Birthday` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `month` INTEGER NOT NULL,
    `day` INTEGER NOT NULL,
    `year` INTEGER NULL,
    `guildId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Birthday_guildId_idx`(`guildId`),
    INDEX `Birthday_month_day_idx`(`month`, `day`),
    UNIQUE INDEX `Birthday_userId_guildId_key`(`userId`, `guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BirthdayConfig` (
    `id` VARCHAR(191) NOT NULL,
    `guildId` VARCHAR(191) NOT NULL,
    `announcementChannel` VARCHAR(191) NULL,
    `pingRecipient` VARCHAR(191) NOT NULL DEFAULT 'bd-acct',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BirthdayConfig_guildId_key`(`guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guild` (
    `snowflake` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`snowflake`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Birthday` ADD CONSTRAINT `Birthday_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`snowflake`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BirthdayConfig` ADD CONSTRAINT `BirthdayConfig_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`snowflake`) ON DELETE CASCADE ON UPDATE CASCADE;
