/*
  Warnings:

  - You are about to drop the column `profissional` on the `Ocorrencias` table. All the data in the column will be lost.
  - You are about to drop the column `processo` on the `Profissionais` table. All the data in the column will be lost.
  - Added the required column `endereco_vitima` to the `Ocorrencias` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ocorrencias" DROP CONSTRAINT "Ocorrencias_profissional_fkey";

-- AlterTable
ALTER TABLE "Ocorrencias" DROP COLUMN "profissional",
ADD COLUMN     "endereco" TEXT,
ADD COLUMN     "endereco_vitima" TEXT NOT NULL,
ADD COLUMN     "vitimaId" INTEGER;

-- AlterTable
ALTER TABLE "Profissionais" DROP COLUMN "processo";

-- AlterTable
ALTER TABLE "Registro" ADD COLUMN     "assinatura" VARCHAR(2048),
ADD COLUMN     "testemunhas" VARCHAR(2048)[],
ADD COLUMN     "vitimaId" INTEGER;

-- CreateTable
CREATE TABLE "OcorrenciasProfissionais" (
    "ocorrenciaId" INTEGER NOT NULL,
    "profissionalId" INTEGER NOT NULL,

    CONSTRAINT "OcorrenciasProfissionais_pkey" PRIMARY KEY ("ocorrenciaId","profissionalId")
);

-- CreateTable
CREATE TABLE "Vitima" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "dataNascimento" TEXT NOT NULL,
    "cpf" TEXT,
    "email" TEXT NOT NULL,
    "senha" TEXT,
    "telefone" VARCHAR(15),
    "genero" TEXT,
    "estadoCivil" TEXT,
    "profissao" TEXT,
    "escolaridade" TEXT,
    "endereco" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "etnia" TEXT,
    "contatosdeEmergencia" VARCHAR(2048)[],
    "processosJudiciais" VARCHAR(2048),

    CONSTRAINT "Vitima_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relacao_agressor_vitima" (
    "agressorId" INTEGER NOT NULL,
    "vitimaId" INTEGER NOT NULL,

    CONSTRAINT "relacao_agressor_vitima_pkey" PRIMARY KEY ("agressorId","vitimaId")
);

-- CreateTable
CREATE TABLE "Agressor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "relacionamento_vitima" TEXT,
    "cpf" TEXT,
    "dataNascimento" TEXT,
    "email" TEXT,
    "telefone" VARCHAR(15),
    "genero" TEXT,
    "estadoCivil" TEXT,
    "profissao" TEXT,
    "escolaridade" TEXT,
    "endereco" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "etnia" TEXT,
    "caracteristicas_fisicas" TEXT,

    CONSTRAINT "Agressor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacao_botao" (
    "id" SERIAL NOT NULL,
    "endereco" TEXT NOT NULL,
    "data" DATE NOT NULL,
    "token" TEXT,
    "vitimaId" INTEGER,

    CONSTRAINT "Notificacao_botao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vitima_cpf_key" ON "Vitima"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Vitima_email_key" ON "Vitima"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agressor_cpf_key" ON "Agressor"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Agressor_email_key" ON "Agressor"("email");

-- AddForeignKey
ALTER TABLE "OcorrenciasProfissionais" ADD CONSTRAINT "OcorrenciasProfissionais_ocorrenciaId_fkey" FOREIGN KEY ("ocorrenciaId") REFERENCES "Ocorrencias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OcorrenciasProfissionais" ADD CONSTRAINT "OcorrenciasProfissionais_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profissionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ocorrencias" ADD CONSTRAINT "Ocorrencias_vitimaId_fkey" FOREIGN KEY ("vitimaId") REFERENCES "Vitima"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relacao_agressor_vitima" ADD CONSTRAINT "relacao_agressor_vitima_agressorId_fkey" FOREIGN KEY ("agressorId") REFERENCES "Agressor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relacao_agressor_vitima" ADD CONSTRAINT "relacao_agressor_vitima_vitimaId_fkey" FOREIGN KEY ("vitimaId") REFERENCES "Vitima"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_vitimaId_fkey" FOREIGN KEY ("vitimaId") REFERENCES "Vitima"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao_botao" ADD CONSTRAINT "Notificacao_botao_vitimaId_fkey" FOREIGN KEY ("vitimaId") REFERENCES "Vitima"("id") ON DELETE SET NULL ON UPDATE CASCADE;
