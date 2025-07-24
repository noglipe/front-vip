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
  meio_de_transacao: string,
  cartao_utilizado: string,
  instituicao_financeira: string,
  descricao: string,
  fornecedor: string,
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
  cartao_utilizado: {
    id: number,
    nome: string
  }
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

interface TransacoesAPI {
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
  cartao_utilizado?: {
    id: number,
    bandeira_do_cartao: string,
    ultimos_numeros: string
  }
  numero_de_parcelas: number,
  observacao: string,
  parcela_atual: number,
  rastreioParcelas: number,
  receita: boolean,
  situacao_fiscal: boolean | null,
  transacao_concluido: boolean,
  valor: number,
  excluida: boolean
}

interface TransacoesListAPi {
  dados: TransacoesAPI[]
}

interface TransacoesPropsApi {
  total_despesas: number,
  total_receitas: number,
  transacao: TransacoesAPI[]
}

interface CardSaldosProps {
  nome: string;
  id: string;
  saldo: number;
}

type TipoArquivoApi = {
  id: number;
  nome: string;
};

type ArquivoApi = {
  arquivo: File;
  tipo: TipoArquivoApi;
  caminho?: string;
  nome?: string;
};