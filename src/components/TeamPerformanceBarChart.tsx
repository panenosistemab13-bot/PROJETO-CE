import React, { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { ChevronDown } from 'lucide-react';

export function TeamPerformanceBarChart() {
  const [period, setPeriod] = useState('Esta Semana');
  const categories = ['Equipe A', 'Equipe B', 'Equipe C', 'Noturno A', 'Noturno B'];
  const values = [0, 0, 0, 0, 0];

  const option = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(201, 162, 101, 0.15)',
          },
        },
        backgroundColor: '#151b26',
        borderColor: '#c9a265',
        borderWidth: 1,
        padding: [6, 10],
        textStyle: {
          color: '#f1f5f9',
          fontSize: 11,
          fontFamily: 'Inter, sans-serif',
        },
        formatter: (params: any) => {
          const item = params[0];
          return `<div>
            <span style="color:#94a3b8;font-size:10px;">${item.name}</span><br/>
            <span style="color:#c9a265;font-weight:bold;font-size:12px;">Desempenho: ${item.value}%</span>
          </div>`;
        },
      },
      grid: {
        top: 25,
        right: 10,
        bottom: 25,
        left: 30,
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: {
          lineStyle: { color: '#1f2737' },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#94a3b8',
          fontSize: 10,
          fontFamily: 'Inter, sans-serif',
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        interval: 25,
        splitLine: {
          lineStyle: {
            color: '#1f2737',
            type: 'dashed',
          },
        },
        axisLabel: {
          color: '#64748b',
          fontSize: 9,
          formatter: '{value}%',
        },
      },
      series: [
        {
          name: 'Desempenho',
          type: 'bar',
          barWidth: 26,
          data: values,
          label: {
            show: true,
            position: 'top',
            color: '#dfbe85',
            fontSize: 10,
            fontWeight: 'bold',
            formatter: '{c}%',
          },
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#dfbe85' },
              { offset: 0.5, color: '#c9a265' },
              { offset: 1, color: '#684b20' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#fae4be' },
                { offset: 0.5, color: '#dfbe85' },
                { offset: 1, color: '#8c6a38' },
              ]),
            },
          },
        },
      ],
    };
  }, []);

  return (
    <div className="bg-[#151b26] border border-[#1f2737] hover:border-[#c9a265]/50 rounded-2xl p-5 flex flex-col h-full min-h-[300px] shadow-xl transition-all">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#c9a265] animate-pulse"></span>
          <h3 className="text-xs font-bold text-[#f1f5f9] uppercase tracking-wider">
            DESEMPENHO DAS EQUIPES
          </h3>
        </div>
        <div className="relative">
          <button
            onClick={() => setPeriod(period === 'Esta Semana' ? 'Este Mês' : 'Esta Semana')}
            className="flex items-center space-x-1 text-[10px] text-[#cbd5e1] bg-[#0c1017] px-2.5 py-1 rounded-lg border border-[#1f2737] hover:border-[#c9a265]/50 font-medium cursor-pointer transition-colors"
          >
            <span>{period}</span>
            <ChevronDown className="w-3 h-3 text-[#94a3b8]" />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full relative min-h-[220px]">
        <ReactECharts
          option={option}
          style={{ width: '100%', height: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </div>
  );
}

