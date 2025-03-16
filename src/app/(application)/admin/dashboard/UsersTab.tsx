"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersChart } from "./UsersChart"
import { useState } from "react"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { UserFilters } from "./UserFilters"
import { UsersList } from "./UsersList"
import { useMediaQuery } from "./mediaQuery"

export function UsersTab() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const totalUsers = 5432
  const activeUsers = 4321
  const newUsers = 123

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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <button onClick={() => setExpandedCard(expandedCard === id ? null : id)} className="md:hidden">
          {expandedCard === id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        <AnimatePresence>
          {(expandedCard === id || !isMobile) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Estatísticas de Usuários</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
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
            <UserFilters />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <ExpandableCard
          title="Total de Usuários"
          value={totalUsers}
          id="total"
          subtitle="+15% em relação ao mês anterior"
        />
        <ExpandableCard title="Usuários Ativos" value={activeUsers} id="active" subtitle="79.5% do total de usuários" />
        <ExpandableCard
          title="Novos Usuários (Mês)"
          value={newUsers}
          id="new"
          subtitle="+8% em relação ao mês anterior"
        />
      </div>

      <UsersChart />

      <Card className="mt-4">
        <CardHeader className="p-4">
          <CardTitle>Usuários Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <UsersList />
        </CardContent>
      </Card>
    </div>
  )
}

