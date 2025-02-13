-- DropForeignKey
ALTER TABLE "Ocorrencias" DROP CONSTRAINT "Ocorrencias_registro_fkey";

-- AlterTable
ALTER TABLE "Registro" ADD COLUMN     "ocorrenciaId" INTEGER;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_ocorrenciaId_fkey" FOREIGN KEY ("ocorrenciaId") REFERENCES "Ocorrencias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
