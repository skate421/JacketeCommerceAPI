/*
  Warnings:

  - You are about to drop the column `createdAt` on the `product` table. All the data in the column will be lost.
  - You are about to alter the column `cost` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - Made the column `cost` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image_filename` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_product" (
    "product_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" REAL NOT NULL,
    "image_filename" TEXT NOT NULL
);
INSERT INTO "new_product" ("cost", "description", "image_filename", "name", "product_id") SELECT "cost", "description", "image_filename", "name", "product_id" FROM "product";
DROP TABLE "product";
ALTER TABLE "new_product" RENAME TO "product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
