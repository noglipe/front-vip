// fornecedores-query.js

import { gql } from "@apollo/client";

const FORNECEDORES_QUERY = gql`
  query Fornecedores {
    fornecedores {
      id
      nome
      documento
    }
  }
`;

export default FORNECEDORES_QUERY;