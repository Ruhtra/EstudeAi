"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export function TestsFilters() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  })
  const [status, setStatus] = useState("all")
  const [discipline, setDiscipline] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const handleApplyFilters = () => {
    // Aqui você implementaria a lógica para aplicar os filtros
    console.log("Aplicando filtros:", { dateRange, status, discipline, searchTerm })
  }

  const handleResetFilters = () => {
    setDateRange({ from: "", to: "" })
    setStatus("all")
    setDiscipline("all")
    setSearchTerm("")
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar prova</Label>
            <Input
              id="search"
              placeholder="Título ou número"
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
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="unpublished">Não publicado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discipline">Disciplina</Label>
            <Select value={discipline} onValueChange={setDiscipline}>
              <SelectTrigger id="discipline">
                <SelectValue placeholder="Selecione a disciplina" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="math">Matemática</SelectItem>
                <SelectItem value="science">Ciências</SelectItem>
                <SelectItem value="language">Português</SelectItem>
                <SelectItem value="history">História</SelectItem>
                <SelectItem value="geography">Geografia</SelectItem>
              </SelectContent>
            </Select>
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

