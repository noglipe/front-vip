interface SelectApi {
  id: string;
  nome: string;
}

interface ReceitaInput {
  data: string ;
  valor: number ;
  categoria: string ;
  meio_de_transacao: string ;
  instituicao_financeira: string ;
  transacaoConcluida: boolean;
  descricao: string;
  observacao: string | null;
  fornecedor: string | null;
  receita: boolean;
}