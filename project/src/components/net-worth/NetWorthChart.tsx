import React, {
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react';
import { useNetWorthStore } from '../../hooks/useNetWorthStore';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem,
  ScriptableContext,
  ChartOptions,
  BarElement,
} from 'chart.js';
import { format } from 'date-fns';
import { formatCurrency } from '../../lib/utils/utils';
import { BarChart3, LineChart, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

type ChartType = 'line' | 'area' | 'stacked' | 'bar';

export function NetWorthChart() {
  const netWorthEntries = useNetWorthStore((state) => state.netWorthEntries);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [chartType, setChartType] = useState<ChartType>('line');


    // Event listener for when the window size changes for different view sizes.
    useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768)
    };

      window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

  }, [setIsMobile]);


    const handleChartTypeChange = useCallback((type: ChartType) => {
        setChartType(type);
    }, [setChartType]);


  // UseMemo is used so we don't run our sort on each render.
  const sortedEntries = useMemo(() => {
        return [...netWorthEntries].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

  }, [netWorthEntries]);


    const chartData = useMemo(() => {
    return {
        labels: sortedEntries.map((entry) =>
          format(new Date(entry.date), 'MMM dd, yyyy'),
        ),
       datasets: chartType === 'stacked'
          ? [
              {
                  label: 'Assets',
                  data: sortedEntries.map((entry) => (entry.netWorth > 0 ? entry.netWorth : 0)),
                fill: true,
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                borderColor: '#22c55e',
                borderWidth: 2,
                pointRadius: isMobile ? 2 : 4,
                pointHoverRadius: isMobile ? 4 : 6,
                },
                {
                    label: 'Liabilities',
                data: sortedEntries.map((entry) =>
                  entry.netWorth < 0 ? Math.abs(entry.netWorth) : 0,
                ),
                  fill: true,
                  backgroundColor: 'rgba(239, 68, 68, 0.5)',
                  borderColor: '#ef4444',
                borderWidth: 2,
                pointRadius: isMobile ? 2 : 4,
                pointHoverRadius: isMobile ? 4 : 6,
              },
            ]
          : [
            {
                label: 'Net Worth',
              data: sortedEntries.map((entry) => entry.netWorth),
                fill: chartType === 'area',
               backgroundColor: (context: ScriptableContext<'line'>) => {
                  const chart = context.chart;
                const { ctx, chartArea } = chart;
                    if (!chartArea) return 'rgba(124, 58, 237, 0.5)';

                    const gradient = ctx.createLinearGradient(
                    0,
                    chartArea.top,
                    0,
                  chartArea.bottom,
                );
                gradient.addColorStop(0, 'rgba(124, 58, 237, 0.5)');
                  gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
                 return gradient;
                },
                borderColor: '#7c3aed',
              borderWidth: 2,
                pointBackgroundColor: '#7c3aed',
                  pointBorderColor: '#ffffff',
                 pointBorderWidth: 2,
                pointRadius: isMobile ? 2 : 4,
                pointHoverRadius: isMobile ? 4 : 6,
                 pointHoverBackgroundColor: '#7c3aed',
                 pointHoverBorderColor: '#ffffff',
               pointHoverBorderWidth: 2,
              tension: 0.4,
            },
        ],
      };

    }, [sortedEntries, chartType, isMobile])




    const options: ChartOptions<'line' | 'bar'> = useMemo(() => ({
          responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart',
        },
          interaction: {
            mode: 'index',
            intersect: false,
          },
           plugins: {
             legend: {
                  display: chartType === 'stacked',
                position: 'top' as const,
                labels: {
                    font: {
                    size: 12,
                    },
                  usePointStyle: true,
                  padding: 20,
                 },
             },
                title: {
                  display: true,
                  text:
                    chartType === 'stacked'
                      ? 'Assets vs Liabilities'
                    : 'Net Worth Growth',
                color: '#6b7280',
                font: {
                  size: isMobile ? 13 : 15,
                    weight: 500,
                   family: 'system-ui',
                  },
                padding: { top: 12, bottom: 12 },
              },
             tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1f2937',
              bodyColor: '#4b5563',
                  bodyFont: {
                    size: 12,
                  },
                 padding: 8,
                  borderColor: 'rgba(229, 231, 235, 1)',
                borderWidth: 1,
                  displayColors: chartType === 'stacked',
                  callbacks: {
                      label: function (context: TooltipItem<'line'>) {
                            return `${context.dataset.label}: ${formatCurrency(
                                context.parsed.y,
                        )}`;
                  },
                  },
              },
          },
        scales: {
            x: {
                grid: {
                      display: false,
               },
                ticks: {
                      autoSkip: true,
                    maxTicksLimit: isMobile ? 3 : 6,
                  color: '#9ca3af',
                  font: {
                    size: 10,
                  },
                    maxRotation: 0,
                },
        },
           y: {
                  grid: {
                    color: 'rgba(243, 244, 246, 1)',
                    display: true,
                      lineWidth: 1,
                  },
                    border: {
                      display: false,
                  },
                   ticks: {
                      color: '#9ca3af',
                  font: {
                       size: 10,
                      },
                    callback: function (tickValue: number | string): string | null {
                          if (typeof tickValue !== 'number') return null;
                    return isMobile
                      ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                            currency: 'USD',
                          notation: 'compact',
                         }).format(tickValue)
                          : formatCurrency(tickValue);
                      },
                 },
             },
          },
    }), [isMobile, chartType])




  return (
    <div className="w-full overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center justify-between p-2 sm:p-4 border-b">
        <h3 className="text-sm font-medium">Net Worth Visualization</h3>
        <div className="flex gap-1 bg-muted rounded-md p-1">
          <button
              onClick={() => handleChartTypeChange('line')}
            className={`p-1.5 rounded-sm ${
              chartType === 'line'
                ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
            }`}
              title="Line Chart"
            >
            <LineChart className="h-4 w-4" />
          </button>
           <button
             onClick={() => handleChartTypeChange('bar')}
            className={`p-1.5 rounded-sm ${
              chartType === 'bar'
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
           }`}
                title="Bar Chart"
              >
            <BarChart3 className="h-4 w-4" />
          </button>
         <button
              onClick={() => handleChartTypeChange('stacked')}
              className={`p-1.5 rounded-sm ${
                chartType === 'stacked'
                 ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
                title="Stacked Area Chart"
          >
            <TrendingUp className="h-4 w-4" />
            </button>
        </div>
      </div>
      <div className="h-[240px] w-full sm:h-[300px] p-2 sm:p-4">
        {chartType === 'bar' ? (
          <Bar
            options={options as ChartOptions<'bar'>}
            data={{
              ...chartData,
                datasets: chartData.datasets.map((dataset) => ({
                  ...dataset,
                    backgroundColor:
                  dataset.backgroundColor instanceof Function
                     ? 'rgba(124, 58, 237, 0.5)'
                     : dataset.backgroundColor,
                })),
            }}
          />
        ) : (
          <Line options={options as ChartOptions<'line'>} data={chartData} />
       )}
      </div>
   </div>
 );
}