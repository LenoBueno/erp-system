"use client"

import * as React from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartProps } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Paleta de cores padrão para gráficos
const DEFAULT_COLORS = [
  "#2563eb", // azul
  "#16a34a", // verde
  "#db2777", // rosa
  "#ea580c", // laranja
  "#8b5cf6", // roxo
  "#ca8a04", // amarelo
  "#0891b2", // ciano
  "#be123c", // vermelho
  "#4b5563", // cinza
]

interface ExtendedChartProps extends Omit<ChartProps, 'data'> {
  title?: string;
  isLoading?: boolean;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      fill?: boolean;
    }[];
  };
}

// Função auxiliar para formatar valores numéricos
const formatNumber = (value: number | string): string => {
  if (typeof value === 'number') {
    return value.toLocaleString('pt-BR');
  }
  return String(value);
};

export function ChartFactory({
  type,
  data,
  options = {},
  height = 300,
  width = 500,
  title,
  isLoading = false,
}: ExtendedChartProps) {
  if (isLoading) {
    return (
      <Card>
        {title && (
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const renderChart = () => {
    const { datasets, labels } = data;
    
    // Formatar dados para Recharts
    const formattedData = labels.map((label, i) => {
      const dataPoint: Record<string, any> = { name: label };
      datasets.forEach((dataset) => {
        dataPoint[dataset.label] = dataset.data[i];
      });
      return dataPoint;
    });

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={formattedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: string) => [formatNumber(value), name]}
              />
              <Legend />
              {datasets.map((dataset, index) => {
                // Garantir que stroke seja sempre uma string
                const strokeColor = typeof dataset.borderColor === 'string' 
                  ? dataset.borderColor 
                  : DEFAULT_COLORS[index % DEFAULT_COLORS.length];
                
                return (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={dataset.label}
                    stroke={strokeColor}
                    activeDot={{ r: 8 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={formattedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value: any) => formatNumber(value)}
              />
              <Tooltip 
                formatter={(value: any, name: string) => [formatNumber(value), name]}
              />
              <Legend />
              {datasets.map((dataset, index) => {
                // Garantir que fill seja sempre uma string
                const fillColor = Array.isArray(dataset.backgroundColor)
                  ? dataset.backgroundColor[0]
                  : typeof dataset.backgroundColor === 'string'
                    ? dataset.backgroundColor
                    : DEFAULT_COLORS[index % DEFAULT_COLORS.length];
                
                return (
                  <Bar
                    key={index}
                    dataKey={dataset.label}
                    fill={fillColor}
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
      case 'donut':
        // Para gráficos de pizza, usamos apenas o primeiro dataset
        const dataset = datasets[0];
        const pieData = labels.map((label, i) => ({
          name: label,
          value: dataset.data[i]
        }));
        
        const innerRadius = type === 'donut' ? '60%' : 0;
        
        // Garantir que colors seja sempre um array de strings
        const colors = Array.isArray(dataset.backgroundColor)
          ? dataset.backgroundColor
          : labels.map((_, i) => DEFAULT_COLORS[i % DEFAULT_COLORS.length]);
          
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius="80%"
                fill="#8884d8"
                paddingAngle={type === 'donut' ? 5 : 0}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(Number(percent) * 100).toFixed(0)}%`}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length] || DEFAULT_COLORS[0]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: string) => [formatNumber(value), name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div>Tipo de gráfico não suportado</div>;
    }
  };

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}
