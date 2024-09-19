/*
  Warnings:

  - You are about to drop the column `accountNumber` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_accountNumber_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accountNumber";
