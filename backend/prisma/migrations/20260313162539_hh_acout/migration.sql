-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Currency" ADD VALUE 'UZS';
ALTER TYPE "Currency" ADD VALUE 'UAH';
ALTER TYPE "Currency" ADD VALUE 'KZT';
ALTER TYPE "Currency" ADD VALUE 'KGS';
ALTER TYPE "Currency" ADD VALUE 'GEL';
ALTER TYPE "Currency" ADD VALUE 'BYR';
ALTER TYPE "Currency" ADD VALUE 'AZN';

-- CreateIndex
CREATE INDEX "Favorite_salaryBase_idx" ON "Favorite"("salaryBase");
