/*
  Warnings:

  - The `currency` column on the `Favorite` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('RUR', 'USD', 'EUR');

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency";
