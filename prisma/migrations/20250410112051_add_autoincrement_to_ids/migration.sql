-- CreateTable
CREATE TABLE `amenities` (
    `amenitie_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`amenitie_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `amenities_spots` (
    `amenitie_spot_id` INTEGER NOT NULL AUTO_INCREMENT,
    `amenitie_id` INTEGER NULL,
    `spot_id` INTEGER NULL,

    INDEX `amenitie_id`(`amenitie_id`),
    INDEX `spot_id`(`spot_id`),
    PRIMARY KEY (`amenitie_spot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking` (
    `booking_id` INTEGER NOT NULL AUTO_INCREMENT,
    `spot_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `status_id` INTEGER NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `created` DATE NOT NULL,

    INDEX `spot_id`(`spot_id`),
    INDEX `status_id`(`status_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `camping_spot` (
    `spot_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `country_id` INTEGER NULL,
    `city_id` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NULL,
    `latitude` DECIMAL(10, 8) NULL,
    `longitude` DECIMAL(11, 8) NULL,
    `created` DATE NOT NULL,
    `description` VARCHAR(255) NULL,
    `base_price` DECIMAL(10, 2) NOT NULL,

    INDEX `city_id`(`city_id`),
    INDEX `country_id`(`country_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`spot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city` (
    `city_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`city_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `country` (
    `country_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`country_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorites` (
    `favorite_id` INTEGER NOT NULL AUTO_INCREMENT,
    `spot_id` INTEGER NULL,
    `user_id` INTEGER NULL,

    INDEX `spot_id`(`spot_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`favorite_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset` (
    `reset_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `reset_token` VARCHAR(255) NOT NULL,
    `expire_time` TIMESTAMP(0) NOT NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`reset_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pictures` (
    `picture_id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` TEXT NOT NULL,
    `spot_id` INTEGER NOT NULL,
    `uploaded_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `spot_id`(`spot_id`),
    PRIMARY KEY (`picture_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review` (
    `review_id` INTEGER NOT NULL AUTO_INCREMENT,
    `spot_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `rating` INTEGER NULL,
    `comment` TEXT NULL,
    `created` DATE NOT NULL,

    INDEX `spot_id`(`spot_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status` (
    `status_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`status_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created` DATE NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `amenities_spots` ADD CONSTRAINT `amenities_spots_ibfk_1` FOREIGN KEY (`amenitie_id`) REFERENCES `amenities`(`amenitie_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `amenities_spots` ADD CONSTRAINT `amenities_spots_ibfk_2` FOREIGN KEY (`spot_id`) REFERENCES `camping_spot`(`spot_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`spot_id`) REFERENCES `camping_spot`(`spot_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `status`(`status_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `camping_spot` ADD CONSTRAINT `camping_spot_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `camping_spot` ADD CONSTRAINT `camping_spot_ibfk_2` FOREIGN KEY (`country_id`) REFERENCES `country`(`country_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `camping_spot` ADD CONSTRAINT `camping_spot_ibfk_3` FOREIGN KEY (`city_id`) REFERENCES `city`(`city_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`spot_id`) REFERENCES `camping_spot`(`spot_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `password_reset` ADD CONSTRAINT `password_reset_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pictures` ADD CONSTRAINT `pictures_ibfk_1` FOREIGN KEY (`spot_id`) REFERENCES `camping_spot`(`spot_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`spot_id`) REFERENCES `camping_spot`(`spot_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
