"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TestsChart } from "./TestsChart"
import { useState } from "react"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { TestsFilters } from "./TestsFilters"
import { TestsTable } from "./TestsTable"
import { useMediaQuery } from "./mediaQuery"

export function TestsTab() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const totalTests = 1250
  const activeTests = 980
  const completedTests = 8750

  const ExpandableCard = ({
    title,
    value,
    id,
    subtitle,
  }: {
    title: string
    value: number
    id: string
    subtitle: string
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <button onClick={() => setExpandedCard(expandedCard === id ? null : id)} className="md:hidden">
          {expandedCard === id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        <AnimatePresence>
          {(expandedCard === id || !isMobile) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Estatísticas de Provas</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1"
        >
          <Filter size={16} />
          Filtros
        </Button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TestsFilters />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <ExpandableCard
          title="Total de Provas"
          value={totalTests}
          id="total"
          subtitle="+12% em relação ao mês anterior"
        />
        <ExpandableCard title="Provas Ativas" value={activeTests} id="active" subtitle="78.4% do total de provas" />
        <ExpandableCard
          title="Provas Realizadas"
          value={completedTests}
          id="completed"
          subtitle="+15% em relação ao mês anterior"
        />
      </div>

      <TestsChart />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Provas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <TestsTable />
        </CardContent>
      </Card>
    </div>
  )
}

