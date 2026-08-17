import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import {
  X,
  BarChart3,
  FileSpreadsheet,
} from 'lucide-react';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
  const lineOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#FFFFFF',
        borderColor: '#c9a265',
        borderWidth: 1,
        textStyle: { color: '#1C1917', fontFamily: 'Inter, sans-serif' },
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.08)',
      },
      legend: {
        data: ['Rondas Efetuadas', 'Ocorrências Registradas'],
        textStyle: { color: '#78716C' },
        top: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '18%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        axisLabel: { color: '#78716C' },
        axisLine: { lineStyle: { color: '#E7E5E4' } },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#F5F3EF', type: 'dashed' } },
        axisLabel: { color: '#A8A29E' },
      },
      series: [
        {
          name: 'Rondas Efetuadas',
          type: 'line',
          smooth: true,
          data: [16, 19, 18, 22, 24, 20, 18],
          itemStyle: { color: '#c9a265' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(201, 162, 101, 0.35)' },
              { offset: 1, color: 'rgba(201, 162, 101, 0.02)' },
            ]),
          },
        },
        {
          name: 'Ocorrências Registradas',
          type: 'line',
          smooth: true,
          data: [4, 6, 5, 8, 7, 3, 7],
          itemStyle: { color: '#DC2626' },
        },
      ],
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E7E5E4] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E7E5E4] bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#FDF8EE] border border-[#c9a265] flex items-center justify-center text-[#8c6a38]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C1917] font-serif">
                Relatórios Executivos & Analytics de Segurança
              </h3>
              <p className="text-xs text-[#78716C]">
                Consolidado Mensal &bull; Café Três Corações
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1C1917] rounded-lg hover:bg-[#F5F3EF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#F9F9F8]">
          {/* Summary metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E7E5E4] shadow-xs">
              <p className="text-xs text-[#78716C] font-semibold">Índice de Resolução SLA</p>
              <p className="text-2xl font-bold text-[#1C1917] mt-1 font-serif">98.4%</p>
              <p className="text-[11px] text-[#16A34A] font-semibold mt-1">+2.1% acima da meta</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E7E5E4] shadow-xs">
              <p className="text-xs text-[#78716C] font-semibold">Tempo Médio de Atendimento</p>
              <p className="text-2xl font-bold text-[#1C1917] mt-1 font-serif">4.2 min</p>
              <p className="text-[11px] text-[#8c6a38] font-semibold mt-1">-45s vs mês anterior</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E7E5E4] shadow-xs">
              <p className="text-xs text-[#78716C] font-semibold">Auditorias de Perímetro</p>
              <p className="text-2xl font-bold text-[#1C1917] mt-1 font-serif">100%</p>
              <p className="text-[11px] text-[#16A34A] font-semibold mt-1">Conformidade total</p>
            </div>
          </div>

          {/* ECharts Trend Graph */}
          <div className="bg-white p-4 rounded-xl border border-[#E7E5E4] shadow-xs">
            <h4 className="text-xs font-bold text-[#78716C] uppercase tracking-wider mb-2">
              Tendência Semanal: Rondas vs Ocorrências
            </h4>
            <div className="h-64 w-full">
              <ReactECharts option={lineOption} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E7E5E4] bg-[#FAF8F5] flex justify-between items-center text-xs">
          <button
            onClick={() => alert('Exportando relatório consolidado em PDF / CSV.')}
            className="px-4 py-2 bg-white hover:bg-[#F5F3EF] text-[#8c6a38] rounded-lg border border-[#E7E5E4] flex items-center space-x-2 transition-all font-semibold cursor-pointer shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Relatório (PDF / XLS)</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-[#c9a265] to-[#dfbe85] text-[#1C1917] rounded-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity text-xs cursor-pointer shadow-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
