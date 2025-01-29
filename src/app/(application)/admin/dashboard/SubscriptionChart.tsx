import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  { month: "Jan", subscriptions: 100 },
  { month: "Fev", subscriptions: 120 },
  { month: "Mar", subscriptions: 150 },
  { month: "Abr", subscriptions: 180 },
  { month: "Mai", subscriptions: 220 },
  { month: "Jun", subscriptions: 250 },
];

export function SubscriptionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução de Assinaturas</CardTitle>
        <CardDescription>
          Número de assinaturas nos últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-[180px] sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="subscriptions"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
