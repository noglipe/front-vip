"use client";

import { useState } from "react";

export default function FormularioCompra() {
  const [parcelada, setParcelada] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-xl font-bold mb-4">Formulário de Compra</h1>
      <form className="space-y-4">
        {/* Data da entrada */}
        <div>
          <label className="block font-medium">Data da Entrada:</label>
          <input
            type="date"
            className="w-full border border-gray-300 p-2 rounded"
            name="data"
          />
        </div>

        {/* Tipo de compra */}
        <div>
          <label className="block font-medium">Tipo de Compra:</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            name="tipo"
          >
            <option value="">---------</option>
            <option value="produto">Produto</option>
            <option value="servico">Serviço</option>
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label className="block font-medium">Categoria:</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            name="categoria"
          >
            <option value="">---------</option>
            <option value="alimento">Alimento</option>
            <option value="equipamento">Equipamento</option>
            {/* Adicione outras categorias aqui */}
          </select>
        </div>

        {/* Descrição */}
        <div>
          <label className="block font-medium">Descrição:</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            name="descricao"
          />
        </div>

        {/* Autorizada por */}
        <div>
          <label className="block font-medium">Autorizada por:</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            name="autorizada_por"
          />
        </div>

        {/* Meio de pagamento */}
        <div>
          <label className="block font-medium">Meio de Pagamento:</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            name="meio_pagamento"
          >
            <option value="">---------</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="pix">Pix</option>
            <option value="cartao">Cartão</option>
          </select>
        </div>

        {/* Cartão utilizado */}
        <div>
          <label className="block font-medium">Cartão Utilizado:</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            name="cartao_utilizado"
          >
            <option value="">---------</option>
            <option value="visa">Visa</option>
            <option value="master">Mastercard</option>
            {/* Adicione outros cartões */}
          </select>
        </div>

        {/* Compra parcelada */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="parcelada"
            checked={parcelada}
            onChange={() => setParcelada(!parcelada)}
          />
          <label htmlFor="parcelada">Compra parcelada?</label>
        </div>

        {/* Valor */}
        <div>
          <label className="block font-medium">Valor:</label>
          <input
            type="number"
            step="0.01"
            className="w-full border border-gray-300 p-2 rounded"
            name="valor"
          />
        </div>

        {/* Valor da parcela */}
        {parcelada && (
          <>
            <div>
              <label className="block font-medium">Valor da Parcela:</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 p-2 rounded"
                name="valor_parcela"
                defaultValue={0}
              />
            </div>

            <div>
              <label className="block font-medium">
                Quantidade de Parcelas:
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 p-2 rounded"
                name="qtd_parcelas"
              />
            </div>
          </>
        )}

        {/* Frete */}
        <div>
          <label className="block font-medium">
            Valor Frete (caso se aplique):
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full border border-gray-300 p-2 rounded"
            name="frete"
          />
        </div>

        {/* Observação */}
        <div>
          <label className="block font-medium">Observação:</label>
          <textarea
            className="w-full border border-gray-300 p-2 rounded"
            name="observacao"
            rows={3}
          />
        </div>

        {/* Nota fiscal */}
        <div>
          <label className="block font-medium">Nota Fiscal:</label>
          <input
            type="file"
            className="w-full border border-gray-300 p-2 rounded"
            name="nota_fiscal"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
