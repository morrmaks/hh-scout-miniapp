/*
  Warnings:

  - The values [RUR,BYR] on the enum `Currency` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Currency_new" AS ENUM ('UZS', 'USD', 'UAH', 'RUB', 'KZT', 'KGS', 'GEL', 'EUR', 'BYN', 'AZN');
ALTER TABLE "Favorite" ALTER COLUMN "currency" TYPE "Currency_new" USING ("currency"::text::"Currency_new");
ALTER TYPE "Currency" RENAME TO "Currency_old";
ALTER TYPE "Currency_new" RENAME TO "Currency";
DROP TYPE "Currency_old";
COMMIT;
