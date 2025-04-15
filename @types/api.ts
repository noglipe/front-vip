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
  numero_de_parcelas: number,
  parcela_atual: number,
  meio_de_transacao: number,
  cartao_utilizado: number,
  instituicao_financeira: number,
  descricao: string,
  fornecedor: number,
  observacao: string,
  situacao_fiscal: boolean,
  compra_parcelada: boolean,
  transacao_concluido: boolean,
  receita: boolean;
}

interface TransacoesProps {
  id: number;
  data: string;
  receita: boolean;
  transacaoConcluido: boolean | null;
  descricao: string;
  valor: number;
  categoria: {
    id: number;
    nome: string;
  };
  meio_de_transacao: {
    id: number;
    nome: string;
  };
  instituicao_financeira: {
    id: number;
    nome: string;
  };
}

interface TabelaTransacoesProps {
  dados: TransacoesProps[];
}

interface TransacoesData {
  total_despesas: number;
  total_receitas: number;
  transacao: TransacoesProps[];
}

interface TransacoesPropsApi {
  total_despesas: number,
  total_receitas: number,
  transacao: {
    id: number,
    data: string,
    categoria: {
      id: number,
      nome: string
    },
    descricao: string,
    fornecedor: {
      id: number,
      nome: string
    },
    instituicao_financeira: {
      id: number,
      nome: string
    },
    meio_de_transacao: {
      id: number,
      nome: string
    },
    numero_de_parcelas: number,
    observacao: string,
    parcela_atual: number,
    rastreioParcelas: number,
    receita: boolean,
    situacaoFiscal: boolean | null,
    transacaoConcluido: boolean | null,
    valor: number,
    excluida: boolean
  }[]
}