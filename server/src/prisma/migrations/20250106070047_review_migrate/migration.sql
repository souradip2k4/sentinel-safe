/*
  Warnings:

  - You are about to drop the column `reviewCount` on the `LocationMetrics` table. All the data in the column will be lost.
  - You are about to drop the column `userRating` on the `LocationMetrics` table. All the data in the column will be lost.
  - You are about to drop the column `locationMetricsId` on the `UserReviews` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserReviews" DROP CONSTRAINT "UserReviews_locationMetricsId_fkey";

-- AlterTable
ALTER TABLE "GeoCode" ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "LocationMetrics" DROP COLUMN "reviewCount",
DROP COLUMN "userRating";

-- AlterTable
ALTER TABLE "UserReviews" DROP COLUMN "locationMetricsId",
ADD COLUMN     "geoCodeId" TEXT;

-- AddForeignKey
ALTER TABLE "UserReviews" ADD CONSTRAINT "UserReviews_geoCodeId_fkey" FOREIGN KEY ("geoCodeId") REFERENCES "GeoCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
