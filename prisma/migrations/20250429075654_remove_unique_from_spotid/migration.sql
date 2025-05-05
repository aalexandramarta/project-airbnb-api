-- DropForeignKey
ALTER TABLE `pictures` DROP FOREIGN KEY `pictures_ibfk_1`;

-- DropIndex
DROP INDEX `spot_id` ON `pictures`;

-- CreateIndex
CREATE INDEX `pictures_spot_id_idx` ON `pictures`(`spot_id`);

-- AddForeignKey
ALTER TABLE `pictures` ADD CONSTRAINT `pictures_ibfk_1` FOREIGN KEY (`spot_id`) REFERENCES `camping_spot`(`spot_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
