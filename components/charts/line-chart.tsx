"use client"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useTheme } from "next-themes"

interface LineChartData {
  name: string
  [key: string]: string | number
}

interface LineChartProps {
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
    }>
  }
  height?: number
}

export function LineChart({ data, height = 400 }: LineChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  if (!data.datasets[0].data || data.datasets[0].data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p>No data available</p>
      </div>
    )
  }

  const chartData: LineChartData[] = data.labels.map((label, index) => {
    const dataPoint: LineChartData = { name: label }
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index]
    })
    return dataPoint
  })

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        {data.datasets.map((dataset) => (
          <Line
            key={dataset.label}
            type="monotone"
            dataKey={dataset.label}
            stroke={dataset.borderColor}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

