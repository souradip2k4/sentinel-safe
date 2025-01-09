-- CreateTable
CREATE TABLE "LocationMetrics" (
    "id" TEXT NOT NULL,
    "lumen" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "peopleCount" INTEGER NOT NULL DEFAULT 0,
    "areaRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "userRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "geoCodesId" TEXT NOT NULL,

    CONSTRAINT "LocationMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeoCode" (
    "id" TEXT NOT NULL,
    "campusName" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "camId" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReviews" (
    "id" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locationMetricsId" TEXT,

    CONSTRAINT "UserReviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LocationMetrics" ADD CONSTRAINT "LocationMetrics_geoCodesId_fkey" FOREIGN KEY ("geoCodesId") REFERENCES "GeoCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReviews" ADD CONSTRAINT "UserReviews_locationMetricsId_fkey" FOREIGN KEY ("locationMetricsId") REFERENCES "LocationMetrics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
