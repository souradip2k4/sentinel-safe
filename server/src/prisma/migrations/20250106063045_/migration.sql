/*
  Warnings:

  - Added the required column `userName` to the `UserReviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserReviews" ADD COLUMN     "userName" TEXT NOT NULL;
