/*
  Warnings:

  - A unique constraint covering the columns `[referral_link]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referral_link` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "referral_link" TEXT NOT NULL,
ADD COLUMN     "referred_by_code" TEXT;

-- CreateTable
CREATE TABLE "PendingRegistration" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PendingRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingRegistration_email_key" ON "PendingRegistration"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PendingRegistration_accountNumber_key" ON "PendingRegistration"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_referral_link_key" ON "users"("referral_link");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_referred_by_code_fkey" FOREIGN KEY ("referred_by_code") REFERENCES "users"("referral_code") ON DELETE SET NULL ON UPDATE CASCADE;
