import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import ReactECharts from 'echarts-for-react';
import {
  Search,
  Plus,
  Users,
  Calendar as CalendarIcon,
  Cake,
  Heart,
  User,
  ShieldCheck,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Filter,
  Sparkles,
  Award,
  Bell,
  Check,
  Send,
  Printer,
  CalendarCheck,
  CalendarDays,
  FileSpreadsheet,
  Building2,
  LayoutGrid,
  Table as TableIcon,
  Info,
  Compass,
  RotateCw,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Move3D,
  Eraser,
  RotateCcw,
} from 'lucide-react';
import bgEdificioJoaoLima from '../assets/images/edificio_joao_lima_360_1786970922827.jpg';
import bgEdificioJoaoLimaSede from '../assets/images/edificio_joao_lima_sede_1786970968314.jpg';
import { ThreePanorama } from '../components/ThreePanorama';
import { CollaboratorCalendarWidget } from '../components/CollaboratorCalendarWidget';
import { LateralGoldScrollbar } from '../components/LateralGoldScrollbar';

export type DayStatus = 'trabalhou' | 'falta' | 'folga' | 'atestado' | 'ferias';

export interface Collaborator {
  id: string;
  registration: string; // MATRICULA
  name: string; // COLABORADOR
  role: string; // FUNCAO
  admissionDate: string; // ADMISSÃO
  birthDate: string; // NASCIMENTO
  isMother: boolean; // MÃE
  isFather: boolean; // PAI
  attendance: Record<string, DayStatus>; // key: "YYYY-MM-DD" => DayStatus
}

// Generate standard initial attendance for the month (clean initial state)
const generateInitialAttendance = (): Record<string, DayStatus> => {
  return {};
};

// Initial roster matching the company spreadsheet
const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    id: '1',
    registration: '1-10467',
    name: 'AIRTON CARVALHO LEITE',
    role: '',
    admissionDate: '01/12/2022',
    birthDate: '3/2/2001',
    isMother: false,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '2',
    registration: '1-09954',
    name: 'AMANDA SHERYDA LEITE FREITAS PEREIRA',
    role: '',
    admissionDate: '03/05/2022',
    birthDate: '12/9/1998',
    isMother: false,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '3',
    registration: '1-10624',
    name: 'ANA KAYLANNE PEREIRA FREIRE',
    role: '',
    admissionDate: '17/04/2023',
    birthDate: '7/7/2003',
    isMother: false,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '4',
    registration: '1-10784',
    name: 'ANA PAULA SANTOS DA SILVA',
    role: '',
    admissionDate: '18/09/2023',
    birthDate: '24/11/1993',
    isMother: true,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '5',
    registration: '1-09437',
    name: 'ANTONIO JAIRO VIEIRA DOS SANTOS',
    role: '',
    admissionDate: '04/01/2021',
    birthDate: '26/8/1981',
    isMother: false,
    isFather: true,
    attendance: generateInitialAttendance(),
  },
  {
    id: '6',
    registration: '1-06838',
    name: 'CAMILA VALESKA DA SILVA CARLOS GONÇALVES',
    role: '',
    admissionDate: '22/01/2019',
    birthDate: '24/5/1994',
    isMother: true,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '7',
    registration: '1-06126',
    name: 'CRISTIANE DE OLIVEIRA FIALHO',
    role: 'OP MONIT ELETRONICO',
    admissionDate: '16/08/2016',
    birthDate: '7/12/1983',
    isMother: false,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '8',
    registration: '1-06657',
    name: 'DIEGO OLIVEIRA SOUZA',
    role: 'OP MONIT ELETRONICO',
    admissionDate: '19/06/2018',
    birthDate: '29/6/1989',
    isMother: false,
    isFather: true,
    attendance: generateInitialAttendance(),
  },
  {
    id: '9',
    registration: '1-06915',
    name: 'FLAVIA MARIA LIMA ASEVEDO PRUDENTE',
    role: '',
    admissionDate: '16/04/2019',
    birthDate: '6/8/1988',
    isMother: true,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '10',
    registration: '1-06070',
    name: 'FRANCISCO PINHEIRO NETO',
    role: 'OP MONIT ELETRONICO',
    admissionDate: '13/06/2016',
    birthDate: '17/6/1964',
    isMother: false,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '11',
    registration: '1-09523',
    name: 'GABRIEL VITOR BARROS LIMA',
    role: '',
    admissionDate: '15/03/2021',
    birthDate: '22/5/2001',
    isMother: true,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '12',
    registration: '1-10837',
    name: 'GABRIELE FREIRE DE ALBUQUERQUE',
    role: '',
    admissionDate: '16/10/2023',
    birthDate: '31/03/1988',
    isMother: false,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '13',
    registration: '1-11429',
    name: 'HARLEY NOGUEIRA DE CASTRO',
    role: '',
    admissionDate: '16/04/2025',
    birthDate: '19/05/1988',
    isMother: false,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '14',
    registration: '1-09847',
    name: 'IGOR DE SOUSA PESTANA',
    role: '',
    admissionDate: '18/01/2022',
    birthDate: '10/4/2001',
    isMother: false,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '15',
    registration: '1-10933',
    name: 'JOSE ERIELITON DA SILVA',
    role: '',
    admissionDate: '05/02/2024',
    birthDate: '4/12/1991',
    isMother: false,
    isFather: true,
    attendance: generateInitialAttendance(),
  },
  {
    id: '16',
    registration: '1-11153',
    name: 'JÚLIA BARROS ALVES',
    role: '',
    admissionDate: '09/02/2024',
    birthDate: '8/10/1999',
    isMother: false,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '17',
    registration: '1-10591',
    name: 'KARINE FERNANDES SOUSA',
    role: '',
    admissionDate: '20/03/2023',
    birthDate: '13/05/2002',
    isMother: false,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '18',
    registration: '1-09723',
    name: 'KLEYTON ALENCAR VIDAL',
    role: '',
    admissionDate: '10/05/2021',
    birthDate: '5/2/1997',
    isMother: false,
    isFather: true,
    attendance: generateInitialAttendance(),
  },
  {
    id: '19',
    registration: '1-10695',
    name: 'LUCAS ALVES DA CRUZ',
    role: '',
    admissionDate: '19/06/2023',
    birthDate: '12/12/1997',
    isMother: false,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '20',
    registration: '1-06087',
    name: 'LUZIA DE OLIVEIRA FREITAS GOMES',
    role: 'ASSIST MONIT ELETRONICO',
    admissionDate: '13/06/2016',
    birthDate: '23/8/1988',
    isMother: true,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '21',
    registration: '1-09570',
    name: 'MATHEUS FREITAS DA MATA',
    role: '',
    admissionDate: '10/05/2021',
    birthDate: '7/5/2000',
    isMother: false,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '22',
    registration: '1-10509',
    name: 'MYLENA DA COSTA VIEIRA',
    role: '',
    admissionDate: '09/01/2023',
    birthDate: '23/3/2003',
    isMother: false,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '23',
    registration: '1-10328',
    name: 'FRANCISCO IGOR COUTINHO DE FREITAS',
    role: '',
    admissionDate: '06/09/2022',
    birthDate: '19/8/1997',
    isMother: false,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '24',
    registration: '1-11630',
    name: 'RENATA MARTINS DE BRITO ISACKSSON',
    role: '',
    admissionDate: '',
    birthDate: '',
    isMother: true,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
  {
    id: '25',
    registration: '1-11582',
    name: 'RAFAELA ALVES FERREIRA DE LIMA',
    role: '',
    admissionDate: '',
    birthDate: '',
    isMother: true,
    isFather: false,
    attendance: generateInitialAttendance(),
  },
];

