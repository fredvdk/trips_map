-- CreateTable
CREATE TABLE `Trip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `destination` VARCHAR(191) NOT NULL,
    `from` DATETIME(3) NOT NULL,
    `till` DATETIME(3) NOT NULL,
    `hotel` VARCHAR(191) NOT NULL,
    `hotelCost` DECIMAL(5, 2) NOT NULL,
    `transportMode` VARCHAR(191) NOT NULL,
    `transportCost` DECIMAL(5, 2) NOT NULL,
    `latitude` DECIMAL(9, 6) NOT NULL,
    `longitude` DECIMAL(9, 6) NOT NULL,
    `Status` ENUM('Completed', 'Scheduled') NOT NULL DEFAULT 'Completed',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
