"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionChart } from "./SubscriptionChart";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SubscriptionTab() {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalSubscriptions = 1234;

  return (
    <div className="grid gap-2 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-sm font-medium">
            Total de Assinaturas
          </CardTitle>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalSubscriptions}</p>
          <AnimatePresence>
            {(isExpanded || window.innerWidth >= 768) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs text-muted-foreground mt-1">
                  +20% em relação ao mês anterior
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      <SubscriptionChart />
    </div>
  );
}
