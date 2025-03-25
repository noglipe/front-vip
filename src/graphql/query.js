// fornecedores-query.js

import { gql } from "@apollo/client";

export const CAIXAS_FORM_QUERY = gql`
  query Caixas {
    caixas {
      id
      nome
    }
  }
`;

export const CARTOES_FORM_QUERY = gql`
  query cartoesDeCredito {
    cartoesDeCredito {
      id
      nome
    }
  }
`;

export const CATEGORIAS_FORM_QUERY = gql`
  query Categorias {
    categorias {
      id
      nome
    }
  }
`;

export const MEIO_TRANSACAO_FORM_QUERY = gql`
  query meiosDeTransacao {
    meiosDeTransacao {
      id
      nome
    }
  }
`;

export const INSTITUICAO_FINANCEIRA_FORM_QUERY = gql`
  query instituicoesFinanceiras {
    instituicoesFinanceiras {
      id
      nome
    }
  }
`;

export const RECEITA_LIST_QUERY = gql`
  query receitalista {
    receitas {
      data
      descricao
      valor
      transacaoConcluido
      fornecedor {
        nome
      }
      categoria {
        nome
      }
    }
  }
`;

export const DESPESA_LIST_QUERY = gql`
  query despesalista {
    despesas {
      data
      descricao
      valor
      transacaoConcluido
      fornecedor {
        nome
      }
      categoria {
        nome
      }
    }
  }
`;

export const APP_QUERY = gql`
  query app {
    caixas {
      nome
      id
      saldo
    }
    instituicoesFinanceiras {
      id
      nome
      saldo
    }
  }
`;

export const N_CONCLIDAS_QUERY = gql`
  query nConcluidas {
    nConcluidas {
      id
      data
      descricao
      valor
      categoria {
        nome
      }
    }
  }
`;

export const CARTAO_MES_QUERY = gql`
  query comprasCartaoMes {
    comprasCartaoMes {
      id
      descricao
      data
      valor
      cartaoUtilizado {
        nome
        id
      }
      categoria {
        nome
        id
      }
    }
  }
`;

export const TRANSACOES_MES_QUERY = gql`
  query transacoesMes {
    transacoesMes {
      totalDespesas
      totalReceitas
      transacoes {
        receita
        transacaoConcluido
        data
        descricao
        valor
        categoria {
          id
          nome
        }
        meioDeTransacao {
          id
          nome
        }
        instituicaoFinanceira {
          id
          nome
        }
      }
    }
  }
`;
