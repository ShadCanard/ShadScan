/*
  Warnings:

  - You are about to drop the column `fileName` on the `scans` table. All the data in the column will be lost.
  - You are about to drop the column `filePath` on the `scans` table. All the data in the column will be lost.
  - You are about to drop the column `fileSize` on the `scans` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `scans` table. All the data in the column will be lost.
  - You are about to drop the `_scanlinks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_scanlinks` DROP FOREIGN KEY `_ScanLinks_A_fkey`;

-- DropForeignKey
ALTER TABLE `_scanlinks` DROP FOREIGN KEY `_ScanLinks_B_fkey`;

-- AlterTable
ALTER TABLE `scans` DROP COLUMN `fileName`,
    DROP COLUMN `filePath`,
    DROP COLUMN `fileSize`,
    DROP COLUMN `mimeType`;

-- DropTable
DROP TABLE `_scanlinks`;

-- CreateTable
CREATE TABLE `scan_files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scanId` INTEGER NOT NULL,
    `filePath` VARCHAR(500) NOT NULL,
    `fileName` VARCHAR(255) NOT NULL,
    `mimeType` VARCHAR(100) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `scan_files_scanId_idx`(`scanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `scan_files` ADD CONSTRAINT `scan_files_scanId_fkey` FOREIGN KEY (`scanId`) REFERENCES `scans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
