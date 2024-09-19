/*
  Warnings:

  - You are about to drop the `PendingInvestment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PendingRegistration` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[accountNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PendingInvestment" DROP CONSTRAINT "PendingInvestment_pendingRegistrationId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paymentVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ravenResponse" JSONB,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "PendingInvestment";

-- DropTable
DROP TABLE "PendingRegistration";

-- CreateIndex
CREATE UNIQUE INDEX "User_accountNumber_key" ON "User"("accountNumber");
