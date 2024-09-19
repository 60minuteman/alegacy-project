/*
  Warnings:

  - The primary key for the `PendingRegistration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `amount` on the `PendingRegistration` table. All the data in the column will be lost.
  - The `id` column on the `PendingRegistration` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `investments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[accountNumber]` on the table `PendingRegistration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `totalAmount` to the `PendingRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PendingRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "investments" DROP CONSTRAINT "investments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_referred_by_code_fkey";

-- AlterTable
ALTER TABLE "PendingRegistration" DROP CONSTRAINT "PendingRegistration_pkey",
DROP COLUMN "amount",
ADD COLUMN     "accountName" TEXT,
ADD COLUMN     "bank" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PendingRegistration_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "investments";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "totalInvestmentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "numberOfPackagesInvested" INTEGER NOT NULL DEFAULT 0,
    "referralCode" TEXT NOT NULL,
    "referralLink" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" SERIAL NOT NULL,
    "packageName" TEXT NOT NULL,
    "investmentAmount" DOUBLE PRECISION NOT NULL,
    "investmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingInvestment" (
    "id" SERIAL NOT NULL,
    "packageName" TEXT NOT NULL,
    "investmentAmount" DOUBLE PRECISION NOT NULL,
    "pendingRegistrationId" INTEGER NOT NULL,

    CONSTRAINT "PendingInvestment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "PendingRegistration_accountNumber_key" ON "PendingRegistration"("accountNumber");

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingInvestment" ADD CONSTRAINT "PendingInvestment_pendingRegistrationId_fkey" FOREIGN KEY ("pendingRegistrationId") REFERENCES "PendingRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
