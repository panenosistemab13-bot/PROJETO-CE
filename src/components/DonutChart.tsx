import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { ChevronRight } from 'lucide-react';

interface DonutChartProps {
  onOpenReports?: () => void;
}

export function DonutChart({ onOpenReports }: DonutChartProps) {
  const option = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#151b26',
        borderColor: '#c9a265',
        borderWidth: 1,
        padding: [6, 10],
        textStyle: {
          color: '#f1f5f9',
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
        },
        formatter: (params: any) => {
          return `<div>
            <span style="color:#c9a265;font-weight:bold;">${params.name}</span>: ${params.percent}% (${params.value})
          </div>`;
        },
      },
      series: [
        {
          name: 'Ocorrências',
          type: 'pie',
          radius: ['68%', '90%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 3,
            borderColor: '#151b26',
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          emphasis: {
            scale: false,
          },
          data: [
            {
              value: 1,
              name: 'Nenhuma ocorrência',
              itemStyle: { color: '#1f2737' },
            },
          ],
        },
      ],
    };
  }, []);

  const legendData = [
    { label: 'Segurança Patrimonial', pct: '0%', color: '#c9a265' },
    { label: 'Trânsito', pct: '0%', color: '#3b82f6' },
    { label: 'Manutenção', pct: '0%', color: '#0ea5e9' },
    { label: 'Comportamental', pct: '0%', color: '#854d0e' },
    { label: 'Outros', pct: '0%', color: '#94a3b8' },
  ];

  return (
    <div className="bg-[#151b26] border border-[#1f2737] hover:border-[#c9a265]/50 rounded-2xl p-5 flex flex-col justify-between h-full min-h-[350px] shadow-xl transition-all relative">
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#c9a265] animate-pulse"></span>
          <h3 className="text-xs font-bold text-[#f1f5f9] uppercase tracking-wider">
            ANÁLISE DE OCORRÊNCIAS
          </h3>
        </div>

        {/* Donut Chart with Center Total 0 */}
        <div className="flex flex-col items-center justify-center my-1">
          <div className="w-36 h-36 relative flex-shrink-0">
            <ReactECharts
              option={option}
              style={{ width: '100%', height: '100%' }}
              opts={{ renderer: 'svg' }}
            />
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl 2xl:text-3xl font-extrabold text-white font-sans leading-none">
                00
              </span>
              <span className="text-[9px] text-[#94a3b8] tracking-widest uppercase font-semibold mt-0.5">
                TOTAL
              </span>
            </div>
          </div>
        </div>

        {/* Legend List */}
        <div className="mt-3 space-y-1.5 px-1">
          {legendData.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-xs"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[#cbd5e1] text-[11px] font-medium">{item.label}</span>
              </div>
              <span className="text-white text-[11px] font-bold">{item.pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Link */}
      <button
        onClick={onOpenReports}
        className="w-full mt-3 pt-2.5 border-t border-[#1f2737] flex items-center justify-between text-[11px] font-semibold text-[#c9a265] hover:text-[#dfbe85] transition-colors cursor-pointer group"
      >
        <span>VER RELATÓRIO COMPLETO</span>
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}

