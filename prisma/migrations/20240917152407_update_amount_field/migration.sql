/*
  Warnings:

  - You are about to drop the column `accountName` on the `PendingRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `bank` on the `PendingRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `PendingRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `PendingRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PendingRegistration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[amount]` on the table `PendingRegistration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `PendingRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PendingRegistration" DROP COLUMN "accountName",
DROP COLUMN "bank",
DROP COLUMN "status",
DROP COLUMN "totalAmount",
DROP COLUMN "updatedAt",
ADD COLUMN     "amount" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PendingRegistration_amount_key" ON "PendingRegistration"("amount");
