"use client";

import { TextsDto } from "@/app/api/texts/route";
import { useState } from "react";
import { MobileTextList } from "./MobileTextList";
import { DesktopTextList } from "./DesktopTextList";

interface ExamsListProps {
  texts: TextsDto[];
}

export function TextList({ texts }: ExamsListProps) {
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
        <MobileTextList
          texts={texts}
          expandedItems={expandedItems}
          toggleExpand={toggleExpand}
        />
      </div>
      <div className="hidden lg:block">
        <DesktopTextList texts={texts} />
      </div>
    </>
  );
}
