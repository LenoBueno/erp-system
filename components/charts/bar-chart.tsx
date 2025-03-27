"use client"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useTheme } from "next-themes"

interface BarChartProps {
  data: Array<{ name: string; value: number }>
  xKey: string
  yKey: string
  height?: number
}

export function BarChart({ data, xKey, yKey, height = 400 }: BarChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: isDark ? "#ccc" : "#333" }}
          tickLine={{ stroke: isDark ? "#666" : "#ccc" }}
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fill: isDark ? "#ccc" : "#333" }}
          tickLine={{ stroke: isDark ? "#666" : "#ccc" }}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), "Valor"]}
          contentStyle={{
            backgroundColor: isDark ? "#333" : "#fff",
            border: `1px solid ${isDark ? "#444" : "#ddd"}`,
            color: isDark ? "#fff" : "#333",
          }}
        />
        <Bar dataKey={yKey} fill="#8884d8" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

