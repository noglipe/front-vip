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
      fornecedor {
        nome
      }
      categoria {
        nome
      }
    }
  }
`;
