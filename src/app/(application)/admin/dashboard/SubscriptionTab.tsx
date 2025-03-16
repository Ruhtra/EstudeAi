"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SubscriptionChart } from "./SubscriptionChart"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "./mediaQuery"

export function SubscriptionTab() {
  const [isExpanded, setIsExpanded] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const totalSubscriptions = 1234

  const recentSubscriptions = [
    { id: 1, plan: "Premium Anual", user: "Carlos Silva", date: "Hoje, 10:45", status: "active" },
    { id: 2, plan: "Básico Mensal", user: "Ana Oliveira", date: "Ontem, 15:30", status: "active" },
    { id: 3, plan: "Premium Mensal", user: "Pedro Santos", date: "22/06/2023", status: "pending" },
    { id: 4, plan: "Básico Anual", user: "Mariana Costa", date: "20/06/2023", status: "active" },
  ]

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm font-medium">Total de Assinaturas</CardTitle>
            <button onClick={() => setIsExpanded(!isExpanded)} className="md:hidden">
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">{totalSubscriptions}</p>
            <AnimatePresence>
              {(isExpanded || !isMobile) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs text-muted-foreground mt-2">+20% em relação ao mês anterior</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
        <SubscriptionChart />
      </div>

      <Card className="mt-4">
        <CardHeader className="p-4">
          <CardTitle>Assinaturas Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {recentSubscriptions.map((subscription) => (
              <div key={subscription.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-medium text-sm">{subscription.plan}</p>
                  <p className="text-xs text-muted-foreground">{subscription.user}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={subscription.status === "active" ? "default" : "outline"} className="text-xs">
                    {subscription.status === "active" ? "Ativa" : "Pendente"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{subscription.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

