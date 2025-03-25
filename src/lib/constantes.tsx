export const CALSS_INPUTS = "w-full bg-white text-black";
export const CLASS_SIDEBAR_HOVER ="hover:font-bold hover:m-2 hover:bg-gray-200 transition-all duration-500 ease-in-out " 
export const CLASS_SIDEBAR = "w-full cursor-pointer text-left p-4 " + CLASS_SIDEBAR_HOVER

export const NOME_IGREJA = "IGREJA BATISTA VIDA E PAZ";

export const ENDERECO_IGREJA = () => {
  return (
    <p className="text-center text-sm mt-2 leading-tight">
      R. Emidyo Ferreira Sacramento, 55 - Aribiri, CEP: 29.120-005 Vila Velha -
      ES <br />
      Telefone: (27) 3239-7498 | E-mail: ibvidaepaz@gmail.com <br />
      CNPJ: 03.429.824/0001-70 | I.E.: Isenta
    </p>
  );
};
