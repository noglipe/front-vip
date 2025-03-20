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
