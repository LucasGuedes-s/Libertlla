-- AlterTable
ALTER TABLE "Registro" ADD COLUMN     "chatId" TEXT;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Conversa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
