import { Transactions } from "@/components/transactions"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Transações</h1>
      <Transactions />
    </div>
  )
}

