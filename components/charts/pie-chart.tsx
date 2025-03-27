"use client"
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useTheme } from "next-themes"

interface PieChartProps {
  data: Array<{ name: string; value: number }>
  height?: number
}

export function PieChart({ data, height = 400 }: PieChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B", "#6B66FF"]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`${value} itens`, "Quantidade"]}
          contentStyle={{
            backgroundColor: isDark ? "#333" : "#fff",
            border: `1px solid ${isDark ? "#444" : "#ddd"}`,
            color: isDark ? "#fff" : "#333",
          }}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

