import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { KpiCards } from '../components/KpiCards';
import { InteractiveMap } from '../components/InteractiveMap';
import { DonutChart } from '../components/DonutChart';
import { TeamPerformanceBarChart } from '../components/TeamPerformanceBarChart';
import { RecentActivities } from '../components/RecentActivities';

interface MenuInicialProps {
  onKpiClick: (type: string) => void;
  onOpenAnalytics: () => void;
}

export function MenuInicial({ onKpiClick, onOpenAnalytics }: MenuInicialProps) {
  return (
    <div className="max-w-[2560px] mx-auto flex flex-col gap-5 2xl:gap-6 relative z-10">
      {/* Hero Banner with 4K Sunset Ocean & Cup */}
      <HeroBanner />

      {/* 5 KPI Metric Cards */}
      <KpiCards onCardClick={onKpiClick} />

      {/* Middle Row: Interactive Map (id="3d-map-container") + Occurrence Donut (ECharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 2xl:gap-6 min-h-[350px]">
        <InteractiveMap />
        <DonutChart onOpenReports={onOpenAnalytics} />
      </div>

      {/* Bottom Row (2 Columns): Team Bar Chart (ECharts), Recent Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 2xl:gap-6">
        <TeamPerformanceBarChart />
        <RecentActivities
          onSelectActivity={(act) => {
            alert(`Atividade: ${act.title}\nDetalhes: ${act.subtitle}`);
          }}
        />
      </div>
    </div>
  );
}
