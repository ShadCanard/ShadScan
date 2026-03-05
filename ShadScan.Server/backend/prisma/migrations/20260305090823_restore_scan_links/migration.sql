-- CreateTable
CREATE TABLE `_ScanLinks` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ScanLinks_AB_unique`(`A`, `B`),
    INDEX `_ScanLinks_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ScanLinks` ADD CONSTRAINT `_ScanLinks_A_fkey` FOREIGN KEY (`A`) REFERENCES `scans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ScanLinks` ADD CONSTRAINT `_ScanLinks_B_fkey` FOREIGN KEY (`B`) REFERENCES `scans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
