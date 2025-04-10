interface SelectApi {
  id: string;
  nome: string;
}

interface ReceitaInput {
  data: string;
  valor: number;
  categoria: string;
  meio_de_transacao: string;
  instituicao_financeira: string;
  transacao_concluido: boolean;
  descricao: string;
  observacao: string | null;
  fornecedor: string | null;
  receita: boolean;
}

interface DespesaInput {
  data: string,
  data_compra: string,
  valor: number,
  categoria: number,
  numero_de_parcelas : number,
  parcela_atual: number,
  meio_de_transacao: number,
  cartao_utilizado: number,
  instituicao_financeira: number,
  descricao: string,
  fornecedor: number,
  observacao:string,
  situacao_fiscal :boolean,
  compra_parcelada : boolean,
  transacao_concluido: boolean,
  receita: boolean;
}