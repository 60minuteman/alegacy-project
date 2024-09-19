/*
  Warnings:

  - You are about to drop the column `sessionId` on the `PendingRegistration` table. All the data in the column will be lost.
  - Changed the type of `amount` on the `PendingRegistration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PendingRegistration" DROP COLUMN "sessionId",
DROP COLUMN "amount",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;
