/*
  Warnings:

  - You are about to drop the column `expiryTime` on the `otp_store` table. All the data in the column will be lost.
  - Added the required column `expiry_time` to the `otp_store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "otp_store" DROP COLUMN "expiryTime",
ADD COLUMN     "expiry_time" TIMESTAMP(3) NOT NULL;
