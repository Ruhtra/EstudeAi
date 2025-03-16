"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export function UserFilters() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  })
  const [status, setStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const handleApplyFilters = () => {
    // Aqui você implementaria a lógica para aplicar os filtros
    console.log("Aplicando filtros:", { dateRange, status, searchTerm })
  }

  const handleResetFilters = () => {
    setDateRange({ from: "", to: "" })
    setStatus("all")
    setSearchTerm("")
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar usuário</Label>
            <Input
              id="search"
              placeholder="Nome ou email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-from">Data de cadastro</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                id="date-from"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
              <Input
                id="date-to"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <Button onClick={handleApplyFilters} className="flex-1">
              Aplicar
            </Button>
            <Button variant="outline" onClick={handleResetFilters}>
              Limpar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

