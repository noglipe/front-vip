"use client";

import { SelectVip } from "@/components/form/selectVip";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Input } from "@/components/UI/input";
import { TIPO_ARQUIVO_QUERY } from "@/graphql/query";
import { converterImagemParaPdf } from "@/lib/conversorImagemPdf";
import { File, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface SelectArquivoProps {
  setListaArquivos: Dispatch<SetStateAction<ArquivoApi[]>>;
  listaArquivos: ArquivoApi[];
}

export default function SelectArquivo({
  setListaArquivos,
  listaArquivos,
}: SelectArquivoProps) {
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(
    null
  );
  const [tipoSelecionado, setTipoSelecionado] = useState<any>(null);
  const [listaFiltro, SetListaFiltro] = useState<ArquivoApi[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    SetListaFiltro(listaArquivos);
  }, [listaArquivos]);

  const adicionarArquivo = () => {
    if (!arquivoSelecionado || !tipoSelecionado) {
      alert("Selecione um arquivo e um tipo.");
      return;
    }

    setListaArquivos((prev) => [
      ...prev,
      { arquivo: arquivoSelecionado, tipo: tipoSelecionado },
    ]);

    setArquivoSelecionado(null);
    setTipoSelecionado(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removerArquivo = (index: number) => {
    setListaArquivos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleArquivoSelecionado = async (file: File) => {
    if (file.type.startsWith("image/")) {
      // Se for imagem, converte para PDF
      const pdfBlob = await converterImagemParaPdf(file);
      const pdfFile = new window.File(
        [pdfBlob],
        file.name.replace(/\.\w+$/, ".pdf"),
        { type: "application/pdf" }
      );

      setArquivoSelecionado(pdfFile);
    } else {
      // Qualquer outro tipo, mantém como está
      setArquivoSelecionado(file);
    }
  };

  return (
    <Card className="flex flex-col gap-4 border border-white rounded-sm mt-4 mb-4 w-full">
      <CardHeader>
        <CardTitle>
          <h4 className="flex items-center gap-2">
            <File /> ADICIONAR ARQUIVO{" "}
            {tipoSelecionado?.nome && `- ${tipoSelecionado.nome}`}
          </h4>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col sm:flex-row gap-2">
        <Input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleArquivoSelecionado(file);
          }}
          accept=".pdf,image/*"
        />

        <SelectVip
          setFunc={setTipoSelecionado}
          value={tipoSelecionado}
          query={TIPO_ARQUIVO_QUERY}
          dataKey="tipoArquivo"
          titulo="Tipo de Arquivo"
          className="sm:w-44 w-full"
        />

        <Button
          type="button"
          onClick={adicionarArquivo}
          className="bg-green-600 text-white px-4 rounded"
        >
          Adicionar Arquivo
        </Button>
      </CardContent>

      {listaArquivos.length > 0 && (
        <Card className="mt-6 space-y-1">
          <CardHeader>
            <CardTitle>
              <h4 className="font-semibold">ARQUIVOS ADICIONADOS</h4>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {listaArquivos.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded-lg p-4 w-full gap-4"
              >
                <div className="flex items-center gap-2 justify-between w-full">
                  <div className="flex flex-row items-center gap-2">
                    <File size={24} />
                    <div className="flex flex-col">
                      <a
                        href={URL.createObjectURL(item.arquivo)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" hover:text-blue-400 font-medium"
                      >
                        Arquivo {index + 1}
                      </a>
                      <span className="text-sm text-gray-500">
                        ({item.tipo.nome})
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => removerArquivo(index)}
                    className="
                  text-red-600 hover:text-white hover:bg-red-700 w-8 h-8 p-0 
                  flex items-center justify-center rounded
                  "
                    variant="ghost"
                  >
                    <X size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </Card>
  );
}
