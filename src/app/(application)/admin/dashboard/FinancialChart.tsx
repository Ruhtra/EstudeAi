import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "Jan", revenue: 65000 },
  { month: "Fev", revenue: 70000 },
  { month: "Mar", revenue: 75000 },
  { month: "Abr", revenue: 80000 },
  { month: "Mai", revenue: 85000 },
  { month: "Jun", revenue: 90000 },
]

export function FinancialChart() {
  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle>Faturamento Mensal</CardTitle>
        <CardDescription>Faturamento dos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-[180px] sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$${value / 1000}k`}
              />
              <Tooltip />
              <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

