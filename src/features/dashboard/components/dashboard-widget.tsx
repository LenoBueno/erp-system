'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Chart as ChartJS, ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { X, Settings } from 'lucide-react';

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);

interface DashboardWidgetProps {
  widget: Widget;
  onRemove: () => void;
}

export function DashboardWidget({ widget, onRemove }: DashboardWidgetProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // Simular dados baseados no tipo de gráfico
    const generateData = () => {
      switch (widget.settings.chartType) {
        case 'line':
          return {
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
            datasets: [
              {
                label: 'Vendas',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: widget.settings.colors[0],
                tension: 0.1
              }
            ]
          };
        case 'bar':
          return {
            labels: ['Produto A', 'Produto B', 'Produto C'],
            datasets: [
              {
                label: 'Quantidade',
                data: [12, 19, 3],
                backgroundColor: widget.settings.colors[0]
              }
            ]
          };
        default:
          return {
            labels: ['A', 'B', 'C'],
            datasets: [
              {
                label: 'Dados',
                data: [12, 19, 3],
                backgroundColor: widget.settings.colors
              }
            ]
          };
      }
    };

    setChartData(generateData());
  }, [widget.settings]);

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {widget.title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              // Abrir modal de configurações
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {chartData && (
          <Chart
            type={widget.settings.chartType}
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: widget.title,
                },
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
