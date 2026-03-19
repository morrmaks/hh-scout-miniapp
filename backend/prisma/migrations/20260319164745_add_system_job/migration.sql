-- CreateTable
CREATE TABLE "SystemJob" (
    "key" TEXT NOT NULL,
    "lastRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemJob_pkey" PRIMARY KEY ("key")
);
