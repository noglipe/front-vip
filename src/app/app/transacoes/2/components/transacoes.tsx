"use client"

import type React from "react"

import { useState } from "react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ClockIcon,
  CreditCardIcon,
  DollarSignIcon,
  FileTextIcon,
  FilterIcon,
  PencilIcon,
  PrinterIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react"

import { Badge } from "@/components/UI/badge"
import { Button } from "@/components/UI/button"
import { Card, CardContent } from "@/components/UI/card"
import { Checkbox } from "@/components/UI/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog"
import { Input } from "@/components/UI/input"
import { Label } from "@/components/UI/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/UI/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/UI/table"
import { useToast } from "@/hooks/use-toast"

// Tipos de dados
type TransactionType = "receita" | "despesa"
type PaymentStatus = "concluida" | "pendente"

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
  boleto?: string
  type: string
  status: PaymentStatus
  transactionType: TransactionType
  paymentMethod: string
  bank?: string
  costCenter?: string
  supplier?: string
  cashRegister?: string
  taxStatus?: string
}

// Dados de exemplo
const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2023-04-01",
    description: "Pagamento de salário",
    category: "Salário",
    amount: 5000,
    type: "Transferência",
    status: "concluida",
    transactionType: "receita",
    paymentMethod: "Depósito bancário",
    bank: "Banco do Brasil",
    costCenter: "Administrativo",
    supplier: "N/A",
    cashRegister: "Principal",
    taxStatus: "Declarado",
  },
  {
    id: "2",
    date: "2023-04-05",
    description: "Aluguel",
    category: "Moradia",
    amount: 1200,
    boleto: "12345678901234567890123456789012345678901234",
    type: "Mensal",
    status: "concluida",
    transactionType: "despesa",
    paymentMethod: "Débito automático",
    bank: "Itaú",
    costCenter: "Operacional",
    supplier: "Imobiliária Central",
    cashRegister: "Principal",
    taxStatus: "Declarado",
  },
  {
    id: "3",
    date: "2023-04-10",
    description: "Supermercado",
    category: "Alimentação",
    amount: 350.75,
    type: "Variável",
    status: "concluida",
    transactionType: "despesa",
    paymentMethod: "Cartão de crédito",
    bank: "Nubank",
    costCenter: "Pessoal",
    supplier: "Supermercado Bom Preço",
    cashRegister: "Secundário",
    taxStatus: "Pendente",
  },
  {
    id: "4",
    date: "2023-04-15",
    description: "Freelance design",
    category: "Trabalho extra",
    amount: 1200,
    type: "Pontual",
    status: "concluida",
    transactionType: "receita",
    paymentMethod: "Transferência PIX",
    bank: "Banco Inter",
    costCenter: "Projetos",
    supplier: "Cliente XYZ",
    cashRegister: "Principal",
    taxStatus: "Não declarado",
  },
  {
    id: "5",
    date: "2023-04-20",
    description: "Conta de luz",
    category: "Utilidades",
    amount: 180.5,
    boleto: "98765432109876543210987654321098765432109876",
    type: "Mensal",
    status: "pendente",
    transactionType: "despesa",
    paymentMethod: "Boleto",
    bank: "Caixa",
    costCenter: "Operacional",
    supplier: "Companhia Elétrica",
    cashRegister: "Principal",
    taxStatus: "Pendente",
  },
  {
    id: "6",
    date: "2023-04-25",
    description: "Venda de produtos",
    category: "Vendas",
    amount: 750,
    type: "Variável",
    status: "pendente",
    transactionType: "receita",
    paymentMethod: "Dinheiro",
    bank: "N/A",
    costCenter: "Vendas",
    supplier: "Cliente Varejo",
    cashRegister: "Loja",
    taxStatus: "Não declarado",
  },
]

