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