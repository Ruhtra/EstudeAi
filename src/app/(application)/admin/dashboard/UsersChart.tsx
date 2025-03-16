import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "Jan", total: 4200, active: 3500, new: 200 },
  { month: "Fev", total: 4400, active: 3650, new: 210 },
  { month: "Mar", total: 4650, active: 3800, new: 250 },
  { month: "Abr", total: 4900, active: 4000, new: 230 },
  { month: "Mai", total: 5200, active: 4150, new: 300 },
  { month: "Jun", total: 5432, active: 4321, new: 123 },
]

export function UsersChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução de Usuários</CardTitle>
        <CardDescription>Crescimento de usuários nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" name="Total" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="active" name="Ativos" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="new" name="Novos" stroke="#ffc658" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

