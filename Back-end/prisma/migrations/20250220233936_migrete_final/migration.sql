-- AlterTable
ALTER TABLE "Conversa" ADD COLUMN     "profissional" INTEGER;

-- AddForeignKey
ALTER TABLE "Conversa" ADD CONSTRAINT "Conversa_profissional_fkey" FOREIGN KEY ("profissional") REFERENCES "Profissionais"("id") ON DELETE SET NULL ON UPDATE CASCADE;
