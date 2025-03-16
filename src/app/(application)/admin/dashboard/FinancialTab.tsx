"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FinancialChart } from "./FinancialChart"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "./mediaQuery"
import { Badge } from "@/components/ui/badge"

export function FinancialTab() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const annualRevenue = 1000000
  const monthlyRevenue = 85000
  const averageTicket = 250

  const recentTransactions = [
    { id: 1, description: "Assinatura Premium", amount: 1200, date: "Hoje, 10:45", type: "income" },
    { id: 2, description: "Assinatura Básica", amount: 600, date: "Ontem, 15:30", type: "income" },
    { id: 3, description: "Reembolso", amount: 600, date: "22/06/2023", type: "expense" },
    { id: 4, description: "Assinatura Premium", amount: 1200, date: "20/06/2023", type: "income" },
  ]

  const ExpandableCard = ({
    title,
    value,
    id,
  }: {
    title: string
    value: number
    id: string
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <button onClick={() => setExpandedCard(expandedCard === id ? null : id)} className="md:hidden">
          {expandedCard === id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-2xl font-bold">R$ {value.toLocaleString()}</p>
        <AnimatePresence>
          {(expandedCard === id || !isMobile) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs text-muted-foreground mt-2">+10% em relação ao período anterior</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <ExpandableCard title="Faturamento Anual" value={annualRevenue} id="annual" />
        <ExpandableCard title="Faturamento Mensal" value={monthlyRevenue} id="monthly" />
        <ExpandableCard title="Ticket Médio" value={averageTicket} id="ticket" />
      </div>
      <FinancialChart />

      <Card className="mt-4">
        <CardHeader className="p-4">
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-medium text-sm">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={transaction.type === "income" ? "default" : "destructive"} className="text-xs">
                    {transaction.type === "income" ? "Receita" : "Despesa"}
                  </Badge>
                  <span
                    className={`text-sm font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.type === "income" ? "+" : "-"}R$ {transaction.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

