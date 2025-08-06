-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CountryCode" ADD VALUE 'GB';
ALTER TYPE "CountryCode" ADD VALUE 'DE';
ALTER TYPE "CountryCode" ADD VALUE 'FR';
ALTER TYPE "CountryCode" ADD VALUE 'IT';
ALTER TYPE "CountryCode" ADD VALUE 'ES';
ALTER TYPE "CountryCode" ADD VALUE 'CA';
ALTER TYPE "CountryCode" ADD VALUE 'AU';
ALTER TYPE "CountryCode" ADD VALUE 'JP';
ALTER TYPE "CountryCode" ADD VALUE 'CN';
ALTER TYPE "CountryCode" ADD VALUE 'IN';
ALTER TYPE "CountryCode" ADD VALUE 'BR';
ALTER TYPE "CountryCode" ADD VALUE 'MX';
ALTER TYPE "CountryCode" ADD VALUE 'AR';
