// fornecedores-query.js

import { gql } from "@apollo/client";

export const FORNECEDORES_QUERY = gql`
  query Fornecedores {
    fornecedores {
      id
      nome
      documento
    }
  }
`;

export const FORNECEDOR_QUERY = gql`
  query Fornecedor($id: Int!) {
    fornecedor(id: $id) {
      id
      nome
      documento
    }
  }
`;

export const FORNECEDOR_TRANSACOES_QUERY = gql`
  query TransacoesFornecedores($id: Int!) {
    transacoesFornecedores(id: $id) {
      data
      descricao
      valor
      receita
      id
      transacaoConcluido
    }
  }
`;

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
      id
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
      id
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
  query nConcluidas($limite: Int!, $page: Int) {
    nConcluidas(limite: $limite, page: $page) {
      hasNextPage
      hasPreviousPage
      totalPaginas
      paginaAtual
      transacoes {
        id
        data
        descricao
        valor
        categoria {
          nome
        }
      }
    }
  }
`;

export const CARTAO_MES_QUERY = gql`
  query comprasCartaoMes($limite: Int!, $page: Int) {
    comprasCartaoMes(limite: $limite, page: $page) {
      hasNextPage
      hasPreviousPage
      totalPaginas
      paginaAtual
      transacoes {
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
        id
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

export const DETALHES_TRANSACAO_QUERY = gql`
  query DetalhesTransacao($id: Int!) {
    transacao(id: $id) {
      id
      data
      dataCompra
      categoria {
        id
        nome
      }
      descricao
      fornecedor {
        id
        nome
      }
      cartaoUtilizado {
        id
        nome
      }
      instituicaoFinanceira {
        id
        nome
      }
      meioDeTransacao {
        id
        nome
      }
      numeroDeParcelas
      observacao
      parcelaAtual
      rastreioParcelas {
        id
        valorTotal
      }
      receita
      situacaoFiscal
      transacaoConcluido
      valor
      excluida
    }
  }
`;

export const TRANSACAO_RECEITA_QUERY = gql`
  query Transacao($id: Int!) {
    transacao(id: $id) {
      id
      data
      categoria {
        id
        nome
      }
      descricao
      fornecedor {
        id
        nome
      }
      instituicaoFinanceira {
        id
        nome
      }
      meioDeTransacao {
        id
        nome
      }
      observacao
      situacaoFiscal
      transacaoConcluido
      valor
      excluida
    }
  }
`;

export const TRANSACAO_DESPESA_QUERY = gql`
  query Transacao($id: Int!) {
    transacao(id: $id) {
      id
      data
      dataCompra
      compraParcelada
      categoria {
        id
        nome
      }
      descricao
      fornecedor {
        id
        nome
      }
      instituicaoFinanceira {
        id
        nome
      }
      meioDeTransacao {
        id
        nome
      }
      observacao
      situacaoFiscal
      transacaoConcluido
      valor
      excluida
      numeroDeParcelas
      parcelaAtual
      receita
    }
  }
`;

export const TRANSACAO_RELACIONADA_QUERY = gql`
  query DetalhesTransacao($id: Int!) {
    transacoesParceladas(id: $id) {
      id
      data
      valor
      parcelaAtual
      transacaoConcluido
      rastreioParcelas {
        valorTotal
      }
    }
  }
`;

export const RECIBO_QUERY = gql`
  query transacao($id: Int!) {
    transacao(id: $id) {
      id
      valor
      valorPorExtenso
      descricao
      data
      receita
      fornecedor {
        id
        nome
      }
      compraParcelada
      numeroDeParcelas
      parcelaAtual
      observacao
      rastreioParcelas {
        id
      }
    }
  }
`;
