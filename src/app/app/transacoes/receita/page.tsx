"use client";

import { useState } from "react";
import { DatePickerForm } from "../../../../components/form/datePickerForm";
import { Input } from "@/components/UI/input";
import { SelectBase } from "@/components/form/selectBase";
import { SelectBaseBusca } from "@/components/form/selectBaseBusca";
import {
  CATEGORIAS_FORM_QUERY,
  INSTITUICAO_FINANCEIRA_FORM_QUERY,
  MEIO_TRANSACAO_FORM_QUERY,
} from "@/graphql/query";
import { Checkbox } from "@/components/UI/checkbox";
import { FORNECEDORES_QUERY } from "@/graphql/fornecedores-query";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";

export default function CadastroReceitaPage() {
  const [instituicaiFinanceira, setInstituicaiFinanceira] = useState<
    string | null
  >(null);
  const [categoria, setCategoria] = useState<string | null>(null);
  const [meioTransacao, setMeioTransacao] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [concluida, setConcluida] = useState(true);
  const [fornecedores, setFornecedores] = useState("");
  const [descricao, setDescricao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [valor, setValor] = useState(0);

  const cadastrarReceita = async () => {
    const receitaInput: ReceitaInput = {
      data: date ? date.toISOString() : null,
      valor: valor,
      categoria: categoria,
      meioTransacao: meioTransacao,
      instituicaoFinanceira: instituicaiFinanceira,
      transacaoConcluida: concluida,
      descricao: descricao,
      observacao: observacao,
      fornecedor: fornecedores,
      receita: true,
    };
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Cadastro de Receita 
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DatePickerForm setFunc={setDate} className="w-full" />
        <div className="flex items-center gap-2">
          <Label htmlFor="valor">R$</Label>
          <Input
            id="valor"
            type="number"
            placeholder="Valor"
            className="w-full"
            onChange={(e)=>(setValor(parseFloat(e.target.value)))}
          />
        </div>
        <SelectBase
          setFunc={setMeioTransacao}
          query={MEIO_TRANSACAO_FORM_QUERY}
          dataKey="meiosDeTransacao"
          minutos={60}
          titulo="Meios de Transações"
          className="w-full"
        />
        <SelectBase
          setFunc={setInstituicaiFinanceira}
          query={INSTITUICAO_FINANCEIRA_FORM_QUERY}
          dataKey="instituicoesFinanceiras"
          minutos={60}
          titulo="Instituições Financeiras"
          className="w-full"
        />
        <SelectBaseBusca
          setFunc={setCategoria}
          query={CATEGORIAS_FORM_QUERY}
          dataKey="categorias"
          minutos={1}
          titulo="Categorias"
          className="w-full"
        />
        <SelectBaseBusca
          setFunc={setFornecedores}
          query={FORNECEDORES_QUERY}
          dataKey="fornecedores"
          minutos={1}
          titulo="Fornecedores"
          className="w-full"
        />
        <div className="flex items-center gap-2">
          <Checkbox
            className="sm:h-full h-10 w-10"
            id="terms"
            checked={concluida}
            onCheckedChange={() => setConcluida(!concluida)}
          />
          <Label htmlFor="terms">Transação Concluída</Label>
        </div>
        <Input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição"
          className="w-full"
        />
        <Input
          type="text"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Observação"
          className="w-full"
        />
      </div>
      <div className="flex justify-center gap-4 mt-12">
        <Button>Cadastrar</Button>
        <Button variant="outline">Cadastrar e Novo Cadastro</Button>
      </div>
    </div>
  );
}
