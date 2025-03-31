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
  [key: string]: any
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
  } | Array<{name: string, value: number, [key: string]: any}> | number[]
  labels?: string[]
  label?: string
  xKey?: string
  yKey?: string
  height?: number
}

export function LineChart({ data, labels, label = 'Valor', xKey = 'name', yKey = 'value', height = 400 }: LineChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Processar os dados com base no formato recebido
  let chartData: LineChartData[] = []

  // Verificar se não há dados
  if (!data) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p>No data available</p>
      </div>
    )
  }

  // Formato 1: { labels, datasets }
  if (typeof data === 'object' && !Array.isArray(data) && 'labels' in data && 'datasets' in data) {
    if (!data.datasets || !data.datasets.length || !data.datasets[0] || !data.datasets[0].data || data.datasets[0].data.length === 0) {
      return (
        <div className="flex items-center justify-center" style={{ height }}>
          <p>No data available</p>
        </div>
      )
    }

    chartData = data.labels.map((label, index) => {
      const dataPoint: LineChartData = { name: label }
      data.datasets.forEach((dataset) => {
        dataPoint[dataset.label] = dataset.data[index]
      })
      return dataPoint
    })
  }
  // Formato 2: Array de objetos com name e value
  else if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && xKey in data[0] && yKey in data[0]) {
    chartData = data as LineChartData[]
  }
  // Formato 3: Array de números com labels separados
  else if (Array.isArray(data) && Array.isArray(labels) && data.length > 0 && typeof data[0] === 'number') {
    chartData = labels.map((label, index) => {
      const dataPoint: LineChartData = { name: label }
      dataPoint[label] = data[index]
      return dataPoint
    })
  }
  // Se não for nenhum formato reconhecido
  else {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p>Invalid data format</p>
      </div>
    )
  }

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
        {/* Renderizar linhas com base no formato dos dados */}
        {Array.isArray(data) && typeof data[0] === 'object' && xKey in data[0] && yKey in data[0] ? (
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
        ) : Array.isArray(data) && typeof data[0] === 'number' && label ? (
          <Line
            type="monotone"
            dataKey={label}
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
        ) : (
          // Para o formato { labels, datasets }
          typeof data === 'object' && !Array.isArray(data) && 'datasets' in data && data.datasets.map((dataset) => (
            <Line
              key={dataset.label}
              type="monotone"
              dataKey={dataset.label}
              stroke={dataset.borderColor}
              strokeWidth={2}
              dot={false}
            />
          ))
        )}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

