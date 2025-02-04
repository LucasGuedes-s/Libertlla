-- CreateTable
CREATE TABLE "MensagemChat" (
    "id" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remetente" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "adminId" TEXT,

    CONSTRAINT "MensagemChat_pkey" PRIMARY KEY ("id")
);
