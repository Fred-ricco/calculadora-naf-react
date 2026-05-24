-- CreateTable
CREATE TABLE "HistoricoCalculo" (
    "id" TEXT NOT NULL,
    "profissao" TEXT NOT NULL,
    "renda" DOUBLE PRECISION NOT NULL,
    "custos" DOUBLE PRECISION NOT NULL,
    "resultadoPF" JSONB NOT NULL,
    "resultadoPJ" JSONB NOT NULL,
    "economia" DOUBLE PRECISION NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoCalculo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HistoricoCalculo" ADD CONSTRAINT "HistoricoCalculo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
