import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import data from '../../data.json';

const BarChartAverageProduction = ({ isDark }: { isDark: boolean }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    // Aggregate crop production data
    const cropMap: { [key: string]: { total: number; count: number } } = {};

    data.forEach((item) => {
      const crop = item['Crop Name'];
      const production = parseFloat(String(item['Crop Production (UOM:t(Tonnes))']));
      if (!isNaN(production)) {
        if (!cropMap[crop]) {
          cropMap[crop] = { total: 0, count: 0 };
        }
        cropMap[crop].total += production;
        cropMap[crop].count += 1;
      }
    });

    const cropNames = Object.keys(cropMap);
    const avgProductions = cropNames.map(
      (crop) => cropMap[crop].total / cropMap[crop].count
    );

    // ECharts option with theme awareness
    const option = {
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
      title: {
        text: 'Average Crop Production by Crop Name',
        left: 'center',
        textStyle: {
          color: isDark ? '#ffffff' : '#000000',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: cropNames,
        axisLabel: {
          rotate: 45,
          interval: 0,
          color: isDark ? '#ccc' : '#333',
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#888' : '#ccc',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: 'Avg Production (Tonnes)',
        nameTextStyle: {
          color: isDark ? '#ccc' : '#333',
        },
        axisLabel: {
          color: isDark ? '#ccc' : '#333',
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#888' : '#ccc',
          },
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#444' : '#eee',
          },
        },
      },
      series: [
        {
          data: avgProductions,
          type: 'bar',
          itemStyle: {
            color: isDark ? '#66ccff' : '#5470C6',
          },
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]); // Add isDark to dependency array

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />;
};

export default BarChartAverageProduction;
