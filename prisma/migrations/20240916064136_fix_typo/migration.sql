/*
  Warnings:

  - The primary key for the `Video` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `comparessedSize` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `oringinalSize` on the `Video` table. All the data in the column will be lost.
  - The `id` column on the `Video` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `duration` on the `Video` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `compressedSize` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalSize` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Video" DROP CONSTRAINT "Video_pkey",
DROP COLUMN "comparessedSize",
DROP COLUMN "oringinalSize",
ADD COLUMN     "compressedSize" TEXT NOT NULL,
ADD COLUMN     "originalSize" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "duration" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Video_pkey" PRIMARY KEY ("id");