// Helper to parse birthdate string into { day, month }
const parseBirthDate = (dateStr: string): { day: number; month: number } | null => {
  if (!dateStr || !dateStr.trim()) return null;
  const parts = dateStr.trim().split('/');
  if (parts.length >= 2) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    if (!isNaN(day) && !isNaN(month)) {
      return { day, month };
    }
  }
  return null;
};

// Status Colors & Label Mapping
export const STATUS_CONFIG: Record<
  DayStatus,
  { label: string; bg: string; text: string; border: string; badge: string; hex: string }
> = {
  trabalhou: {
    label: 'Trabalhou',
    bg: 'bg-[#22c55e]',
    text: 'text-[#22c55e]',
    border: 'border-[#22c55e]/60',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    hex: '#22c55e',
  },
  falta: {
    label: 'Falta',
    bg: 'bg-[#ef4444]',
    text: 'text-[#ef4444]',
    border: 'border-[#ef4444]/60',
    badge: 'bg-red-500/20 text-red-300 border-red-500/50',
    hex: '#ef4444',
  },
  folga: {
    label: 'Folga',
    bg: 'bg-[#ec4899]',
    text: 'text-[#ec4899]',
    border: 'border-[#ec4899]/60',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500/50',
    hex: '#ec4899',
  },
  atestado: {
    label: 'Atestado',
    bg: 'bg-[#eab308]',
    text: 'text-[#eab308]',
    border: 'border-[#eab308]/60',
    badge: 'bg-amber-400/20 text-amber-300 border-amber-400/50',
    hex: '#eab308',
  },
  ferias: {
    label: 'Férias',
    bg: 'bg-[#3b82f6]',
    text: 'text-[#3b82f6]',
    border: 'border-[#3b82f6]/60',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    hex: '#3b82f6',
  },
};

