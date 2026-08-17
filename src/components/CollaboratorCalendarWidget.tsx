import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Sparkles } from 'lucide-react';
import { Collaborator, DayStatus } from '../pages/Colaboradores';

export type CalendarBrushType = DayStatus | 'clear' | null;

interface CollaboratorCalendarWidgetProps {
  collaborator: Collaborator;
  month: number; // 0-11 (7 = August)
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedDay: number;
  onSelectDay: (day: number) => void;
  onSetStatus?: (day: number, status: DayStatus | null) => void;
  selectedStatusBrush?: CalendarBrushType;
}

const MONTH_NAMES_UPPER = [
  'JANEIRO',
  'FEVEREIRO',
  'MARÇO',
  'ABRIL',
  'MAIO',
  'JUNHO',
  'JULHO',
  'AGOSTO',
  'SETEMBRO',
  'OUTUBRO',
  'NOVEMBRO',
  'DEZEMBRO',
];

const WEEK_DAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

export const CollaboratorCalendarWidget: React.FC<CollaboratorCalendarWidgetProps> = ({
  collaborator,
  month,
  year,
  onPrevMonth,
  onNextMonth,
  selectedDay,
  onSelectDay,
  onSetStatus,
  selectedStatusBrush,
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Month calculations
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Trailing days from previous month
  const prevMonthDays: number[] = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    prevMonthDays.push(daysInPrevMonth - i);
  }

  // Current month days
  const currentMonthDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

  // Leading days from next month to fill grid (typically 35 or 42 cells total)
  const totalCellsSoFar = prevMonthDays.length + currentMonthDays.length;
  const targetTotalCells = totalCellsSoFar > 35 ? 42 : 35;
  const nextMonthDaysCount = targetTotalCells - totalCellsSoFar;
  const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => i + 1);

  // Helper to get status for a given day in current month
  const getDayStatus = (day: number): DayStatus | null => {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const mStr = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const key = `${year}-${mStr}-${dayStr}`;
    return collaborator.attendance[key] || null;
  };

  const handleCellClick = (day: number) => {
    onSelectDay(day);
    if (selectedStatusBrush && onSetStatus) {
      if (selectedStatusBrush === 'clear') {
        onSetStatus(day, null);
      } else {
        onSetStatus(day, selectedStatusBrush);
      }
    }
  };

  // Status indicators color map
  const getStatusColor = (status: DayStatus | null) => {
    if (!status) return null;
    switch (status) {
      case 'trabalhou':
        return '#10b981'; // Green
      case 'folga':
        return '#ec4899'; // Pink
      case 'atestado':
        return '#eab308'; // Yellow
      case 'falta':
        return '#ef4444'; // Red
      case 'ferias':
        return '#3b82f6'; // Blue
      default:
        return null;
    }
  };

  // Check if day has an anniversary / birthday
  const hasNotificationDot = (day: number) => {
    if (collaborator.birthDate) {
      const parts = collaborator.birthDate.split('/');
      if (parts.length >= 2 && parseInt(parts[0], 10) === day && parseInt(parts[1], 10) === month + 1) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="w-full max-w-[340px] sm:max-w-[370px] mx-auto select-none rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-[#3b2d1f]/40 bg-[#FAF6F0] transition-all">
      {/* ======================================================== */}
      {/* 1. DARK CHOCOLATE / ESPRESSO HEADER                      */}
      {/* ======================================================== */}
      <div className="bg-[#1C140E] px-4 py-2.5 sm:py-3 flex items-center justify-between border-b border-[#2d2016]">
        {/* Left Arrow Button */}
        <button
          onClick={onPrevMonth}
          className="p-1 rounded-full text-[#FAF6F0]/80 hover:text-[#c9a265] hover:bg-[#2d2016] transition-colors cursor-pointer"
          title="Mês Anterior"
          aria-label="Mês Anterior"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Month & Year Title */}
        <div className="text-center">
          <h2 className="text-[#FFFDF9] font-black text-xs sm:text-sm tracking-[0.15em] uppercase font-sans">
            {MONTH_NAMES_UPPER[month]} / {year}
          </h2>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={onNextMonth}
          className="p-1 rounded-full text-[#FAF6F0]/80 hover:text-[#c9a265] hover:bg-[#2d2016] transition-colors cursor-pointer"
          title="Próximo Mês"
          aria-label="Próximo Mês"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. CALENDAR BODY (WARM CREAM / IVORY CANVAS)             */}
      {/* ======================================================== */}
      <div className="p-3 sm:p-4 bg-[#FAF6F0]">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 text-center mb-1.5 sm:mb-2">
          {WEEK_DAYS.map((wd) => (
            <div
              key={wd}
              className="text-[#96724B] font-extrabold text-[10px] sm:text-[11px] tracking-wider uppercase font-sans"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-1 sm:gap-y-1.5 gap-x-1 text-center">
          {/* Previous Month Days (Faded / Inactive) */}
          {prevMonthDays.map((d) => (
            <div
              key={`prev-${d}`}
              className="flex flex-col items-center justify-center py-0.5 opacity-35 select-none"
            >
              <span className="text-[#B5ACA0] font-semibold text-[11px] sm:text-xs font-sans">{d}</span>
              <div className="h-[2.5px] w-4 mt-0.5" />
            </div>
          ))}

          {/* Current Month Days */}
          {currentMonthDays.map((day) => {
            const isSelected = selectedDay === day;
            const status = getDayStatus(day);
            const showDot = hasNotificationDot(day);
            const indicatorColor = getStatusColor(status);
            const isWork = status === 'trabalhou';

            return (
              <button
                key={`cur-${day}`}
                onClick={() => handleCellClick(day)}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className="group relative flex flex-col items-center justify-center py-0.5 outline-none cursor-pointer"
              >
                {/* Number Container (Circle ring on selected day like Day 17) */}
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-6 h-6 sm:w-6.5 sm:h-6.5 flex items-center justify-center rounded-full transition-all ${
                      isSelected
                        ? 'border-[1.5px] border-[#B89255] bg-transparent text-[#1F1710] shadow-sm font-black scale-105'
                        : 'text-[#231A13] font-bold hover:bg-[#ece4d6]/60 font-sans'
                    }`}
                  >
                    <span className="text-[11.5px] sm:text-xs leading-none">{day}</span>
                  </div>

                  {/* Red Notification Dot (e.g. Day 19 in screenshot) */}
                  {showDot && (
                    <span
                      className="absolute -top-0.5 -right-1 w-1.5 h-1.5 rounded-full bg-[#B91C1C] ring-2 ring-[#FAF6F0] shadow-sm animate-pulse"
                      title="Observação / Evento"
                    />
                  )}
                </div>

                {/* Status Indicator Underline Bar (renders only when status is marked) */}
                <div className="mt-0.5 h-[2.5px] flex items-center justify-center w-full">
                  {status && indicatorColor && (
                    <span
                      className="h-[2.5px] w-3.5 sm:w-4 rounded-full transition-all group-hover:w-5"
                      style={{ backgroundColor: indicatorColor }}
                    />
                  )}
                </div>
              </button>
            );
          })}

          {/* Next Month Days (Faded / Inactive) */}
          {nextMonthDays.map((d) => (
            <div
              key={`next-${d}`}
              className="flex flex-col items-center justify-center py-0.5 opacity-35 select-none"
            >
              <span className="text-[#B5ACA0] font-semibold text-[11px] sm:text-xs font-sans">{d}</span>
              <div className="h-[2.5px] w-4 mt-0.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
