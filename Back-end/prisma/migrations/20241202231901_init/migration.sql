-- CreateTable
CREATE TABLE "Profissionais" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "permissaoId" INTEGER NOT NULL,
    "foto" VARCHAR(2048),
    "especialidade" TEXT NOT NULL,
    "processo" INTEGER,

    CONSTRAINT "Profissionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ocorrencias" (
    "id" SERIAL NOT NULL,
    "tipo_denuncia" TEXT NOT NULL,
    "tipo_violencia" TEXT NOT NULL,
    "agressor" TEXT NOT NULL,
    "provas" VARCHAR(2048)[],
    "descricao" TEXT NOT NULL,
    "local" TEXT,
    "data_denuncia" DATE,
    "data_ocorrencia" TEXT NOT NULL,

    CONSTRAINT "Ocorrencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Processo" (
    "id" SERIAL NOT NULL,
    "status" TEXT,
    "ocorrencia" INTEGER,
    "registro" INTEGER,
    "permissao" INTEGER NOT NULL,

    CONSTRAINT "Processo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registro" (
    "id" SERIAL NOT NULL,
    "anexos" VARCHAR(2048)[],
    "descricoes" TEXT,
    "data" TEXT,

    CONSTRAINT "Registro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissoes" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "Permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profissionais_email_key" ON "Profissionais"("email");

-- AddForeignKey
ALTER TABLE "Profissionais" ADD CONSTRAINT "Profissionais_permissaoId_fkey" FOREIGN KEY ("permissaoId") REFERENCES "Permissoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profissionais" ADD CONSTRAINT "Profissionais_processo_fkey" FOREIGN KEY ("processo") REFERENCES "Processo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_ocorrencia_fkey" FOREIGN KEY ("ocorrencia") REFERENCES "Ocorrencias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_registro_fkey" FOREIGN KEY ("registro") REFERENCES "Registro"("id") ON DELETE SET NULL ON UPDATE CASCADE;
