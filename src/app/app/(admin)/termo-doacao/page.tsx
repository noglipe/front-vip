"use client";

import { useState } from "react";

import { ENDERECO_IGREJA, NOME_IGREJA, LOCAL_IGREJA } from "@/lib/constantes";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { Label } from "@/components/UI/label";
import { formatData, numeroExtenso } from "@/lib/utils";

export default function TermoDoacaoPage() {
  const [nomeDoador, setNomeDoador] = useState("");
  const [documentoDoador, setDocumentoDoador] = useState("");
  const [enderecoDoador, setEnderecoDoador] = useState("");
  const [telefoneDoador, setTelefoneDoador] = useState("");

  const [emailDoador, setEmailDoador] = useState("");
  const [descricaoDoacao, setDescricaoDoacao] = useState("");
  const [valorDoacao, setValorDoacao] = useState(0);
  const [valorPorExtenso, setValorPorExtenso] = useState("");
  const [dataDoacao, setDataDoacao] = useState("");
  const [condicoesEspecificas, setCondicoesEspecificas] = useState("");

  const imprimirTermo = () => {
    window.print();
  };

  return (
    <div className="min-h-screen p-6 print:text-black print:bg-white print:p-0">
      <div className=" rounded-lg shadow-lg p-8 max-w-2xl mx-auto print:min-w-screen print:w-full print:mx-0 print:shadow-none print:border">
        {/* Título */}
        <h1 className="text-2xl font-bold text-center mb-4 print:text-xl">
          TERMO DE DOAÇÃO
        </h1>

        {/* Dados da Igreja */}
        <div className="text-center text-sm mb-4 print:text-xs">
          <h3 className="font-semibold">{NOME_IGREJA}</h3>

          <ENDERECO_IGREJA />
        </div>

        <hr className="my-4 border-gray-300 print:border-gray-200" />

        {/* Dados do Doador (Formulário para preenchimento - oculto na impressão) */}
        <div className="mb-4 print:hidden">
          <h2 className="text-lg font-semibold mb-2">Dados do Doador</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="nomeDoador"
                className="block  text-sm font-bold mb-2"
              >
                Nome Completo:
              </Label>
              <Input
                type="text"
                id="nomeDoador"
                name="nomeDoador"
                value={nomeDoador}
                onChange={(e) => {
                  setNomeDoador(e.target.value);
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <Label
                htmlFor="documentoDoador"
                className="block  text-sm font-bold mb-2"
              >
                CPF/CNPJ:
              </Label>
              <Input
                type="text"
                id="documentoDoador"
                name="documentoDoador"
                value={documentoDoador}
                onChange={(e) => {
                  setDocumentoDoador(e.target.value);
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <Label
                htmlFor="enderecoDoador"
                className="block  text-sm font-bold mb-2"
              >
                Endereço Completo:
              </Label>
              <Input
                type="text"
                id="enderecoDoador"
                name="enderecoDoador"
                value={enderecoDoador}
                onChange={(e) => {
                  setEnderecoDoador(e.target.value);
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <Label
                htmlFor="telefoneDoador"
                className="block  text-sm font-bold mb-2"
              >
                Telefone:
              </Label>

              <Input
                type="tel"
                id="telefoneDoador"
                name="telefoneDoador"
                value={telefoneDoador}
                onChange={(e) => {
                  setTelefoneDoador(e.target.value);
                }}
                className="telefone shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <Label
                htmlFor="emailDoador"
                className="block  text-sm font-bold mb-2"
              >
                E-mail:
              </Label>
              <Input
                type="email"
                id="emailDoador"
                name="emailDoador"
                value={emailDoador}
                onChange={(e) => {
                  setEmailDoador(e.target.value);
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
        </div>

        {/* Objeto da Doação (Formulário para preenchimento - oculto na impressão) */}
        <div className="mb-4 print:hidden">
          <h2 className="text-lg font-semibold mb-2">Objeto da Doação</h2>
          <div>
            <Label
              htmlFor="descricaoDoacao"
              className="block  text-sm font-bold mb-2"
            >
              Descrição Detalhada do Bem Doado:
            </Label>
            <Textarea
              id="descricaoDoacao"
              name="descricaoDoacao"
              value={descricaoDoacao}
              onChange={(e) => {
                setDescricaoDoacao(e.target.value);
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label
                htmlFor="valorDoacao"
                className="block  text-sm font-bold mb-2"
              >
                Valor Estimado da Doação (R$):
              </Label>
              <Input
                type="number"
                id="valorDoacao"
                name="valorDoacao"
                value={valorDoacao}
                onChange={(e) => {
                  setValorDoacao(parseFloat(e.target.value));
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <Label
                htmlFor="dataDoacao"
                className="block  text-sm font-bold mb-2"
              >
                Data da Doação:
              </Label>
              <Input
                type="date"
                id="dataDoacao"
                name="dataDoacao"
                placeholder="dd/mm/aaaa"
                value={dataDoacao}
                onChange={(e) => {
                  setDataDoacao(e.target.value);
                }}
                className="flex shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div className="mt-2">
            <Label
              htmlFor="condicoesEspecificas"
              className="block  text-sm font-bold mb-2"
            >
              Condições Específicas da Doação (se houver):
            </Label>
            <textarea
              id="condicoesEspecificas"
              name="condicoesEspecificas"
              value={condicoesEspecificas}
              onChange={(e) => {
                setCondicoesEspecificas(e.target.value);
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <hr className="my-4 print:border-gray-200" />

        {/* Termo de Doação (Visível na impressão) */}
        <div className="print:block">
          <h2 className="text-lg font-semibold mb-2 print:text-base">
            Dados do Doador:
          </h2>
          <p className="text-sm print:text-xs">
            <strong>Nome Completo:</strong> {nomeDoador}
          </p>
          <p className="text-sm print:text-xs">
            <strong>CPF/CNPJ:</strong> {documentoDoador}
          </p>
          <p className="text-sm print:text-xs">
            <strong>Endereço Completo:</strong> {enderecoDoador}
          </p>
          <p className="text-sm print:text-xs">
            <strong>Telefone:</strong> {telefoneDoador}
          </p>
          <p className="text-sm print:text-xs">
            <strong>E-mail:</strong> {emailDoador}
          </p>

          <h2 className="text-lg font-semibold mt-4 mb-2 print:text-base">
            Objeto da Doação:
          </h2>
          <p className="text-sm print:text-xs">
            <strong>Descrição Detalhada do Bem Doado:</strong> {descricaoDoacao}
          </p>
          {valorDoacao !== null && (
            <>
              <p className="text-sm print:text-xs">
                <strong>Valor Estimado da Doação:</strong>{" "}
                {valorDoacao.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
              <p className="text-sm print:text-xs">
                <strong>Valor por Extenso:</strong>{" "}
                <span className="capitalize">
                  {valorPorExtenso}
                  {valorDoacao && numeroExtenso(valorDoacao)}
                </span>
              </p>
            </>
          )}
          <p className="text-sm print:text-xs">
            <strong>Data da Doação:</strong> {formatData(dataDoacao, true)}
          </p>
          {condicoesEspecificas && (
            <p className="text-sm print:text-xs">
              <strong>Condições Específicas da Doação:</strong>{" "}
              {condicoesEspecificas}
            </p>
          )}

          <h2 className="text-lg font-semibold mt-4 mb-2 print:text-base">
            Declarações:
          </h2>
          <p className="text-sm print:text-xs">
            O(A) DOADOR(A) declara ser o legítimo proprietário(a) e possuidor(a)
            do bem ora doado, possuindo plena capacidade jurídica para realizar
            esta doação de forma livre e espontânea vontade, sem qualquer coação
            ou vício de consentimento, e que o bem está livre e desembaraçado de
            quaisquer ônus, dívidas, gravames ou restrições, salvo se
            expressamente declarado nas "Condições Específicas da Doação". Ao
            realizar esta doação, não está comprometendo sua subsistência ou de
            sua família.
          </p>
          <p className="text-sm mt-2 print:text-xs">
            A IGREJA BENEFICIÁRIA declara aceitar a presente doação em todos os
            seus termos e utilizará o bem doado de acordo com seus fins
            estatutários e, se houver condições específicas, em conformidade com
            as mesmas, fornecendo ao DOADOR(A), caso solicitado, um recibo
            comprobatório da doação para fins fiscais, observando a legislação
            vigente.
          </p>

          <h2 className="text-lg font-semibold mt-4 mb-2 print:text-base">
            Disposições Finais:
          </h2>
          <p className="text-sm print:text-xs">
            O presente Termo de Doação é regido pelas leis da República
            Federativa do Brasil. Fica eleito o foro da Comarca de [Cidade da
            Igreja], Estado de [Estado da Igreja], para dirimir quaisquer
            dúvidas ou litígios oriundos do presente termo, renunciando as
            partes a qualquer outro, por mais privilegiado que seja.
          </p>

          <div className="mt-8 print:mt-4 flex flex-col items-center">
            <div className="w-3/4 border-t-2  pt-4 text-center print:border-t print:border-gray-300">
              <p className="text-sm print:text-xs">
                _______________________________________________
              </p>
              <p className="text-sm font-bold print:text-xs">Doador(a)</p>
              <p className="text-sm print:text-xs">{nomeDoador}</p>
            </div>
            <div className="w-3/4 border-t-2  pt-4 mt-6 text-center print:border-t print:border-gray-300 print:mt-2">
              <p className="text-sm print:text-xs">
                _______________________________________________
              </p>
              <p className="text-sm font-bold print:text-xs">
                Representante Legal da Igreja
              </p>
              <p className="text-sm print:text-xs">{NOME_IGREJA}</p>
            </div>
            <div className="w-3/4 mt-6 print:mt-2 flex justify-between">
              <div className="w-1/2 border-t  pt-2 text-center print:border-t print:border-gray-300">
                <p className="text-sm print:text-xs">
                  _________________________
                </p>
                <p className="text-sm font-bold print:text-xs">Testemunha 1</p>
              </div>
              <div className="w-1/2 border-t  pt-2 text-center print:border-t print:border-gray-300">
                <p className="text-sm print:text-xs">
                  _________________________
                </p>
                <p className="text-sm font-bold print:text-xs">Testemunha 2</p>
              </div>
            </div>
            <p className="text-right text-sm mt-4 print:text-xs">
              [{LOCAL_IGREJA}], {formatData(dataDoacao, true)}
            </p>
          </div>
        </div>

        {/* Botões de ação (não aparecem na impressão) */}
        <div className="mt-6 flex justify-end space-x-4 print:hidden">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={imprimirTermo}
          >
            Imprimir Termo
          </button>
        </div>
      </div>
    </div>
  );
}
