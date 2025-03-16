"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { SubscriptionTab } from "./SubscriptionTab"
import { FinancialTab } from "./FinancialTab"
import { UsersTab } from "./UsersTab"
import { TestsTab } from "./TestsTab"
import { useState } from "react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("users")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-2">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard</h1>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full h-full grid-cols-2 md:grid-cols-4 mb-2 p-2 gap-2">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="tests">Provas</TabsTrigger>
          <TabsTrigger value="subscription">Assinaturas</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        <TabsContent value="financial">
          <FinancialTab />
        </TabsContent>
        <TabsContent value="tests">
          <TestsTab />
        </TabsContent>
        <TabsContent value="subscription">
          <SubscriptionTab />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

