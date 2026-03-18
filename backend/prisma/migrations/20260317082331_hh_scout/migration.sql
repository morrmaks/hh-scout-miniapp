/*
  Warnings:

  - You are about to drop the column `statusId` on the `Favorite` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_statusId_fkey";

-- DropIndex
DROP INDEX "Favorite_salaryBase_idx";

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "statusId";

-- CreateTable
CREATE TABLE "Resume" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "favoriteId" INTEGER NOT NULL,
    "resumeId" INTEGER NOT NULL,
    "statusId" INTEGER,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");

-- CreateIndex
CREATE INDEX "Application_resumeId_idx" ON "Application"("resumeId");

-- CreateIndex
CREATE INDEX "Application_statusId_idx" ON "Application"("statusId");

-- CreateIndex
CREATE INDEX "Application_userId_idx" ON "Application"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_favoriteId_resumeId_key" ON "Application"("favoriteId", "resumeId");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_favoriteId_fkey" FOREIGN KEY ("favoriteId") REFERENCES "Favorite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE SET NULL ON UPDATE CASCADE;
