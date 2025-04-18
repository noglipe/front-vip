"use client";

import { SelectVip } from "@/components/form/selectVip";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { TIPO_ARQUIVO_QUERY } from "@/graphql/query";
import { converterImagemParaPdf } from "@/lib/conversorImagemPdf";
import { uploadParaS3 } from "@/lib/s3Config";
import { File, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

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
  };

  const enviarArquivos = async () => {
    const resultados = [];

    console.log("Teste de Envio");

    for (const item of listaArquivos) {
      const { caminho, nome } = await uploadParaS3(item.arquivo);
      resultados.push({ caminho, nome, tipoId: item.tipo.id });
    }

    console.log("Arquivos enviados:", resultados);
    // Aqui você pode fazer um POST para sua API e salvar no banco
  };

  function enviar() {
    listaArquivos.forEach((item, index) => {
      enviarArquivoParaBackend(item.arquivo, item.tipo, index);
    });
  }

  const enviarArquivoParaBackend = async (
    arquivo: File,
    tipo: any,
    index: number
  ) => {
    const formData = new FormData();
    formData.append("file", arquivo);

    try {
      const response = await fetch(
        "http://localhost:8000/financeiro/arquivo/upload/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Arquivo enviado com sucesso", data);

        // Atualiza a lista com os dados do back
        setListaArquivos((prev) => {
          const atualizada = [...prev];
          atualizada[index] = {
            ...atualizada[index],
            caminho: data.caminho,
            nome: data.nome,
          };
          return atualizada;
        });
      } else {
        console.error("Erro ao enviar arquivo", data);
      }
    } catch (error) {
      console.error("Erro de conexão", error);
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
    <div className="flex flex-col gap-4 mt-4 border border-white rounded-xl p-8">
      <h4 className="flex items-center gap-2">
        <File /> Adicionar Arquivo{" "}
        {tipoSelecionado?.nome && `- ${tipoSelecionado.nome}`}
      </h4>

      <div className="flex flex-row gap-2">
        <Input
          type="file"
          placeholder="Selecionar Arquivo"
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
          className="w-44"
        />

        <Button
          onClick={adicionarArquivo}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Adicionar Arquivo
        </Button>
        <Button onClick={enviar}>Teste</Button>
      </div>

      {listaArquivos.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-lg font-semibold">Arquivos Adicionados</h3>
          <div className="flex flex-col gap-2">
            {listaArquivos.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border p-2 rounded hover:bg-gray-700"
              >
                <div className="flex items-center gap-2">
                  <File size={16} />
                  <a
                    href={URL.createObjectURL(item.arquivo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-200"
                  >
                    {item.arquivo.name}
                  </a>
                  <span className="text-sm text-gray-400">
                    ({item.tipo.nome})
                  </span>
                </div>
                <Button
                  onClick={() => removerArquivo(index)}
                  className="text-red-500 hover:text-white hover:bg-red-800"
                >
                  <X size={18} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
