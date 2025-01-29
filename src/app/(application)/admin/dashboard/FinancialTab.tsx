"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialChart } from "./FinancialChart";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FinancialTab() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const annualRevenue = 1000000;
  const monthlyRevenue = 85000;
  const averageTicket = 250;

  const ExpandableCard = ({
    title,
    value,
    id,
  }: {
    title: string;
    value: number;
    id: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 ">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <button
          onClick={() => setExpandedCard(expandedCard === id ? null : id)}
          className="md:hidden"
        >
          {expandedCard === id ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </button>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">R$ {value.toLocaleString()}</p>
        <AnimatePresence>
          {(expandedCard === id || window.innerWidth >= 768) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs text-muted-foreground mt-1">
                +10% em relação ao período anterior
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-2">
      <div className="grid gap-2 grid-cols-1 md:grid-cols-3">
        <ExpandableCard
          title="Faturamento Anual"
          value={annualRevenue}
          id="annual"
        />
        <ExpandableCard
          title="Faturamento Mensal"
          value={monthlyRevenue}
          id="monthly"
        />
        <ExpandableCard
          title="Ticket Médio"
          value={averageTicket}
          id="ticket"
        />
      </div>
      <FinancialChart />
    </div>
  );
}
