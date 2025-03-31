"use client"
import React from "react"
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useTheme } from "next-themes"

interface PieChartData {
  name: string
  value: number
  backgroundColor?: string
}

interface PieChartProps {
  data: PieChartData[] | any
  labels?: string[]
  height?: number
}

export function PieChart({ data, labels, height = 400 }: PieChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Transformar os dados para o formato correto se necessário
  const processedData = React.useMemo(() => {
    // Se não houver dados, retornar array vazio
    if (!data) return []

    // Se data já for um array de objetos com name e value, usar diretamente
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && 'name' in data[0] && 'value' in data[0]) {
      return data
    }

    // Se data for um array de números e labels for fornecido, combinar eles
    if (Array.isArray(data) && Array.isArray(labels) && data.length === labels.length) {
      return data.map((value, index) => ({
        name: labels[index],
        value: typeof value === 'number' ? value : 0
      }))
    }

    // Se data for um objeto, converter para array
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return Object.entries(data).map(([key, value]) => ({
        name: key,
        value: typeof value === 'number' ? value : 0
      }))
    }

    // Caso padrão: retornar array vazio
    return []
  }, [data, labels])

  if (!processedData || processedData.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p>No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={processedData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {processedData.map((entry: PieChartData, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.backgroundColor || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
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

