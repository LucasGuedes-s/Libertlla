/*
  Warnings:

  - You are about to drop the `MensagemChat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MensagemChat";

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" TEXT NOT NULL,
    "adminId" TEXT,
    "mensagens" JSONB NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);
