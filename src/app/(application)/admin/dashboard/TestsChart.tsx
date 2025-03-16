import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "Jan", created: 180, completed: 1200 },
  { month: "Fev", created: 200, completed: 1350 },
  { month: "Mar", created: 220, completed: 1450 },
  { month: "Abr", created: 190, completed: 1400 },
  { month: "Mai", created: 240, completed: 1650 },
  { month: "Jun", created: 250, completed: 1700 },
]

export function TestsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas de Provas</CardTitle>
        <CardDescription>Provas criadas e realizadas nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
              <Bar dataKey="created" name="Provas Criadas" fill="#8884d8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Provas Realizadas" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

