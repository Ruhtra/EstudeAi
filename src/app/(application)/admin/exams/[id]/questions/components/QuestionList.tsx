"use client";

import { useState } from "react";
import { MobileQuestionList } from "./MobileQuestionList";
import { DesktopQuestionList } from "./DesktopQuestionList";
import type { QuestionsDto } from "@/app/api/questions/route";

interface QuestionsListProps {
  questions: QuestionsDto[];
}

export function QuestionsList({ questions }: QuestionsListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <>
      <div className="lg:hidden">
        <MobileQuestionList
          questions={questions}
          expandedItems={expandedItems}
          toggleExpand={toggleExpand}
        />
      </div>
      <div className="hidden lg:block">
        <DesktopQuestionList questions={questions} />
      </div>
    </>
  );
}
