/*
  Warnings:

  - Added the required column `phone` to the `PendingRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PendingRegistration" ADD COLUMN     "phone" TEXT NOT NULL;