export function Colaboradores() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'monitoring' | 'mothers' | 'fathers' | 'birthdays_month' | 'birthdays_today'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [hideContent, setHideContent] = useState(false);
  const [activePanorama, setActivePanorama] = useState<'edificio_joao_lima' | 'edificio_joao_lima_sede'>('edificio_joao_lima');

  // Selected collaborator for Individual Calendar Modal
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<number>(7); // 0-indexed: 7 is August
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(17);
  const [selectedStatusBrush, setSelectedStatusBrush] = useState<DayStatus | 'clear' | null>(null);
  const [openDropdownDay, setOpenDropdownDay] = useState<number | null>(null);

  // 360 Panorama state inside calendar modal
  const [calendar360Mode, setCalendar360Mode] = useState<boolean>(false);
  const [calendarBgOpacity, setCalendarBgOpacity] = useState<'focused' | 'translucent' | 'ultra'>('focused');
  const [autoRotate360, setAutoRotate360] = useState<boolean>(true);
  const [calendarZoomScale, setCalendarZoomScale] = useState<number>(1.0);

  // Modal State for Add / Edit
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    registration: string;
    name: string;
    role: string;
    admissionDate: string;
    birthDate: string;
    isMother: boolean;
    isFather: boolean;
  }>({
    registration: '',
    name: '',
    role: '',
    admissionDate: '',
    birthDate: '',
    isMother: false,
    isFather: false,
  });

  // Birthday celebration modal
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);

  // Reference Date: August 17, 2026
  const currentDay = 17;
  const currentMonth = 8;

  // Birthdays metrics
  const birthdaysToday = useMemo(() => {
    return collaborators.filter((c) => {
      const parsed = parseBirthDate(c.birthDate);
      return parsed && parsed.day === currentDay && parsed.month === currentMonth;
    });
  }, [collaborators]);

  const birthdaysThisMonth = useMemo(() => {
    return collaborators.filter((c) => {
      const parsed = parseBirthDate(c.birthDate);
      return parsed && parsed.month === currentMonth;
    });
  }, [collaborators]);

  // Filtered List
  const filteredList = useMemo(() => {
    return collaborators.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.registration.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.admissionDate.toLowerCase().includes(q) ||
        c.birthDate.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filterType === 'monitoring') {
        return c.role.includes('MONIT') || c.role.includes('MONITORAMENTO');
      }
      if (filterType === 'mothers') {
        return c.isMother;
      }
      if (filterType === 'fathers') {
        return c.isFather;
      }
      if (filterType === 'birthdays_month') {
        const parsed = parseBirthDate(c.birthDate);
        return parsed && parsed.month === currentMonth;
      }
      if (filterType === 'birthdays_today') {
        const parsed = parseBirthDate(c.birthDate);
        return parsed && parsed.day === currentDay && parsed.month === currentMonth;
      }

      return true;
    });
  }, [collaborators, searchQuery, filterType]);

  // CRUD
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      registration: '',
      name: '',
      role: '',
      admissionDate: '',
      birthDate: '',
      isMother: false,
      isFather: false,
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (colab: Collaborator) => {
    setEditingId(colab.id);
    setFormData({
      registration: colab.registration,
      name: colab.name,
      role: colab.role,
      admissionDate: colab.admissionDate,
      birthDate: colab.birthDate,
      isMother: colab.isMother,
      isFather: colab.isFather,
    });
    setIsFormModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Confirma a exclusão de "${name}" do quadro de colaboradores?`)) {
      setCollaborators((prev) => prev.filter((item) => item.id !== id));
      if (selectedCollaborator?.id === id) {
        setSelectedCollaborator(null);
      }
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      setCollaborators((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                registration: formData.registration.trim().toUpperCase(),
                name: formData.name.trim().toUpperCase(),
                role: formData.role.trim().toUpperCase(),
                admissionDate: formData.admissionDate.trim(),
                birthDate: formData.birthDate.trim(),
                isMother: formData.isMother,
                isFather: formData.isFather,
              }
            : item
        )
      );
      if (selectedCollaborator && selectedCollaborator.id === editingId) {
        setSelectedCollaborator((prev) =>
          prev
            ? {
                ...prev,
                registration: formData.registration.trim().toUpperCase(),
                name: formData.name.trim().toUpperCase(),
                role: formData.role.trim().toUpperCase(),
                admissionDate: formData.admissionDate.trim(),
                birthDate: formData.birthDate.trim(),
                isMother: formData.isMother,
                isFather: formData.isFather,
              }
            : null
        );
      }
    } else {
      const newColab: Collaborator = {
        id: crypto.randomUUID(),
        registration: formData.registration.trim().toUpperCase() || `1-${Math.floor(10000 + Math.random() * 90000)}`,
        name: formData.name.trim().toUpperCase(),
        role: formData.role.trim().toUpperCase(),
        admissionDate: formData.admissionDate.trim(),
        birthDate: formData.birthDate.trim(),
        isMother: formData.isMother,
        isFather: formData.isFather,
        attendance: generateInitialAttendance(),
      };
      setCollaborators((prev) => [newColab, ...prev]);
    }

    setIsFormModalOpen(false);
  };

  // Calendar day status assignment (or deletion if null)
  const handleSetDayStatus = (day: number, status: DayStatus | null) => {
    if (!selectedCollaborator) return;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const mStr = calendarMonth + 1 < 10 ? `0${calendarMonth + 1}` : `${calendarMonth + 1}`;
    const dateKey = `${calendarYear}-${mStr}-${dayStr}`;

    const updatedAttendance = {
      ...selectedCollaborator.attendance,
    };

    if (status === null) {
      delete updatedAttendance[dateKey];
    } else {
      updatedAttendance[dateKey] = status;
    }

    const updatedColab = {
      ...selectedCollaborator,
      attendance: updatedAttendance,
    };

    setSelectedCollaborator(updatedColab);
    setCollaborators((prev) =>
      prev.map((c) => (c.id === selectedCollaborator.id ? updatedColab : c))
    );
    setOpenDropdownDay(null);
  };

  // Calendar Calculation for Selected Collaborator
  const calendarData = useMemo(() => {
    if (!selectedCollaborator) return null;

    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay(); // 0 = Sun
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];

    const counts: Record<DayStatus, number> = {
      trabalhou: 0,
      falta: 0,
      folga: 0,
      atestado: 0,
      ferias: 0,
    };

    let totalRecordedDays = 0;
    for (let d = 1; d <= totalDays; d++) {
      const dayStr = d < 10 ? `0${d}` : `${d}`;
      const mStr = calendarMonth + 1 < 10 ? `0${calendarMonth + 1}` : `${calendarMonth + 1}`;
      const key = `${calendarYear}-${mStr}-${dayStr}`;
      const st = selectedCollaborator.attendance[key];
      if (st && counts[st] !== undefined) {
        counts[st] = counts[st] + 1;
        totalRecordedDays += 1;
      }
    }

    return {
      monthName: monthNames[calendarMonth],
      firstDayIndex,
      totalDays,
      totalRecordedDays,
      counts,
    };
  }, [selectedCollaborator, calendarMonth, calendarYear]);

  // ECharts Configuration (Dark theme + #c9a265)
  const calendarChartOption = useMemo(() => {
    if (!calendarData) return {};
    const { counts, totalRecordedDays } = calendarData;

    const chartData = [
      { value: counts.trabalhou, name: 'Trabalhou', itemStyle: { color: '#22c55e' } },
      { value: counts.folga, name: 'Folga', itemStyle: { color: '#ec4899' } },
      { value: counts.atestado, name: 'Atestado', itemStyle: { color: '#eab308' } },
      { value: counts.falta, name: 'Falta', itemStyle: { color: '#ef4444' } },
      { value: counts.ferias, name: 'Férias', itemStyle: { color: '#3b82f6' } },
    ].filter((d) => d.value > 0);

    const hasData = chartData.length > 0;

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} dias ({d}%)',
        backgroundColor: '#0c1017',
        borderColor: '#c9a265',
        borderWidth: 1,
        textStyle: { color: '#ffffff', fontSize: 12 },
      },
      legend: {
        bottom: '0%',
        left: 'center',
        textStyle: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold' },
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 10,
      },
      series: [
        {
          name: 'Status da Escala',
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '42%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#0c1017',
            borderWidth: 2,
          },
          label: {
            show: hasData,
            position: 'outside',
            formatter: '{b}\n{c}d',
            color: '#dfbe85',
            fontSize: 10,
            fontWeight: 'bold',
          },
          labelLine: {
            show: hasData,
            length: 8,
            length2: 6,
            lineStyle: { color: 'rgba(201, 162, 101, 0.5)' },
          },
          data: hasData
            ? chartData
            : [
                {
                  value: 1,
                  name: 'Sem escala registrada',
                  itemStyle: { color: '#1e293b' },
                  label: {
                    show: true,
                    position: 'center',
                    formatter: 'Sem registros\nno mês',
                    color: '#64748b',
                    fontSize: 11,
                    fontWeight: 'bold',
                  },
                },
              ],
        },
      ],
    };
  }, [calendarData]);

  // Export CSV
  const handleExportSpreadsheet = () => {
    const headers = ['MATRICULA', 'COLABORADOR', 'FUNCAO', 'ADMISSÃO', 'NASCIMENTO', 'MÃE', 'PAI'];
    const rows = collaborators.map((c) => [
      `"${c.registration}"`,
      `"${c.name}"`,
      `"${c.role}"`,
      `"${c.admissionDate}"`,
      `"${c.birthDate}"`,
      `"${c.isMother ? 'SIM' : ''}"`,
      `"${c.isFather ? 'SIM' : ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `colaboradores_3coracoes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activePanoramaImage = activePanorama === 'edificio_joao_lima' ? bgEdificioJoaoLima : bgEdificioJoaoLimaSede;

  return (
    <div className="max-w-[2560px] mx-auto flex flex-col gap-5 relative z-10 select-none pb-16">
      {/* Lateral Golden Scrollbar matching the reference image */}
      <LateralGoldScrollbar />

      {/* 3D 360-Degree Panorama: Edifício João Lima (Grupo 3corações) */}
      <ThreePanorama imageUrl={activePanoramaImage} interactive={hideContent} />

      {/* Subtle vignette overlay without blurring the 3D panorama */}
      <div
        className={`fixed inset-0 z-[-1] pointer-events-none bg-gradient-to-t from-[#070a0f]/60 via-transparent to-[#070a0f]/40 transition-all duration-700 ${
          hideContent ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(201,162,101,0.03),transparent_90%)]" />

      {/* External 3D Hooks for Three.js / Spline Integrations */}
      <div id="3d-colaboradores-container" className="fixed left-0 top-0 bottom-0 w-1/4 pointer-events-none z-0" />
      <div id="3d-calendar-container" className="fixed right-0 top-0 bottom-0 w-1/4 pointer-events-none z-0" />
      <div id="3d-cup-container" className="fixed bottom-0 right-10 w-32 h-32 pointer-events-none z-0" />
      <div id="3d-map-container" className="fixed bottom-0 left-10 w-32 h-32 pointer-events-none z-0" />

      {/* ======================================================== */}
      {/* 1. TOP HEADER & EXECUTIVE ACTION CONTROLS                */}
      {/* ======================================================== */}
      <div
        className={`bg-[#0c1017]/95 border border-[#1e293b] rounded-2xl p-4 xl:p-5 shadow-2xl backdrop-blur-md transition-all duration-500 ${
          hideContent ? 'opacity-0 scale-95 pointer-events-none -translate-y-4' : ''
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Title and Identification */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#dfbe85] via-[#c9a265] to-[#8d6930] flex items-center justify-center shadow-lg shadow-[#c9a265]/20 border border-[#dfbe85]">
              <Users className="w-6 h-6 text-[#0c1017] stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="text-xl 2xl:text-2xl font-serif font-extrabold text-white tracking-wide">
                  Quadro de Colaboradores & Escalas
                </h1>
                <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full bg-[#c9a265]/20 border border-[#c9a265] text-[#dfbe85] font-bold flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#c9a265]" /> Edifício João Lima
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Gestão centralizada de efetivo, presença individual, escalas operacionais e aniversariantes • Grupo 3corações
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center flex-wrap gap-2.5 w-full lg:w-auto justify-end">
            {/* 360 Panorama Selector */}
            <div className="flex items-center bg-[#131924] border border-[#2d3748] p-1 rounded-xl shadow-inner">
              <button
                onClick={() => setActivePanorama('edificio_joao_lima')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activePanorama === 'edificio_joao_lima'
                    ? 'bg-gradient-to-r from-[#dfbe85] to-[#c9a265] text-[#0c1017] shadow-sm'
                    : 'text-slate-300 hover:text-[#dfbe85]'
                }`}
                title="Ambiente 360° Lobby Executivo Edifício João Lima"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Ed. João Lima 3D</span>
              </button>
              <button
                onClick={() => setActivePanorama('edificio_joao_lima_sede')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activePanorama === 'edificio_joao_lima_sede'
                    ? 'bg-gradient-to-r from-[#dfbe85] to-[#c9a265] text-[#0c1017] shadow-sm'
                    : 'text-slate-300 hover:text-[#dfbe85]'
                }`}
                title="Ambiente 360° Fachada Sede"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fachada Sede 3D</span>
              </button>
            </div>

            <button
              onClick={handleExportSpreadsheet}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#131924] hover:bg-[#1a2332] border border-[#2d3748] hover:border-[#c9a265] text-slate-200 hover:text-[#dfbe85] transition-all text-xs font-bold cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#c9a265]" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:from-[#ebd3a8] hover:via-[#dcb67d] hover:to-[#b58d4e] text-[#0f0b04] font-extrabold transition-all shadow-lg shadow-[#c9a265]/20 text-xs uppercase tracking-wider cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Novo Colaborador</span>
            </button>

            <button
              onClick={() => setHideContent(!hideContent)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-black/80 hover:bg-black/95 border border-[#c9a265]/70 hover:border-[#c9a265] text-[#dfbe85] hover:text-white transition-all shadow-md cursor-pointer text-xs font-bold uppercase tracking-wider"
            >
              {hideContent ? <Eye className="w-4 h-4 text-[#c9a265] animate-pulse" /> : <EyeOff className="w-4 h-4 text-[#c9a265]" />}
              <span>{hideContent ? 'Painel' : 'Visão 360°'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. EXECUTIVE METRICS CARDS (CLEAN & SPACIOUS)            */}
      {/* ======================================================== */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 transition-all duration-500 ${
          hideContent ? 'opacity-0 scale-95 pointer-events-none -translate-y-4' : ''
        }`}
      >
        {/* Total Colaboradores */}
        <div
          onClick={() => setFilterType('all')}
          className={`p-4 rounded-xl border transition-all cursor-pointer group bg-[#0c1017]/90 backdrop-blur-md ${
            filterType === 'all'
              ? 'border-[#c9a265] shadow-lg shadow-[#c9a265]/15 ring-1 ring-[#c9a265]'
              : 'border-[#1e293b] hover:border-[#334155]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Efetivo</span>
            <div className="w-8 h-8 rounded-lg bg-[#c9a265]/15 border border-[#c9a265]/40 flex items-center justify-center text-[#dfbe85]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white font-mono">{collaborators.length}</span>
            <span className="text-xs text-slate-400 font-semibold">colaboradores ativos</span>
          </div>
        </div>

        {/* Op. Monitoramento */}
        <div
          onClick={() => setFilterType('monitoring')}
          className={`p-4 rounded-xl border transition-all cursor-pointer group bg-[#0c1017]/90 backdrop-blur-md ${
            filterType === 'monitoring'
              ? 'border-amber-500 shadow-lg shadow-amber-500/15 ring-1 ring-amber-500'
              : 'border-[#1e293b] hover:border-[#334155]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Op. Monitoramento</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white font-mono">
              {collaborators.filter((c) => c.role.includes('MONIT')).length}
            </span>
            <span className="text-xs text-slate-400 font-semibold">operadores / assistentes</span>
          </div>
        </div>

        {/* Aniversariantes do Mês / Hoje */}
        <div
          onClick={() => setIsBirthdayModalOpen(true)}
          className="p-4 rounded-xl border border-pink-500/50 hover:border-pink-500 bg-gradient-to-br from-[#1b1220]/90 to-[#0c1017]/90 backdrop-blur-md transition-all cursor-pointer group shadow-lg shadow-pink-500/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-pink-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Cake className="w-3.5 h-3.5 text-pink-400" /> Aniversariantes
            </span>
            <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-bold">
              Agosto
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-pink-400 font-mono">{birthdaysThisMonth.length}</span>
              <span className="text-xs text-slate-300 font-semibold">no mês</span>
            </div>
            {birthdaysToday.length > 0 ? (
              <span className="px-2 py-0.5 rounded bg-pink-500 text-[10px] font-extrabold text-white animate-pulse">
                {birthdaysToday.length} HOJE!
              </span>
            ) : (
              <span className="text-[11px] text-pink-400 font-semibold underline">Ver lista</span>
            )}
          </div>
        </div>

        {/* Família 3 Corações (Mães & Pais) */}
        <div
          onClick={() => setFilterType('mothers')}
          className={`p-4 rounded-xl border transition-all cursor-pointer group bg-[#0c1017]/90 backdrop-blur-md ${
            filterType === 'mothers' || filterType === 'fathers'
              ? 'border-purple-500 shadow-lg shadow-purple-500/15 ring-1 ring-purple-500'
              : 'border-[#1e293b] hover:border-[#334155]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Família 3 Corações</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-center space-x-4">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-bold text-pink-400 font-mono">
                {collaborators.filter((c) => c.isMother).length}
              </span>
              <span className="text-xs text-slate-400 font-medium">Mães</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-bold text-blue-400 font-mono">
                {collaborators.filter((c) => c.isFather).length}
              </span>
              <span className="text-xs text-slate-400 font-medium">Pais</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. TOOLBAR: SEARCH, FILTERS & VIEW MODE                  */}
      {/* ======================================================== */}
      <div
        className={`bg-[#0c1017]/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#1e293b] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xl transition-all duration-500 ${
          hideContent ? 'opacity-0 scale-95 pointer-events-none translate-y-4' : ''
        }`}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-[#c9a265] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por colaborador, matrícula (ex: 1-10467), cargo ou data..."
            className="w-full bg-[#131924] border border-[#2a3447] focus:border-[#c9a265] text-white text-xs font-medium pl-10 pr-8 py-2.5 rounded-xl placeholder-slate-400 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills & View Switch */}
        <div className="flex items-center flex-wrap gap-1.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-gradient-to-r from-[#dfbe85] to-[#c9a265] text-[#0c1017] shadow-sm'
                : 'bg-[#151c28] text-slate-300 hover:text-white border border-[#2d3748]'
            }`}
          >
            Todos ({collaborators.length})
          </button>
          <button
            onClick={() => setFilterType('monitoring')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'monitoring'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-[#151c28] text-slate-300 hover:text-white border border-[#2d3748]'
            }`}
          >
            Monitoramento ({collaborators.filter((c) => c.role.includes('MONIT')).length})
          </button>
          <button
            onClick={() => setFilterType('mothers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'mothers'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'bg-[#151c28] text-slate-300 hover:text-white border border-[#2d3748]'
            }`}
          >
            Mães ({collaborators.filter((c) => c.isMother).length})
          </button>
          <button
            onClick={() => setFilterType('fathers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'fathers'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-[#151c28] text-slate-300 hover:text-white border border-[#2d3748]'
            }`}
          >
            Pais ({collaborators.filter((c) => c.isFather).length})
          </button>
          <button
            onClick={() => setFilterType('birthdays_month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'birthdays_month'
                ? 'bg-purple-500 text-white shadow-sm'
                : 'bg-[#151c28] text-slate-300 hover:text-white border border-[#2d3748]'
            }`}
          >
            Aniversários Mês ({birthdaysThisMonth.length})
          </button>

          {/* View Switch */}
          <div className="flex items-center bg-[#151c28] border border-[#2d3748] p-0.5 rounded-lg ml-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'table' ? 'bg-[#c9a265] text-[#0c1017]' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Tabela"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid' ? 'bg-[#c9a265] text-[#0c1017]' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Cards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MAIN CONTENT (TABLE OR GRID)                          */}
      {/* ======================================================== */}
      {viewMode === 'table' ? (
        <div
          className={`bg-[#0c1017]/95 backdrop-blur-md rounded-2xl border border-[#1e293b] shadow-2xl overflow-hidden transition-all duration-500 ${
            hideContent ? 'opacity-0 scale-95 pointer-events-none translate-y-4' : ''
          }`}
        >
          <div className="overflow-x-auto custom-scroll">
            <table className="w-full text-left border-collapse min-w-[1050px]">
              <thead>
                <tr className="bg-gradient-to-r from-[#171e2b] via-[#1a2332] to-[#171e2b] text-[#dfbe85] font-extrabold text-xs tracking-wider uppercase border-b border-[#2d3748]">
                  <th className="py-4 px-4 text-center w-28 font-mono">MATRÍCULA</th>
                  <th className="py-4 px-5">COLABORADOR</th>
                  <th className="py-4 px-4">FUNÇÃO</th>
                  <th className="py-4 px-4 text-center">ADMISSÃO</th>
                  <th className="py-4 px-4 text-center">NASCIMENTO</th>
                  <th className="py-4 px-3 text-center w-20">MÃE</th>
                  <th className="py-4 px-3 text-center w-20">PAI</th>
                  <th className="py-4 px-5 text-center">CALENDÁRIO DE ESCALAS</th>
                  <th className="py-4 px-4 text-right w-24">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/70 font-sans">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Filter className="w-8 h-8 text-slate-500" />
                        <p className="text-sm font-bold text-slate-300">Nenhum colaborador localizado.</p>
                        <p className="text-xs text-slate-500">Tente ajustar o termo de pesquisa ou os filtros ativos.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredList.map((colab, idx) => {
                    const isEven = idx % 2 === 0;
                    const birthParsed = parseBirthDate(colab.birthDate);
                    const isBirthMonth = birthParsed && birthParsed.month === currentMonth;
                    const isBirthToday = birthParsed && birthParsed.day === currentDay && birthParsed.month === currentMonth;

                    return (
                      <tr
                        key={colab.id}
                        className={`transition-colors duration-150 group hover:bg-[#162030]/90 ${
                          isEven ? 'bg-[#0f1420]/60' : 'bg-[#0a0e16]/60'
                        }`}
                      >
                        {/* MATRÍCULA */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#131924] border border-[#2d3748] text-[#dfbe85] group-hover:border-[#c9a265] transition-all">
                            {colab.registration || '—'}
                          </span>
                        </td>

                        {/* COLABORADOR */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-[#1b2434] border border-[#334155] group-hover:border-[#c9a265] flex items-center justify-center text-xs font-black text-[#dfbe85] flex-shrink-0 transition-colors">
                              {colab.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <button
                                onClick={() => setSelectedCollaborator(colab)}
                                className="text-xs 2xl:text-sm font-bold text-white group-hover:text-[#dfbe85] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                                title="Clique para abrir calendário individual"
                              >
                                <span>{colab.name}</span>
                                {isBirthToday && (
                                  <span className="px-1.5 py-0.5 rounded bg-pink-500 text-[9px] font-extrabold text-white uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                                    <Cake className="w-2.5 h-2.5" /> HOJE
                                  </span>
                                )}
                                {isBirthMonth && !isBirthToday && (
                                  <span className="px-1.5 py-0.2 rounded bg-[#c9a265]/20 text-[#dfbe85] border border-[#c9a265]/40 text-[9px] font-bold">
                                    Niver Mês
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* FUNÇÃO */}
                        <td className="py-3.5 px-4">
                          {colab.role ? (
                            colab.role.includes('MONIT') ? (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#c9a265]/15 border border-[#c9a265] text-[#dfbe85]">
                                <ShieldCheck className="w-3 h-3 text-[#c9a265]" />
                                <span>{colab.role}</span>
                              </span>
                            ) : (
                              <span className="text-xs font-semibold text-slate-300">{colab.role}</span>
                            )
                          ) : (
                            <span className="text-slate-600 font-mono text-xs">—</span>
                          )}
                        </td>

                        {/* ADMISSÃO */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="text-xs font-mono text-slate-300 font-medium">
                            {colab.admissionDate || '—'}
                          </span>
                        </td>

                        {/* NASCIMENTO */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                              isBirthToday
                                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50'
                                : isBirthMonth
                                ? 'bg-[#c9a265]/15 text-[#dfbe85] border border-[#c9a265]/30'
                                : 'text-slate-300'
                            }`}
                          >
                            {colab.birthDate || '—'}
                          </span>
                        </td>

                        {/* MÃE */}
                        <td className="py-3.5 px-3 text-center">
                          {colab.isMother ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-pink-500/15 border border-pink-500/40 text-pink-300 uppercase tracking-wide">
                              SIM
                            </span>
                          ) : (
                            <span className="text-slate-600 font-mono text-xs">—</span>
                          )}
                        </td>

                        {/* PAI */}
                        <td className="py-3.5 px-3 text-center">
                          {colab.isFather ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/15 border border-blue-500/40 text-blue-300 uppercase tracking-wide">
                              SIM
                            </span>
                          ) : (
                            <span className="text-slate-600 font-mono text-xs">—</span>
                          )}
                        </td>

                        {/* CALENDÁRIO INDIVIDUAL */}
                        <td className="py-3.5 px-5 text-center">
                          <button
                            onClick={() => setSelectedCollaborator(colab)}
                            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#131924] hover:bg-gradient-to-r hover:from-[#dfbe85] hover:to-[#c9a265] text-[#dfbe85] hover:text-[#0c1017] border border-[#c9a265]/40 hover:border-[#dfbe85] text-xs font-extrabold transition-all shadow-sm cursor-pointer active:scale-95 group/btn"
                            title={`Abrir calendário individual de ${colab.name}`}
                          >
                            <CalendarDays className="w-3.5 h-3.5 text-[#c9a265] group-hover/btn:text-[#0c1017]" />
                            <span>Abrir Calendário</span>
                          </button>
                        </td>

                        {/* AÇÕES */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center space-x-1.5">
                            <button
                              onClick={() => handleOpenEdit(colab)}
                              title="Editar colaborador"
                              className="p-1.5 rounded-lg bg-[#131924] hover:bg-[#c9a265]/20 border border-[#2d3748] hover:border-[#c9a265] text-slate-300 hover:text-[#dfbe85] transition-all cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(colab.id, colab.name)}
                              title="Apagar colaborador"
                              className="p-1.5 rounded-lg bg-[#131924] hover:bg-rose-500/20 border border-[#2d3748] hover:border-rose-500/40 text-slate-300 hover:text-rose-300 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW (EXECUTIVE CARDS) */
        <div
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 transition-all duration-500 ${
            hideContent ? 'opacity-0 scale-95 pointer-events-none translate-y-4' : ''
          }`}
        >
          {filteredList.map((colab) => {
            const birthParsed = parseBirthDate(colab.birthDate);
            const isBirthMonth = birthParsed && birthParsed.month === currentMonth;
            const isBirthToday = birthParsed && birthParsed.day === currentDay && birthParsed.month === currentMonth;

            return (
              <div
                key={colab.id}
                className="bg-[#0c1017]/95 backdrop-blur-md rounded-2xl border border-[#1e293b] hover:border-[#c9a265] p-4 flex flex-col justify-between transition-all duration-200 shadow-xl group hover:shadow-[#c9a265]/10"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#131924] border border-[#2d3748] text-[#dfbe85]">
                      {colab.registration}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEdit(colab)}
                        className="p-1.5 rounded-lg bg-[#131924] hover:bg-[#c9a265]/20 text-slate-400 hover:text-[#dfbe85] transition-all"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(colab.id, colab.name)}
                        className="p-1.5 rounded-lg bg-[#131924] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#1b2434] border border-[#334155] group-hover:border-[#c9a265] flex items-center justify-center text-xs font-black text-[#dfbe85] flex-shrink-0">
                      {colab.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#dfbe85] transition-colors leading-tight">
                        {colab.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {colab.role || 'Geral / Operacional'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1e293b] space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Admissão:</span>
                      <span className="font-mono font-medium">{colab.admissionDate || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Nascimento:</span>
                      <span className="font-mono font-bold text-[#dfbe85] flex items-center gap-1">
                        {colab.birthDate || '—'}
                        {isBirthToday && <span className="text-[10px] text-pink-400 font-extrabold">(HOJE!)</span>}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Família:</span>
                      <span className="font-medium">
                        {colab.isMother ? (
                          <span className="text-pink-400 font-bold">Mãe</span>
                        ) : colab.isFather ? (
                          <span className="text-blue-400 font-bold">Pai</span>
                        ) : (
                          '—'
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1e293b]">
                  <button
                    onClick={() => setSelectedCollaborator(colab)}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] text-[#0f0b04] text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>Ver Calendário Individual</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. INDIVIDUAL INTERACTIVE CALENDAR MODAL (PORTAL & NO-SCROLL) */}
      {/* ======================================================== */}
      {selectedCollaborator && calendarData && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-3 md:p-4 bg-black/90 backdrop-blur-md overflow-hidden no-scrollbar animate-fade-in">
          {/* Optional 360 Degree Panoramic Background in WebGL / Three.js */}
          {calendar360Mode && (
            <div className="fixed inset-0 pointer-events-auto z-0">
              <ThreePanorama
                imageSrc={activePanorama === 'edificio_joao_lima' ? bgEdificioJoaoLima : bgEdificioJoaoLimaSede}
                autoRotate={autoRotate360}
                rotateSpeed={0.3}
              />
            </div>
          )}

          {/* Modal Container with Dynamic Zoom Scale, 4K UHD, and Zero-Cutoff Layout */}
          <div
            style={{
              transform: `scale(${calendarZoomScale})`,
              transformOrigin: 'center center',
            }}
            className={`border-2 border-[#c9a265] rounded-3xl w-full max-w-[980px] xl:max-w-[1040px] 2xl:max-w-[1140px] 4k:max-w-[1300px] flex flex-col shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden no-scrollbar transition-all duration-300 relative z-10 my-auto ${
              calendar360Mode && calendarBgOpacity === 'ultra'
                ? 'bg-[#0c1017]/70 backdrop-blur-sm'
                : calendar360Mode && calendarBgOpacity === 'translucent'
                ? 'bg-[#0c1017]/88 backdrop-blur-md'
                : 'bg-[#0c1017] backdrop-blur-xl'
            }`}
          >
            {/* Empty 3D Hook Containers for Three.js / Spline Extensions */}
            <div id="3d-calendar-modal-container" className="absolute inset-0 pointer-events-none z-0 opacity-0" />
            <div id="3d-cup-container" className="absolute bottom-2 right-2 w-16 h-16 pointer-events-none z-0 opacity-0" />
            <div id="3d-map-container" className="absolute top-2 left-2 w-16 h-16 pointer-events-none z-0 opacity-0" />

            {/* Header */}
            <div className="px-3.5 sm:px-4 py-2.5 border-b border-[#1e293b] bg-gradient-to-r from-[#171e2b] via-[#10151f] to-[#171e2b] flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#dfbe85] via-[#c9a265] to-[#8f6930] flex items-center justify-center text-slate-950 font-black text-xs border border-[#dfbe85] shadow-lg shrink-0">
                  {selectedCollaborator.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-[#131924] border border-[#c9a265]/50 text-[#dfbe85] shadow-sm">
                      {selectedCollaborator.registration}
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-white tracking-wide">{selectedCollaborator.name}</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap font-medium">
                    <span>{selectedCollaborator.role || 'Geral'}</span>
                    <span>•</span>
                    <span>Nascimento: <strong className="text-slate-200 font-mono">{selectedCollaborator.birthDate || '—'}</strong></span>
                    {selectedCollaborator.isMother && <span className="text-pink-400 font-bold">• Mãe</span>}
                    {selectedCollaborator.isFather && <span className="text-blue-400 font-bold">• Pai</span>}
                  </p>
                </div>
              </div>

              {/* Right Header Controls: Zoom Control, 360 Immersion & Close */}
              <div className="flex items-center space-x-2">
                {/* Zoom Controller */}
                <div className="hidden sm:flex items-center bg-[#131924] border border-[#2d3748] rounded-xl p-0.5 space-x-0.5 shadow-sm">
                  <button
                    onClick={() => setCalendarZoomScale((prev) => Math.max(0.65, parseFloat((prev - 0.05).toFixed(2))))}
                    className="p-1 rounded-lg hover:bg-[#20293a] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Diminuir Zoom (-)"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCalendarZoomScale(1.0)}
                    className="px-2 py-0.5 text-[10.5px] font-mono font-bold text-[#dfbe85] hover:text-white cursor-pointer"
                    title="Redefinir Zoom (100%)"
                  >
                    {Math.round(calendarZoomScale * 100)}%
                  </button>
                  <button
                    onClick={() => setCalendarZoomScale((prev) => Math.min(1.2, parseFloat((prev + 0.05).toFixed(2))))}
                    className="p-1 rounded-lg hover:bg-[#20293a] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Aumentar Zoom (+)"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 360 Degree Immersion Mode Switch */}
                <button
                  onClick={() => setCalendar360Mode(!calendar360Mode)}
                  className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer shadow-sm ${
                    calendar360Mode
                      ? 'bg-gradient-to-r from-[#dfbe85] to-[#c9a265] text-[#0c1017] border-[#dfbe85] scale-105 shadow-[0_0_15px_rgba(201,162,101,0.5)]'
                      : 'bg-[#151c28] text-slate-300 border-[#2d3748] hover:border-[#c9a265] hover:text-[#dfbe85]'
                  }`}
                  title="Ativar/Desativar visão 360° panorâmica em Full HD / 4K"
                >
                  <Compass className={`w-3.5 h-3.5 ${calendar360Mode ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{calendar360Mode ? '360° Ativo' : 'Modo 360°'}</span>
                </button>

                {/* Close Modal Button */}
                <button
                  onClick={() => setSelectedCollaborator(null)}
                  className="p-1.5 sm:p-2 rounded-xl bg-[#151c28] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-[#2d3748] hover:border-rose-500/40 transition-all cursor-pointer"
                  title="Fechar Calendário"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* 360 Panorama Toolbar (Visible when 360 Mode is ON) */}
            {calendar360Mode && (
              <div className="bg-[#101520] border-b border-[#c9a265]/30 px-3 py-1 flex items-center justify-between gap-2 text-xs z-10 flex-wrap shrink-0">
                <div className="flex items-center space-x-1.5 text-[#dfbe85] font-bold text-[10.5px]">
                  <Move3D className="w-3.5 h-3.5 text-[#c9a265]" />
                  <span>Ambiente 360° Imersivo 4K: Arraste a tela para girar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setActivePanorama(
                        activePanorama === 'edificio_joao_lima'
                          ? 'edificio_joao_lima_sede'
                          : 'edificio_joao_lima'
                      )
                    }
                    className="px-2 py-0.5 rounded-lg bg-[#182130] border border-[#2d3748] hover:border-[#c9a265] text-slate-200 text-[10px] font-bold flex items-center space-x-1"
                  >
                    <Building2 className="w-3 h-3 text-[#c9a265]" />
                    <span>{activePanorama === 'edificio_joao_lima' ? 'Ver Sede 360°' : 'Ver Edifício 360°'}</span>
                  </button>

                  <div className="flex items-center bg-[#131924] rounded-lg p-0.5 border border-[#2d3748]">
                    <button
                      onClick={() => setCalendarBgOpacity('focused')}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                        calendarBgOpacity === 'focused' ? 'bg-[#c9a265] text-[#0c1017]' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Focado
                    </button>
                    <button
                      onClick={() => setCalendarBgOpacity('translucent')}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                        calendarBgOpacity === 'translucent' ? 'bg-[#c9a265] text-[#0c1017]' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Translúcido
                    </button>
                    <button
                      onClick={() => setCalendarBgOpacity('ultra')}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                        calendarBgOpacity === 'ultra' ? 'bg-[#c9a265] text-[#0c1017]' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      360° Total
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Body: Fits completely in viewport without cropping or scrollbars */}
            <div className="overflow-hidden p-2.5 sm:p-3 2xl:p-4 space-y-2 sm:space-y-2.5 z-10 no-scrollbar">
              {/* Top Bar: Quick Brush & Guide (Compact single line) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#121722]/90 p-2 sm:p-2.5 rounded-xl border border-[#1e293b] shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded-lg bg-[#c9a265]/15 text-[#dfbe85] border border-[#c9a265]/35 shadow-sm">
                    <CalendarCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Pincel de Status Rápido</span>
                    <span className="text-[10px] text-slate-400">Selecione uma cor e clique nos dias do calendário para marcar</span>
                  </div>
                </div>

                {/* Status Brush Buttons */}
                <div className="flex items-center flex-wrap gap-1 sm:gap-1.5">
                  {(['trabalhou', 'folga', 'atestado', 'falta', 'ferias'] as DayStatus[]).map((st) => {
                    const cfg = STATUS_CONFIG[st];
                    const isSelected = selectedStatusBrush === st;
                    return (
                      <button
                        key={st}
                        onClick={() => setSelectedStatusBrush((prev) => (prev === st ? null : st))}
                        className={`flex items-center space-x-1.5 px-2 sm:px-2.5 py-0.5 rounded-lg text-[10.5px] sm:text-[11px] font-extrabold transition-all cursor-pointer border shadow-sm ${
                          isSelected
                            ? `${cfg.bg} text-[#0c1017] shadow-md border-white scale-105 font-black`
                            : `bg-[#1a2230] text-slate-300 border-[#2d3748] hover:border-slate-400 hover:text-white`
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.bg}`} />
                        <span>{cfg.label}</span>
                      </button>
                    );
                  })}

                  {/* Eraser / Clear Brush Button */}
                  <button
                    onClick={() => setSelectedStatusBrush((prev) => (prev === 'clear' ? null : 'clear'))}
                    title="Borracha: clique nos dias para limpar o status"
                    className={`flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 rounded-lg text-[10.5px] sm:text-[11px] font-extrabold transition-all cursor-pointer border shadow-sm ${
                      selectedStatusBrush === 'clear'
                        ? 'bg-rose-600 text-white border-white shadow-md scale-105 font-black'
                        : 'bg-[#1e1315] text-rose-300 border-rose-900/60 hover:border-rose-500 hover:text-white'
                    }`}
                  >
                    <Eraser className="w-3 h-3" />
                    <span>Limpar Dia</span>
                  </button>

                  {/* Neutral / Inspect Mode indicator when no brush is active */}
                  {selectedStatusBrush === null && (
                    <span className="text-[9.5px] text-slate-400 font-medium px-1.5 py-0.5 rounded bg-[#10141d] border border-slate-700/50">
                      Modo Inspeção Livre
                    </span>
                  )}
                </div>
              </div>

              {/* Main 2-Column Responsive Layout (Exact match to screenshot) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3.5 items-start">
                {/* Left: The Calendar Widget (5 cols on lg) */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center">
                  <div className="w-full">
                    <CollaboratorCalendarWidget
                      collaborator={selectedCollaborator}
                      month={calendarMonth}
                      year={calendarYear}
                      onPrevMonth={() => {
                        if (calendarMonth === 0) {
                          setCalendarMonth(11);
                          setCalendarYear((y) => y - 1);
                        } else {
                          setCalendarMonth((m) => m - 1);
                        }
                      }}
                      onNextMonth={() => {
                        if (calendarMonth === 11) {
                          setCalendarMonth(0);
                          setCalendarYear((y) => y + 1);
                        } else {
                          setCalendarMonth((m) => m + 1);
                        }
                      }}
                      selectedDay={selectedCalendarDay}
                      onSelectDay={(day) => setSelectedCalendarDay(day)}
                      onSetStatus={(day, status) => handleSetDayStatus(day, status)}
                      selectedStatusBrush={selectedStatusBrush}
                    />
                  </div>

                  {/* Calendar Footnote / Legend directly under calendar widget */}
                  <div className="w-full max-w-[340px] sm:max-w-[370px] mt-1.5 p-1.5 px-2.5 rounded-xl bg-[#121722]/90 border border-[#1e293b] flex items-center justify-between text-[10px] text-slate-400 font-medium shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-1 rounded-full bg-[#10b981]" />
                      <span className="text-slate-300">Trabalhou</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full border-[1.5px] border-[#b89255] inline-block" />
                      <span className="text-[#dfbe85] font-semibold">Dia Ativo ({selectedCalendarDay})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b91c1c] ring-1 ring-white/20" />
                      <span className="text-slate-300">Alerta</span>
                    </div>
                  </div>
                </div>

                {/* Right: Inspection, Management & Analytics (7 cols on lg) */}
                <div className="lg:col-span-7 space-y-2 sm:space-y-2.5">
                  {/* Selected Day Inspector Box */}
                  <div className="bg-[#121722]/95 rounded-xl border border-[#c9a265]/40 p-2.5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a265]/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-[#1e293b]">
                      <div>
                        <span className="text-[9px] uppercase font-mono font-bold text-[#dfbe85] tracking-wider block">
                          PAINEL DE INSPEÇÃO DO DIA
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2 mt-0.5">
                          <span>Dia {selectedCalendarDay} de {calendarData.monthName} de {calendarYear}</span>
                        </h4>
                      </div>

                      {/* Current Status of this day */}
                      {(() => {
                        const dayStr = selectedCalendarDay < 10 ? `0${selectedCalendarDay}` : `${selectedCalendarDay}`;
                        const mStr = calendarMonth + 1 < 10 ? `0${calendarMonth + 1}` : `${calendarMonth + 1}`;
                        const key = `${calendarYear}-${mStr}-${dayStr}`;
                        const curStatus: DayStatus | undefined = selectedCollaborator.attendance[key];
                        if (!curStatus) {
                          return (
                            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg border text-[10.5px] font-bold bg-[#1a2230] text-slate-400 border-[#2d3748] shadow-sm shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                              <span>Status: Sem Registro</span>
                            </div>
                          );
                        }
                        const cfg = STATUS_CONFIG[curStatus];
                        return (
                          <div className="flex items-center space-x-1.5 shrink-0">
                            <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-lg border text-[10.5px] font-extrabold ${cfg.badge} shadow-sm`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.bg}`} />
                              <span>Status: {cfg.label}</span>
                            </div>
                            <button
                              onClick={() => handleSetDayStatus(selectedCalendarDay, null)}
                              title="Limpar o status deste dia"
                              className="flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-950/40 text-rose-300 border border-rose-800/60 hover:bg-rose-900/60 hover:text-white transition-all cursor-pointer shadow-xs"
                            >
                              <Eraser className="w-2.5 h-2.5" />
                              <span>Limpar</span>
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Change status for selected day */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-300">
                          Definir status do dia {selectedCalendarDay}:
                        </span>
                        <span className="text-[9px] text-slate-400">
                          (clique no status ativo ou em Limpar para remover)
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-1">
                        {(['trabalhou', 'folga', 'atestado', 'falta', 'ferias'] as DayStatus[]).map((st) => {
                          const cfg = STATUS_CONFIG[st];
                          const dayStr = selectedCalendarDay < 10 ? `0${selectedCalendarDay}` : `${selectedCalendarDay}`;
                          const mStr = calendarMonth + 1 < 10 ? `0${calendarMonth + 1}` : `${calendarMonth + 1}`;
                          const key = `${calendarYear}-${mStr}-${dayStr}`;
                          const isCurrent = selectedCollaborator.attendance[key] === st;

                          return (
                            <button
                              key={st}
                              onClick={() => handleSetDayStatus(selectedCalendarDay, isCurrent ? null : st)}
                              title={isCurrent ? `Clique para desmarcar ${cfg.label}` : `Definir como ${cfg.label}`}
                              className={`py-1 px-1.5 rounded-lg text-[10px] font-extrabold flex items-center justify-center space-x-1 transition-all border cursor-pointer ${
                                isCurrent
                                  ? `${cfg.bg} text-[#0c1017] border-white shadow-md font-black scale-[1.02]`
                                  : `bg-[#1a2230] text-slate-300 border-[#2d3748] hover:border-[#dfbe85] hover:text-white`
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.bg}`} />
                              <span>{cfg.label}</span>
                            </button>
                          );
                        })}

                        {/* Dedicated Clear Day Button */}
                        {(() => {
                          const dayStr = selectedCalendarDay < 10 ? `0${selectedCalendarDay}` : `${selectedCalendarDay}`;
                          const mStr = calendarMonth + 1 < 10 ? `0${calendarMonth + 1}` : `${calendarMonth + 1}`;
                          const key = `${calendarYear}-${mStr}-${dayStr}`;
                          const hasStatus = !!selectedCollaborator.attendance[key];

                          return (
                            <button
                              onClick={() => handleSetDayStatus(selectedCalendarDay, null)}
                              disabled={!hasStatus}
                              title="Limpar o status marcado para este dia"
                              className={`py-1 px-1.5 rounded-lg text-[10px] font-extrabold flex items-center justify-center space-x-1 transition-all border ${
                                hasStatus
                                  ? 'bg-[#1f1214] text-rose-300 border-rose-800/70 hover:bg-rose-900/50 hover:border-rose-500 hover:text-white cursor-pointer shadow-sm'
                                  : 'bg-[#151a24]/60 text-slate-500 border-[#242d3d] cursor-not-allowed opacity-60'
                              }`}
                            >
                              <Eraser className="w-3 h-3" />
                              <span>Limpar Dia</span>
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Monthly Summary Statistics & ECharts Donut */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Summary Counts */}
                    <div className="bg-[#121722]/95 rounded-xl border border-[#1e293b] p-2.5 shadow-lg flex flex-col justify-between">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#dfbe85] mb-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Total do Mês ({calendarData.totalDays} dias)
                      </h4>
                      <div className="space-y-0.5">
                        {(['trabalhou', 'folga', 'atestado', 'falta', 'ferias'] as DayStatus[]).map((st) => {
                          const cfg = STATUS_CONFIG[st];
                          const count = calendarData.counts[st] || 0;
                          const pct = Math.round((count / calendarData.totalDays) * 100);
                          return (
                            <div
                              key={st}
                              className="flex items-center justify-between p-1 px-1.5 rounded-md bg-[#0c1017] border border-[#1e293b]"
                            >
                              <div className="flex items-center space-x-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.bg}`} />
                                <span className="text-[10px] font-medium text-slate-300">{cfg.label}</span>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <span className="text-[10px] font-mono font-bold text-white">{count}d</span>
                                <span className="text-[9px] text-slate-500 font-mono">({pct}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ECharts Visual Distribution */}
                    <div className="bg-[#121722]/95 rounded-xl border border-[#1e293b] p-2.5 shadow-lg flex flex-col">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#dfbe85] mb-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Distribuição da Escala
                      </h4>
                      <div className="h-28 sm:h-32 flex-1 min-h-[110px]">
                        <ReactECharts option={calendarChartOption} style={{ height: '100%', width: '100%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bar (Exact match to screenshot) */}
            <div className="px-3.5 sm:px-4 py-2 border-t border-[#1e293b] bg-[#0c1017] flex flex-col sm:flex-row items-center justify-between gap-2 z-10 shrink-0">
              <p className="text-[10px] sm:text-[10.5px] text-slate-400 flex items-center gap-1.5">
                <Info className="w-3 h-3 text-[#dfbe85] shrink-0" />
                <span>Clique nos dias para inspecionar ou use o Pincel de Status para alterações instantâneas.</span>
              </p>
              <button
                onClick={() => setSelectedCollaborator(null)}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a07739] text-[#0c1017] text-xs font-black hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-lg tracking-wide shrink-0"
              >
                Concluir & Fechar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* 6. ADD / EDIT COLLABORATOR FORM MODAL                    */}
      {/* ======================================================== */}
      {isFormModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0c1017] border-2 border-[#c9a265] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#1e293b] bg-gradient-to-r from-[#171e2b] to-[#10151f] flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#c9a265]" />
                <span>{editingId ? 'Editar Colaborador' : 'Novo Colaborador'}</span>
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#151c28] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Matrícula (Ex: 1-10467)
                </label>
                <input
                  type="text"
                  value={formData.registration}
                  onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                  placeholder="1-10467"
                  className="w-full bg-[#131924] border border-[#2a3447] focus:border-[#c9a265] text-white text-xs px-3.5 py-2.5 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do colaborador"
                  className="w-full bg-[#131924] border border-[#2a3447] focus:border-[#c9a265] text-white text-xs px-3.5 py-2.5 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Função / Cargo
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="OP MONIT ELETRONICO"
                  className="w-full bg-[#131924] border border-[#2a3447] focus:border-[#c9a265] text-white text-xs px-3.5 py-2.5 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Admissão
                  </label>
                  <input
                    type="text"
                    value={formData.admissionDate}
                    onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                    placeholder="01/12/2022"
                    className="w-full bg-[#131924] border border-[#2a3447] focus:border-[#c9a265] text-white text-xs px-3.5 py-2.5 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Nascimento
                  </label>
                  <input
                    type="text"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    placeholder="24/11/1993"
                    className="w-full bg-[#131924] border border-[#2a3447] focus:border-[#c9a265] text-white text-xs px-3.5 py-2.5 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isMother}
                    onChange={(e) => setFormData({ ...formData, isMother: e.target.checked })}
                    className="w-4 h-4 rounded text-[#c9a265] focus:ring-[#c9a265] bg-[#131924] border-[#2a3447]"
                  />
                  <span className="text-xs font-bold text-pink-300">É Mãe (SIM)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFather}
                    onChange={(e) => setFormData({ ...formData, isFather: e.target.checked })}
                    className="w-4 h-4 rounded text-[#c9a265] focus:ring-[#c9a265] bg-[#131924] border-[#2a3447]"
                  />
                  <span className="text-xs font-bold text-blue-300">É Pai (SIM)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#1e293b] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#151c28] hover:bg-[#1e293b] text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#dfbe85] to-[#c9a265] text-[#0c1017] text-xs font-extrabold hover:brightness-110 shadow-lg"
                >
                  Salvar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* 7. ALL BIRTHDAYS MODAL (CELEBRATION LIST)                */}
      {/* ======================================================== */}
      {isBirthdayModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0c1017] border-2 border-pink-500 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#1e293b] bg-gradient-to-r from-[#2a1322] to-[#120810] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500 flex items-center justify-center text-pink-400">
                  <Cake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Aniversariantes do Mês (Agosto)</h3>
                  <p className="text-xs text-pink-300">{birthdaysThisMonth.length} colaboradores comemorando</p>
                </div>
              </div>
              <button
                onClick={() => setIsBirthdayModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#151c28] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto custom-scroll space-y-2.5">
              {birthdaysThisMonth.map((b) => {
                const parsed = parseBirthDate(b.birthDate);
                const isToday = parsed && parsed.day === currentDay && parsed.month === currentMonth;

                return (
                  <div
                    key={b.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isToday
                        ? 'bg-pink-500/20 border-pink-500 shadow-md'
                        : 'bg-[#131924] border-[#1e293b] hover:border-[#c9a265]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-[#1b2434] border border-[#334155] flex items-center justify-center text-xs font-bold text-[#dfbe85]">
                        {b.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{b.name}</span>
                          {isToday && (
                            <span className="px-1.5 py-0.2 rounded bg-pink-500 text-[9px] font-black text-white uppercase animate-pulse">
                              HOJE!
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Nascimento: {b.birthDate} {b.role ? `• ${b.role}` : ''}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsBirthdayModalOpen(false);
                        setSelectedCollaborator(b);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#1c2638] hover:bg-[#c9a265] text-[#dfbe85] hover:text-[#0c1017] text-xs font-bold transition-all border border-[#2d3748]"
                    >
                      Ver Escala
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-[#1e293b] bg-[#0c1017] flex justify-end">
              <button
                onClick={() => setIsBirthdayModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
