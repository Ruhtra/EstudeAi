"use client"

import { useState } from "react"
import { MobileExamList } from "./MobileExamList"
import { DesktopExamList } from "./DesktopExamList"
import type { ExamsDto } from "@/app/api/exams/route"

interface ExamsListProps {
  exams: ExamsDto[]
}

export function ExamsList({ exams }: ExamsListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

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

  return (
    <>
      <div className="lg:hidden">
        <MobileExamList exams={exams} expandedItems={expandedItems} toggleExpand={toggleExpand} />
      </div>
      <div className="hidden lg:block">
        <DesktopExamList exams={exams} />
      </div>
    </>
  )
}

