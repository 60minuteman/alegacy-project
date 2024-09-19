/*
  Warnings:

  - You are about to drop the column `phone` on the `PendingRegistration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PendingRegistration" DROP COLUMN "phone",
ADD COLUMN     "accountNumber" TEXT;
