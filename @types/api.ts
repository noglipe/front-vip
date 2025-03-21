interface SelectApi {
  id: string;
  nome: string;
}

interface ReceitaInput {
  data: string | null;
  valor: number | null;
  categoria: string | null;
  meioTransacao: string | null;
  instituicaoFinanceira: string | null;
  transacaoConcluida: boolean;
  descricao: string;
  observacao: string;
  fornecedor: string;
  receita: boolean;
}