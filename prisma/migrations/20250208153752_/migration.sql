-- AlterTable
ALTER TABLE "Persona" ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "performanceScore" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "type" TEXT;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
