/*
  Warnings:

  - A unique constraint covering the columns `[spot_id,user_id]` on the table `review` will be added. If there are existing duplicate values, this will fail.
  - Made the column `spot_id` on table `review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating` on table `review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `review_ibfk_1`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `review_ibfk_2`;

-- AlterTable
ALTER TABLE `review` MODIFY `spot_id` INTEGER NOT NULL,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `rating` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `review_spot_id_user_id_key` ON `review`(`spot_id`, `user_id`);

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`spot_id`) REFERENCES `camping_spot`(`spot_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
