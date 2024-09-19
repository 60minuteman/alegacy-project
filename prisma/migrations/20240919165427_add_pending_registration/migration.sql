/*
  Warnings:

  - You are about to drop the column `investmentDate` on the `Investment` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfPackagesInvested` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `paymentVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ravenResponse` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `referralCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `referralLink` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `otp_store` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_referralCode_key";

-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "investmentDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "numberOfPackagesInvested",
DROP COLUMN "paymentVerified",
DROP COLUMN "ravenResponse",
DROP COLUMN "referralCode",
DROP COLUMN "referralLink",
DROP COLUMN "status";

-- DropTable
DROP TABLE "otp_store";

-- CreateTable
CREATE TABLE "PendingRegistration" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "selectedPackages" JSONB NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PendingRegistration" ADD CONSTRAINT "PendingRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
