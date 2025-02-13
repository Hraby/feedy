-- CreateEnum
CREATE TYPE "CourierStatus" AS ENUM ('Available', 'Busy', 'Offline');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "courierStatus" "CourierStatus",
ADD COLUMN     "isCourier" BOOLEAN NOT NULL DEFAULT false;
