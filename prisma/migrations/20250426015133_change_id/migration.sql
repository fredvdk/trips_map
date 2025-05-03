/*
  Warnings:

  - The primary key for the `Trip` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Trip` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `from` DATETIME(3) NULL,
    MODIFY `till` DATETIME(3) NULL,
    MODIFY `hotel` VARCHAR(191) NULL DEFAULT 'N/A',
    MODIFY `hotelCost` DECIMAL(5, 2) NULL DEFAULT 0.00,
    MODIFY `transportMode` VARCHAR(191) NULL DEFAULT 'Unknown',
    MODIFY `transportCost` DECIMAL(5, 2) NULL DEFAULT 0.00,
    MODIFY `latitude` DECIMAL(9, 6) NULL DEFAULT 0.0,
    MODIFY `longitude` DECIMAL(9, 6) NULL DEFAULT 0.0,
    MODIFY `Status` ENUM('Completed', 'Scheduled') NULL DEFAULT 'Completed',
    ADD PRIMARY KEY (`id`);
