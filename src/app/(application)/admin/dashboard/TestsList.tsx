"use client"

import { useState } from "react"
import { MobileTestsList } from "./MobileTestsList"
import { DesktopTestsList } from "./DesktopTestsList"
import { useMediaQuery } from "./mediaQuery"

// Definindo o tipo para os dados de teste
export interface TestDTO {
  id: number
  title: string
  discipline: string
  status: "published" | "unpublished"
  questions: number
  texts: number
  createdAt: string
  completions: number
}

// Dados de exemplo
export const testsData: TestDTO[] = [
  {
    id: 1,
    title: "Avaliação de Matemática - Ensino Médio",
    discipline: "math",
    status: "published",
    questions: 25,
    texts: 3,
    createdAt: "10/05/2023",
    completions: 345,
  },
  {
    id: 2,
    title: "Prova de Português - Gramática",
    discipline: "language",
    status: "published",
    questions: 30,
    texts: 5,
    createdAt: "15/05/2023",
    completions: 289,
  },
  {
    id: 3,
    title: "Avaliação de Ciências - Biologia",
    discipline: "science",
    status: "unpublished",
    questions: 20,
    texts: 2,
    createdAt: "22/04/2023",
    completions: 156,
  },
  {
    id: 999,
    title: "História do Brasil - Período Colonial",
    discipline: "history",
    status: "unpublished",
    questions: 15,
    texts: 4,
    createdAt: "01/06/2023",
    completions: 0,
  },
  {
    id: 1001,
    title: "Geografia - Clima e Vegetação",
    discipline: "geography",
    status: "published",
    questions: 22,
    texts: 3,
    createdAt: "28/05/2023",
    completions: 178,
  },
]

interface TestsListProps {
  tests?: TestDTO[]
}

export function TestsList({ tests = testsData }: TestsListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const isMobile = useMediaQuery("(max-width: 768px)")

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  if (isMobile) {
    return <MobileTestsList tests={tests} expandedItems={expandedItems} toggleExpand={toggleExpand} />
  }

  return <DesktopTestsList tests={tests} />
}

