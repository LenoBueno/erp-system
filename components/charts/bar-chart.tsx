"use client"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useTheme } from "next-themes"

interface BarChartData {
  name: string
  value: number
  backgroundColor?: string
}

interface BarChartProps {
  data: BarChartData[]
  height?: number
}

export function BarChart({ data, height = 400 }: BarChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p>No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
        <XAxis
          dataKey="name"
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
        <Bar dataKey="value" fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.backgroundColor || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

