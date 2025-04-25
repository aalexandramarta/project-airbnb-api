-- AlterTable
ALTER TABLE `city` ADD COLUMN `country_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `city_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `country`(`country_id`) ON DELETE SET NULL ON UPDATE CASCADE;
