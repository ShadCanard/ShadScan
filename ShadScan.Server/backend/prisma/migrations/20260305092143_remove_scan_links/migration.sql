/*
  Warnings:

  - You are about to drop the `_scanlinks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_scanlinks` DROP FOREIGN KEY `_ScanLinks_A_fkey`;

-- DropForeignKey
ALTER TABLE `_scanlinks` DROP FOREIGN KEY `_ScanLinks_B_fkey`;

-- DropTable
DROP TABLE `_scanlinks`;
