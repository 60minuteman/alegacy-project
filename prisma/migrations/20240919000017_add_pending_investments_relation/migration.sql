/*
  Warnings:

  - You are about to drop the column `accountName` on the `PendingRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `accountNumber` on the `PendingRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `bank` on the `PendingRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `paymentVerified` on the `PendingRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `PendingRegistration` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `PendingRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PendingRegistration_accountNumber_key";

-- DropIndex
DROP INDEX "PendingRegistration_email_key";

-- AlterTable
ALTER TABLE "PendingRegistration" DROP COLUMN "accountName",
DROP COLUMN "accountNumber",
DROP COLUMN "bank",
DROP COLUMN "paymentVerified",
DROP COLUMN "phone",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
