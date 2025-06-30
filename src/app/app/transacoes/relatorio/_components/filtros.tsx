import InputVip from "@/app/app/_components/inputVip";
import { DatePickerForm } from "@/components/form/datePickerForm";
import { SelectBase } from "@/components/form/selectBase";
import { Card, CardContent } from "@/components/UI/card";
import { Input } from "@/components/UI/tempInput";
import { MEIO_TRANSACAO_FORM_QUERY } from "@/graphql/query";
import { useState } from "react";

export default function FiltrosTransacoes() {
  const [dia, setDia] = useState();
  const [descricao, setDescricao] = useState<string>("");
  const [valor, setValor] = useState<string | null>();
  const [meio_de_transacao, setMeioTransacao] = useState<number | any>();
  return (
    <Card className="p-4">
      <CardContent className="grid grid-cols-3 gap-3">
        <DatePickerForm
          setFunc={setDia}
          date={dia}
          descricao={"Escolha o dia"}
        />
        <InputVip
          setValue={setDescricao}
          value={descricao}
          placeholder={"Descrição"}
        />
        <Input
          type={"number"}
          placeholder={"Valor"}
          onChange={(e) => setValor(e.target.value)}
        />
        <SelectBase
          setFunc={setMeioTransacao}
          query={MEIO_TRANSACAO_FORM_QUERY}
          dataKey="meiosDeTransacao"
          minutos={60}
          titulo="Meios de Transações"
          className=""
          value={meio_de_transacao}
        />
        EntreDatas descricao meio de transacao instituicao financeira categoria
        fornecedor cartao utilizado notafiscal transacao concluida
      </CardContent>
    </Card>
  );
}
