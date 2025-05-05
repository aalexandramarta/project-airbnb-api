/*
  Warnings:

  - You are about to alter the column `name` on the `city` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `name` on the `country` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - A unique constraint covering the columns `[name]` on the table `city` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `country` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `city` MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `country` MODIFY `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `city_name_key` ON `city`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `country_name_key` ON `country`(`name`);
