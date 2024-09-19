-- DropIndex
DROP INDEX "PendingRegistration_accountNumber_key";

-- AlterTable
ALTER TABLE "PendingRegistration" ALTER COLUMN "accountNumber" DROP NOT NULL;