// Dados para os filtros
const categories = ["Salário", "Moradia", "Alimentação", "Trabalho extra", "Utilidades", "Vendas"]
const banks = ["Todos", "Banco do Brasil", "Itaú", "Nubank", "Banco Inter", "Caixa", "N/A"]
const costCenters = ["Todos", "Administrativo", "Operacional", "Pessoal", "Projetos", "Vendas"]
const paymentMethods = [
  "Todos",
  "Depósito bancário",
  "Débito automático",
  "Cartão de crédito",
  "Transferência PIX",
  "Boleto",
  "Dinheiro",
]
const cashRegisters = ["Todos", "Principal", "Secundário", "Loja"]
const taxStatuses = ["Todos", "Declarado", "Pendente", "Não declarado"]

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("todos")
  const [showFilters, setShowFilters] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null)
  const { toast } = useToast()

  // Estados para filtros avançados
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedBank, setSelectedBank] = useState("Todos")
  const [selectedDate, setSelectedDate] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedCostCenter, setSelectedCostCenter] = useState("Todos")
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("todos")
  const [supplierFilter, setSupplierFilter] = useState("")
  const [selectedCashRegister, setSelectedCashRegister] = useState("Todos")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Todos")
  const [selectedTaxStatus, setSelectedTaxStatus] = useState("Todos")

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  // Formatar valor para exibição
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Filtrar transações
  const filteredTransactions = transactions.filter((transaction) => {
    // Filtro de busca básica
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de tipo básico
    const matchesType =
      filterType === "todos" ||
      (filterType === "receitas" && transaction.transactionType === "receita") ||
      (filterType === "despesas" && transaction.transactionType === "despesa") ||
      (filterType === "pendentes" && transaction.status === "pendente") ||
      (filterType === "concluidas" && transaction.status === "concluida")

    // Filtros avançados
    const matchesMinAmount = minAmount === "" || transaction.amount >= Number.parseFloat(minAmount)
    const matchesMaxAmount = maxAmount === "" || transaction.amount <= Number.parseFloat(maxAmount)
    const matchesCategory = selectedCategory === "Todos" || transaction.category === selectedCategory
    const matchesBank = selectedBank === "Todos" || transaction.bank === selectedBank

    // Filtro de data específica
    const matchesSpecificDate = selectedDate === "" || transaction.date === selectedDate

    // Filtro de intervalo de datas
    const transactionDate = new Date(transaction.date)
    const matchesDateRange =
      (startDate === "" || new Date(startDate) <= transactionDate) &&
      (endDate === "" || new Date(endDate) >= transactionDate)

    const matchesCostCenter = selectedCostCenter === "Todos" || transaction.costCenter === selectedCostCenter

    const matchesTransactionType =
      transactionTypeFilter === "todos" ||
      (transactionTypeFilter === "receita" && transaction.transactionType === "receita") ||
      (transactionTypeFilter === "despesa" && transaction.transactionType === "despesa")

    const matchesSupplier =
      supplierFilter === "" ||
      (transaction.supplier && transaction.supplier.toLowerCase().includes(supplierFilter.toLowerCase()))

    const matchesCashRegister = selectedCashRegister === "Todos" || transaction.cashRegister === selectedCashRegister
    const matchesPaymentMethod =
      selectedPaymentMethod === "Todos" || transaction.paymentMethod === selectedPaymentMethod
    const matchesTaxStatus = selectedTaxStatus === "Todos" || transaction.taxStatus === selectedTaxStatus

    return (
      matchesSearch &&
      matchesType &&
      matchesMinAmount &&
      matchesMaxAmount &&
      matchesCategory &&
      matchesBank &&
      matchesSpecificDate &&
      matchesDateRange &&
      matchesCostCenter &&
      matchesTransactionType &&
      matchesSupplier &&
      matchesCashRegister &&
      matchesPaymentMethod &&
      matchesTaxStatus
    )
  })

  // Copiar código de boleto
  const copyBoleto = (boleto: string) => {
    navigator.clipboard.writeText(boleto)
    toast({
      title: "Código copiado!",
      description: "O código do boleto foi copiado para a área de transferência.",
    })
  }

  // Alternar status da transação
  const toggleStatus = (id: string) => {
    setTransactions(
      transactions.map((transaction) => {
        if (transaction.id === id) {
          const newStatus = transaction.status === "concluida" ? "pendente" : "concluida"
          toast({
            title: `Status alterado!`,
            description: `A transação agora está ${newStatus === "concluida" ? "concluída" : "pendente"}.`,
          })
          return { ...transaction, status: newStatus }
        }
        return transaction
      }),
    )
  }

  // Imprimir recibo
  const printReceipt = (transaction: Transaction) => {
    const receiptWindow = window.open("", "_blank")
    if (receiptWindow) {
      receiptWindow.document.write(`
        <html>
          <head>
            <title>Recibo - ${transaction.description}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .receipt { border: 1px solid #ccc; padding: 20px; max-width: 600px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 20px; }
              .title { font-size: 24px; font-weight: bold; }
              .info { margin-bottom: 5px; }
              .amount { font-size: 20px; font-weight: bold; margin: 20px 0; }
              .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
              .signature { margin-top: 60px; border-top: 1px solid #000; width: 200px; text-align: center; }
              @media print {
                body { margin: 0; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div class="title">RECIBO</div>
                <div>Nº ${transaction.id}</div>
              </div>
              
              <div class="info"><strong>Data:</strong> ${formatDate(transaction.date)}</div>
              <div class="info"><strong>Descrição:</strong> ${transaction.description}</div>
              <div class="info"><strong>Categoria:</strong> ${transaction.category}</div>
              <div class="info"><strong>Tipo:</strong> ${transaction.transactionType === "receita" ? "Receita" : "Despesa"}</div>
              <div class="info"><strong>Método de Pagamento:</strong> ${transaction.paymentMethod}</div>
              ${transaction.bank ? `<div class="info"><strong>Banco:</strong> ${transaction.bank}</div>` : ""}
              ${transaction.supplier ? `<div class="info"><strong>Fornecedor/Cliente:</strong> ${transaction.supplier}</div>` : ""}
              
              <div class="amount">${formatCurrency(transaction.amount)}</div>
              
              <div class="signature">Assinatura</div>
              
              <div class="footer">
                <p>Este recibo é um documento comprobatório de pagamento.</p>
                <p>Emitido em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <button onclick="window.print()">Imprimir</button>
            </div>
          </body>
        </html>
      `)
      receiptWindow.document.close()
    }
  }

  // Salvar transação editada
  const saveEditedTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTransaction) {
      setTransactions(
        transactions.map((transaction) =>
          transaction.id === editingTransaction.id ? editingTransaction : transaction,
        ),
      )
      setEditingTransaction(null)
      toast({
        title: "Transação atualizada!",
        description: "As alterações foram salvas com sucesso.",
      })
    }
  }

  // Excluir transação
  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id))
    setDeleteConfirmation(null)
    toast({
      title: "Transação excluída!",
      description: "A transação foi removida com sucesso.",
    })
  }

  // Limpar todos os filtros
  const clearFilters = () => {
    setSearchTerm("")
    setFilterType("todos")
    setMinAmount("")
    setMaxAmount("")
    setSelectedCategory("Todos")
    setSelectedBank("Todos")
    setSelectedDate("")
    setStartDate("")
    setEndDate("")
    setSelectedCostCenter("Todos")
    setTransactionTypeFilter("todos")
    setSupplierFilter("")
    setSelectedCashRegister("Todos")
    setSelectedPaymentMethod("Todos")
    setSelectedTaxStatus("Todos")
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos.",
    })
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as transações</SelectItem>
                  <SelectItem value="receitas">Receitas</SelectItem>
                  <SelectItem value="despesas">Despesas</SelectItem>
                  <SelectItem value="pendentes">Pendentes</SelectItem>
                  <SelectItem value="concluidas">Concluídas</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1"
              >
                {showFilters ? "Ocultar filtros" : "Filtros avançados"}
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mb-6 p-4 border rounded-md bg-muted/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Filtro por valor */}
                <div className="space-y-2">
                  <Label>Valor</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filtro por categoria */}
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todas as categorias</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por banco */}
                <div className="space-y-2">
                  <Label>Banco</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por data específica */}
                <div className="space-y-2">
                  <Label>Data específica</Label>
                  <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>

                {/* Filtro por intervalo de datas */}
                <div className="space-y-2">
                  <Label>Entre datas</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      placeholder="Início"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input type="date" placeholder="Fim" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>

                {/* Filtro por centro de custo */}
                <div className="space-y-2">
                  <Label>Centro de custo</Label>
                  <Select value={selectedCostCenter} onValueChange={setSelectedCostCenter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o centro de custo" />
                    </SelectTrigger>
                    <SelectContent>
                      {costCenters.map((center) => (
                        <SelectItem key={center} value={center}>
                          {center}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por tipo de transação */}
                <div className="space-y-2">
                  <Label>Receita/Despesa</Label>
                  <Select value={transactionTypeFilter} onValueChange={setTransactionTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="receita">Receitas</SelectItem>
                      <SelectItem value="despesa">Despesas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por fornecedor */}
                <div className="space-y-2">
                  <Label>Fornecedor/Cliente</Label>
                  <Input
                    placeholder="Digite o nome"
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                  />
                </div>

                {/* Filtro por caixa */}
                <div className="space-y-2">
                  <Label>Caixa</Label>
                  <Select value={selectedCashRegister} onValueChange={setSelectedCashRegister}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o caixa" />
                    </SelectTrigger>
                    <SelectContent>
                      {cashRegisters.map((register) => (
                        <SelectItem key={register} value={register}>
                          {register}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por meio de pagamento */}
                <div className="space-y-2">
                  <Label>Meio de pagamento</Label>
                  <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o meio" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por situação fiscal */}
                <div className="space-y-2">
                  <Label>Situação fiscal</Label>
                  <Select value={selectedTaxStatus} onValueChange={setSelectedTaxStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a situação" />
                    </SelectTrigger>
                    <SelectContent>
                      {taxStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={clearFilters} className="mr-2">
                  Limpar filtros
                </Button>
                <Button onClick={() => setShowFilters(false)}>Aplicar filtros</Button>
              </div>
            </div>
          )}

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição / Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Boleto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tipo de Transação</TableHead>
                  <TableHead>Meio de Pagamento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">{transaction.category}</div>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          transaction.transactionType === "receita" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.transactionType === "receita" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        {transaction.boleto ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyBoleto(transaction.boleto!)}
                            className="flex items-center gap-1"
                          >
                            <FileTextIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Copiar</span>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>
                        {transaction.status === "concluida" ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 w-fit"
                          >
                            <CheckCircle2Icon className="h-3 w-3" />
                            Concluída
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1 w-fit"
                          >
                            <ClockIcon className="h-3 w-3" />
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {transaction.transactionType === "receita" ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <ArrowUpIcon className="h-4 w-4" />
                            <span>Receita</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600">
                            <ArrowDownIcon className="h-4 w-4" />
                            <span>Despesa</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{transaction.paymentMethod}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => printReceipt(transaction)}
                            title="Imprimir recibo"
                          >
                            <PrinterIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleStatus(transaction.id)}
                            title={`Marcar como ${transaction.status === "concluida" ? "pendente" : "concluída"}`}
                          >
                            {transaction.status === "concluida" ? (
                              <ClockIcon className="h-4 w-4" />
                            ) : (
                              <CheckCircle2Icon className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingTransaction(transaction)}
                            title="Editar transação"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteConfirmation(transaction.id)}
                            title="Excluir transação"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                      Nenhuma transação encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
            <div>
              Exibindo {filteredTransactions.length} de {transactions.length} transações
            </div>
            <div className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4" />
              <span>
                Total:{" "}
                {formatCurrency(
                  filteredTransactions.reduce((sum, transaction) => {
                    if (transaction.transactionType === "receita") {
                      return sum + transaction.amount
                    } else {
                      return sum - transaction.amount
                    }
                  }, 0),
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de edição */}
      <Dialog open={!!editingTransaction} onOpenChange={(open) => !open && setEditingTransaction(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar transação</DialogTitle>
            <DialogDescription>Faça as alterações necessárias e clique em salvar quando terminar.</DialogDescription>
          </DialogHeader>
          {editingTransaction && (
            <form onSubmit={saveEditedTransaction}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Data
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={editingTransaction.date}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, date: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Descrição
                  </Label>
                  <Input
                    id="description"
                    value={editingTransaction.description}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Categoria
                  </Label>
                  <Select
                    value={editingTransaction.category}
                    onValueChange={(value) => setEditingTransaction({ ...editingTransaction, category: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Valor
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={editingTransaction.amount}
                    onChange={(e) =>
                      setEditingTransaction({ ...editingTransaction, amount: Number.parseFloat(e.target.value) })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Tipo
                  </Label>
                  <Input
                    id="type"
                    value={editingTransaction.type}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, type: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Status</Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Checkbox
                      id="status"
                      checked={editingTransaction.status === "concluida"}
                      onCheckedChange={(checked) =>
                        setEditingTransaction({
                          ...editingTransaction,
                          status: checked ? "concluida" : "pendente",
                        })
                      }
                    />
                    <label
                      htmlFor="status"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Concluída
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Tipo de transação</Label>
                  <div className="col-span-3">
                    <Select
                      value={editingTransaction.transactionType}
                      onValueChange={(value: TransactionType) =>
                        setEditingTransaction({ ...editingTransaction, transactionType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="receita">Receita</SelectItem>
                        <SelectItem value="despesa">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentMethod" className="text-right">
                    Meio de pagamento
                  </Label>
                  <Input
                    id="paymentMethod"
                    value={editingTransaction.paymentMethod}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, paymentMethod: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Salvar alterações</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação de exclusão */}
      <Dialog open={!!deleteConfirmation} onOpenChange={(open) => !open && setDeleteConfirmation(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => deleteConfirmation && deleteTransaction(deleteConfirmation)}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

