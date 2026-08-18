export type FuncaoType = 'Líder' | 'Interino' | 'Operador' | 'Supervisor' | 'Coordenador';
export type TurnoType = 'Turno A' | 'Turno B' | 'Turno A e B' | 'Turno C';
export type PeriodoType = 'Diurno' | 'Noturno' | 'Integral';

export interface PlantaoUser {
  id: string;
  nome: string;
  funcao: FuncaoType;
  turno: TurnoType;
  periodo: PeriodoType;
  avatarColor: string;
  avatarInitials: string;
  badgeColor: string;
  email?: string;
  status: 'Em Plantão' | 'Ativo' | 'Folga' | 'Transição';
  totalRegistros?: number;
  ultimoRegistro?: string;
}

export type ItemTipo = 'resumo_turno' | 'ocorrencia' | 'pontuacao' | 'checklist' | 'acao_app';
export type ItemPrioridade = 'normal' | 'importante' | 'critica';

export interface PlantaoFolderItem {
  id: string;
  userId: string;
  userName: string;
  tipo: ItemTipo;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  prioridade: ItemPrioridade;
  veiculoPlaca?: string;
  motorista?: string;
  local?: string;
  statusAcompanhamento: 'concluido' | 'acompanhar' | 'pendente_proximo_turno' | 'informativo';
  checklistItems?: { id: string; texto: string; concluido: boolean }[];
  tags?: string[];
  createdAt: number;
}
