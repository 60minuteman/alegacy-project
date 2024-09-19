/*
  Warnings:

  - You are about to drop the column `expiry_time` on the `otp_store` table. All the data in the column will be lost.
  - Added the required column `expiryTime` to the `otp_store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "otp_store" DROP COLUMN "expiry_time",
ADD COLUMN     "expiryTime" TIMESTAMP(3) NOT NULL;
