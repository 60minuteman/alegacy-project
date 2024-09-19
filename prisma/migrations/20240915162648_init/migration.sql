-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "total_investment_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "number_of_packages_invested" INTEGER NOT NULL DEFAULT 0,
    "referral_code" TEXT NOT NULL,
    "raven_session_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "package_name" TEXT NOT NULL,
    "investment_amount" DECIMAL(65,30) NOT NULL,
    "investment_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_store" (
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiry_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_store_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_referral_code_key" ON "users"("referral_code");

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
