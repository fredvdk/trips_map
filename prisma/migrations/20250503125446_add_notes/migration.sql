/*
  Warnings:

  - You are about to drop the column `Status` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Trip` DROP COLUMN `Status`,
    ADD COLUMN `notes` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `status` ENUM('Completed', 'Scheduled') NULL DEFAULT 'Completed';
