/*
  Warnings:

  - You are about to drop the `Processo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Processo" DROP CONSTRAINT "Processo_ocorrencia_fkey";

-- DropForeignKey
ALTER TABLE "Processo" DROP CONSTRAINT "Processo_registro_fkey";

-- DropForeignKey
ALTER TABLE "Profissionais" DROP CONSTRAINT "Profissionais_processo_fkey";

-- AlterTable
ALTER TABLE "Ocorrencias" ADD COLUMN     "profissional" INTEGER,
ADD COLUMN     "registro" INTEGER;

-- DropTable
DROP TABLE "Processo";

-- AddForeignKey
ALTER TABLE "Ocorrencias" ADD CONSTRAINT "Ocorrencias_registro_fkey" FOREIGN KEY ("registro") REFERENCES "Registro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ocorrencias" ADD CONSTRAINT "Ocorrencias_profissional_fkey" FOREIGN KEY ("profissional") REFERENCES "Profissionais"("id") ON DELETE SET NULL ON UPDATE CASCADE;
