"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Importe a função para converter número por extenso (assumindo que você tenha uma)
import { numeroParaTexto } from "@/lib/utils"; // Ajuste o caminho conforme necessário
import { ENDERECO_IGREJA, NOME_IGREJA, CNPJ_IGREJA } from "@/lib/constantes"; // Ajuste o caminho conforme necessário

type FormData = {
  nomeDoador: string;
  documentoDoador: string;
  enderecoDoador: string;
  telefoneDoador: string;
  emailDoador: string;
  descricaoDoacao: string;
  valorDoacao: number | null;
  valorPorExtenso: string;
  dataDoacao: Date | null;
  condicoesEspecificas: string;
};

export default function TermoDoacaoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nomeDoador: "",
    documentoDoador: "",
    enderecoDoador: "",
    telefoneDoador: "",
    emailDoador: "",
    descricaoDoacao: "",
    valorDoacao: null,
    valorPorExtenso: "",
    dataDoacao: new Date(),
    condicoesEspecificas: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const valor = value ? parseFloat(value.replace(",", ".")) : null;
    setFormData({
      ...formData,
      [name]: valor,
      valorPorExtenso: valor ? numeroParaTexto(valor, { currency: true }) : "",
    });
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const [dia, mes, ano] = value.split("/");
    const data = new Date(`${ano}-${mes}-${dia}`);
    setFormData({ ...formData, dataDoacao: isNaN(data.getTime()) ? null : data });
  };

  const imprimirTermo = () => {
    window.print();
  };

  const formatarData = (date: Date | null): string => {
    if (!date) return "";
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 print:bg-white print:p-0">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto print:max-w-full print:mx-0 print:shadow-none print:border">
        {/* Título */}
        <h1 className="text-2xl font-bold text-center mb-4 print:text-xl">TERMO DE DOAÇÃO</h1>

        {/* Dados da Igreja */}
        <div className="text-center text-sm mb-4 print:text-xs">
          <h3 className="font-semibold">{NOME_IGREJA}</h3>
          <p>CNPJ: {CNPJ_IGREJA}</p>
          <p><ENDERECO_IGREJA /></p>
        </div>

        <hr className="my-4 border-gray-300 print:border-gray-200" />

        {/* Dados do Doador (Formulário para preenchimento - oculto na impressão) */}
        <div className="mb-4 print:hidden">
          <h2 className="text-lg font-semibold mb-2">Dados do Doador</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nomeDoador" className="block text-gray-700 text-sm font-bold mb-2">Nome Completo:</label>
              <input type="text" id="nomeDoador" name="nomeDoador" value={formData.nomeDoador} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
              <label htmlFor="documentoDoador" className="block text-gray-700 text-sm font-bold mb-2">CPF/CNPJ:</label>
              <input type="text" id="documentoDoador" name="documentoDoador" value={formData.documentoDoador} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
              <label htmlFor="enderecoDoador" className="block text-gray-700 text-sm font-bold mb-2">Endereço Completo:</label>
              <input type="text" id="enderecoDoador" name="enderecoDoador" value={formData.enderecoDoador} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
              <label htmlFor="telefoneDoador" className="block text-gray-700 text-sm font-bold mb-2">Telefone:</label>
              <input type="text" id="telefoneDoador" name="telefoneDoador" value={formData.telefoneDoador} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="emailDoador" className="block text-gray-700 text-sm font-bold mb-2">E-mail:</label>
              <input type="email" id="emailDoador" name="emailDoador" value={formData.emailDoador} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
          </div>
        </div>

        {/* Objeto da Doação (Formulário para preenchimento - oculto na impressão) */}
        <div className="mb-4 print:hidden">
          <h2 className="text-lg font-semibold mb-2">Objeto da Doação</h2>
          <div>
            <label htmlFor="descricaoDoacao" className="block text-gray-700 text-sm font-bold mb-2">Descrição Detalhada do Bem Doado:</label>
            <textarea id="descricaoDoacao" name="descricaoDoacao" value={formData.descricaoDoacao} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label htmlFor="valorDoacao" className="block text-gray-700 text-sm font-bold mb-2">Valor Estimado da Doação (R$):</label>
              <input type="text" id="valorDoacao" name="valorDoacao" value={formData.valorDoacao !== null ? formData.valorDoacao.toString().replace(".", ",") : ""} onChange={handleValorChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
              <label htmlFor="dataDoacao" className="block text-gray-700 text-sm font-bold mb-2">Data da Doação:</label>
              <input type="text" id="dataDoacao" name="dataDoacao" placeholder="dd/mm/aaaa" value={formData.dataDoacao ? format(formData.dataDoacao, "dd/MM/yyyy") : ""} onChange={handleDataChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
          </div>
          <div className="mt-2">
            <label htmlFor="condicoesEspecificas" className="block text-gray-700 text-sm font-bold mb-2">Condições Específicas da Doação (se houver):</label>
            <textarea id="condicoesEspecificas" name="condicoesEspecificas" value={formData.condicoesEspecificas} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
        </div>

        <hr className="my-4 border-gray-300 print:border-gray-200" />

        {/* Termo de Doação (Visível na impressão) */}
        <div className="print:block">
          <h2 className="text-lg font-semibold mb-2 print:text-base">Dados do Doador:</h2>
          <p className="text-sm print:text-xs"><strong>Nome Completo:</strong> {formData.nomeDoador}</p>
          <p className="text-sm print:text-xs"><strong>CPF/CNPJ:</strong> {formData.documentoDoador}</p>
          <p className="text-sm print:text-xs"><strong>Endereço Completo:</strong> {formData.enderecoDoador}</p>
          <p className="text-sm print:text-xs"><strong>Telefone:</strong> {formData.telefoneDoador}</p>
          <p className="text-sm print:text-xs"><strong>E-mail:</strong> {formData.emailDoador}</p>

          <h2 className="text-lg font-semibold mt-4 mb-2 print:text-base">Objeto da Doação:</h2>
          <p className="text-sm print:text-xs"><strong>Descrição Detalhada do Bem Doado:</strong> {formData.descricaoDoacao}</p>
          {formData.valorDoacao !== null && (
            <>
              <p className="text-sm print:text-xs"><strong>Valor Estimado da Doação:</strong> {formData.valorDoacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <p className="text-sm print:text-xs"><strong>Valor por Extenso:</strong> <span className="capitalize">{formData.valorPorExtenso}</span></p>
            </>
          )}
          <p className="text-sm print:text-xs"><strong>Data da Doação:</strong> {formatarData(formData.dataDoacao)}</p>
          {formData.condicoesEspecificas && (
            <p className="text-sm print:text-xs"><strong>Condições Específicas da Doação:</strong> {formData.condicoesEspecificas}</p>
          )}

          <h2 className="text-lg font-semibold mt-4 mb-2 print:text-base">Declarações:</h2>
          <p className="text-sm print:text-xs">O(A) DOADOR(A) declara ser o legítimo proprietário(a) e possuidor(a) do bem ora doado, possuindo plena capacidade jurídica para realizar esta doação de forma livre e espontânea vontade, sem qualquer coação ou vício de consentimento, e que o bem está livre e desembaraçado de quaisquer ônus, dívidas, gravames ou restrições, salvo se expressamente declarado nas "Condições Específicas da Doação". Ao realizar esta doação, não está comprometendo sua subsistência ou de sua família.</p>
          <p className="text-sm mt-2 print:text-xs">A IGREJA BENEFICIÁRIA declara aceitar a presente doação em todos os seus termos e utilizará o bem doado de acordo com seus fins estatutários e, se houver condições específicas, em conformidade com as mesmas, fornecendo ao DOADOR(A), caso solicitado, um recibo comprobatório da doação para fins fiscais, observando a legislação vigente.</p>

          <h2 className="text-lg font-semibold mt-4 mb-2 print:text-base">Disposições Finais:</h2>
          <p className="text-sm print:text-xs">O presente Termo de Doação é regido pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de [Cidade da Igreja], Estado de [Estado da Igreja], para dirimir quaisquer dúvidas ou litígios oriundos do presente termo, renunciando as partes a qualquer outro, por mais privilegiado que seja.</p>

          <div className="mt-8 print:mt-4 flex flex-col items-center">
            <div className="w-3/4 border-t-2 border-gray-400 pt-4 text-center print:border-t print:border-gray-300">
              <p className="text-sm print:text-xs">_______________________________________________</p>
              <p className="text-sm font-bold print:text-xs">Doador(a)</p>
              <p className="text-sm print:text-xs">{formData.nomeDoador}</p>
            </div>
            <div className="w-3/4 border-t-2 border-gray-400 pt-4 mt-6 text-center print:border-t print:border-gray-300 print:mt-2">
              <p className="text-sm print:text-xs">_______________________________________________</p>
              <p className="text-sm font-bold print:text-xs">Representante Legal da Igreja</p>
              <p className="text-sm print:text-xs">{NOME_IGREJA}</p>
            </div>
            <div className="w-3/4 mt-6 print:mt-2 flex justify-between">
              <div className="w-1/2 border-t border-gray-400 pt-2 text-center print:border-t print:border-gray-300">
                <p className="text-sm print:text-xs">_________________________</p>
                <p className="text-sm font-bold print:text-xs">Testemunha 1</p>
              </div>
              <div className="w-1/2 border-t border-gray-400 pt-2 text-center print:border-t print:border-gray-300">
                <p className="text-sm print:text-xs">_________________________</p>
                <p className="text-sm font-bold print:text-xs">Testemunha 2</p>
              </div>
            </div>
            <p className="text-right text-sm mt-4 print:text-xs">
              [Local da Igreja], {formatarData(formData.dataDoacao)}
            </p>
          </div>
        </div>

        {/* Botões de ação (não aparecem na impressão) */}
        <div className="mt-6 flex justify-end space-x-4 print:hidden">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition" onClick={imprimirTermo}>
            Imprimir Termo
          </button>
        </div>
      </div>
    </div>
  );
}