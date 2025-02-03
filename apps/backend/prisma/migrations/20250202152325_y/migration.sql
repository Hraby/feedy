-- CreateEnum
CREATE TYPE "RestaurantStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "status" "RestaurantStatus" NOT NULL DEFAULT 'Pending';
