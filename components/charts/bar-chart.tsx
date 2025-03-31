"use client"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useTheme } from "next-themes"
import React from "react"

interface BarChartData {
  name: string
  value: number
  backgroundColor?: string
}

interface BarChartProps {
  data: BarChartData[] | any
  xKey?: string
  yKey?: string
  height?: number
}

export function BarChart({ data, xKey = "name", yKey = "value", height = 400 }: BarChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Verificar se os dados estão no formato esperado e converter se necessário
  const processedData = React.useMemo(() => {
    if (!data) return []
    
    // Se data já é um array, verificar se tem o formato esperado
    if (Array.isArray(data)) {
      return data
    }
    
    // Se data é um objeto com datasets (formato usado em alguns componentes)
    if (data.datasets && data.labels) {
      return data.labels.map((label: string, index: number) => ({
        name: label,
        value: data.datasets[0].data[index],
        backgroundColor: data.datasets[0].backgroundColor?.[index] || undefined
      }))
    }
    
    // Caso não seja possível processar, retornar array vazio
    return []
  }, [data])

  if (!processedData || processedData.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p>No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        <Bar dataKey={yKey} fill="#8884d8">
          {Array.isArray(processedData) && processedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.backgroundColor || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

