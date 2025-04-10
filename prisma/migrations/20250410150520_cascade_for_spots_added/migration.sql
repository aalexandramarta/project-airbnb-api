-- DropForeignKey
ALTER TABLE `amenities_spots` DROP FOREIGN KEY `amenities_spots_ibfk_2`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `booking_ibfk_1`;

-- DropForeignKey
ALTER TABLE `favorites` DROP FOREIGN KEY `favorites_ibfk_1`;

-- AddForeignKey
ALTER TABLE `amenities_spots` ADD CONSTRAINT `amenities_spots_ibfk_2` FOREIGN KEY (`spot_id`) REFERENCES `camping_spot`(`spot_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`spot_id`) REFERENCES `camping_spot`(`spot_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`spot_id`) REFERENCES `camping_spot`(`spot_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
