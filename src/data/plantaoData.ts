import { getInitialVehicles } from './veiculosData';

export type PlantaoStatus = 
  | 'acompanhar' 
  | 'resolvido' 
  | 'para conhecimento' 
  | 'atenção' 
  | 'registrado no grid';

export interface PlantaoItem {
  id: string;
  dataRegistro: string;
  horaRegistro: string;
  turno: string;
  operador: string;
  observacao: string;
  
  // Coluna Ocorrência
  unidadeTransportadora: string;
  placa: string;
  eventualidade: string;
  descricaoOcorrencia: string;
  
  // Coluna Atualização/Retorno
  atualizacao: {
    temSubstituicao?: boolean;
    placaSubstituta?: string;
    condutorSubstituto?: string;
    descricaoRetorno: string;
    historico?: Array<{
      dataHora: string;
      operador: string;
      texto: string;
    }>;
  };
  
  // Coluna Status
  status: PlantaoStatus;
}

export const STATUS_CONFIG: Record<PlantaoStatus, {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  description: string;
}> = {
  'acompanhar': {
    label: 'acompanhar',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-400',
    badgeBorder: 'border-blue-500/30',
    dotColor: 'bg-blue-400',
    description: 'Em monitoramento contínuo pelo CCO',
  },
  'resolvido': {
    label: 'resolvido',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/30',
    dotColor: 'bg-emerald-400',
    description: 'Ocorrência finalizada e validada',
  },
  'para conhecimento': {
    label: 'para conhecimento',
    badgeBg: 'bg-slate-500/15',
    badgeText: 'text-slate-300',
    badgeBorder: 'border-slate-500/30',
    dotColor: 'bg-slate-400',
    description: 'Informativo geral para o próximo turno',
  },
  'atenção': {
    label: 'atenção',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-500/30',
    dotColor: 'bg-amber-400 animate-pulse',
    description: 'Ponto crítico requer atenção redobrada',
  },
  'registrado no grid': {
    label: 'registrado no grid',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/30',
    dotColor: 'bg-purple-400',
    description: 'Cadastrado e rastreado no sistema Grid',
  },
};

export const INITIAL_PLANTAO_ITEMS: PlantaoItem[] = [
  {
    id: 'plantao-1',
    dataRegistro: '17/08/2026',
    horaRegistro: '08:45',
    turno: 'Turno A (06:00 - 18:00)',
    operador: 'Cristiane Fialho',
    observacao: 'Acompanhamento prioritário de substituição de cavalo mecânico na rota Ceará - Paraíba.',
    unidadeTransportadora: 'Ledifran',
    placa: 'RUC3E30',
    eventualidade: 'Problema mecânico | troca de cavalo',
    descricaoOcorrencia: 'Em acompanhamento à ocorrência do veículo conduzido pelo Sr. Anderson (WhatsApp: 11 97138-7264), informamos que o condutor relatou que o veículo está com problema no diferencial. Foi realizada uma manutenção emergencial no local, porém o veículo ainda precisa ser direcionado a uma oficina e aguarda autorização da central.\n\nParalelamente, em contato via WhatsApp (24) 9699-2041 com a transportadora para validação do plano de contingência.',
    atualizacao: {
      temSubstituicao: true,
      placaSubstituta: 'TYZ7I60',
      condutorSubstituto: 'Cleidinaldo do Nascimento Pereira',
      descricaoRetorno: 'Cadastro realizado e check list realizado e reprovado, gerando EDN 02. Realizamos contato com a tecnologia Autotrac e fomos informados que o evento gera devido tem entrada para instalação de sensor e não tem correlação com desengate. Tentamos contato no período noturno para ambos os motoristas para solicitar reset e refazer o teste, porém, não obtivemos êxito.',
      historico: [
        {
          dataHora: '17/08/2026 09:30',
          operador: 'Lucas Ferreira',
          texto: 'Contato realizado com a base Ledifran. Aguardando novo envio de comando de reset Autotrac.',
        },
      ],
    },
    status: 'acompanhar',
  },
  {
    id: 'plantao-2',
    dataRegistro: '17/08/2026',
    horaRegistro: '07:15',
    turno: 'Turno A (06:00 - 18:00)',
    operador: 'Cristiane Fialho',
    observacao: 'Verificação de desvio de rota programada na BR-116.',
    unidadeTransportadora: '3C EUSEBIO',
    placa: 'SBJ8C85',
    eventualidade: 'Desvio de rota em trecho rodoviário',
    descricaoOcorrencia: 'Veículo da frota própria 3C apresentou saída de rota na altura de Horizonte/CE. Condutor relatou bloqueio por obras do DNER e necessidade de desvio autorizado pela concessionária.',
    atualizacao: {
      temSubstituicao: false,
      descricaoRetorno: 'Desvio validado com o gestor de logística da Unidade Eusébio. Veículo retornou à rota principal às 08:10 sem inconformidades de carga ou quebra de lacre.',
    },
    status: 'resolvido',
  },
  {
    id: 'plantao-3',
    dataRegistro: '17/08/2026',
    horaRegistro: '09:20',
    turno: 'Turno A (06:00 - 18:00)',
    operador: 'Lucas Ferreira',
    observacao: 'Sensor de porta traseira apresentando oscilação na saída do CD.',
    unidadeTransportadora: 'ARGUS LOGISTICA E TRANSPORTES LTDA',
    placa: 'KQT5I92',
    eventualidade: 'Alarme de violação de sensor / bau',
    descricaoOcorrencia: 'Disparo intermitente do sensor de abertura de porta baú durante deslocamento urbano em Fortaleza. CCO solicitou parada em posto seguro credenciado para averiguação física dos lacres.',
    atualizacao: {
      temSubstituicao: false,
      descricaoRetorno: 'Motorista parou no Posto São Cristóvão (KM 14). Lacres intactos (Lacre Nº 3C-889102). Falha no contato magnético do sensor. Escolta velada acionada para acompanhamento até o destino.',
    },
    status: 'atenção',
  },
  {
    id: 'plantao-4',
    dataRegistro: '17/08/2026',
    horaRegistro: '06:30',
    turno: 'Turno A (06:00 - 18:00)',
    operador: 'Cristiane Fialho',
    observacao: 'Atualização das novas diretrizes de segurança da Sede João Lima.',
    unidadeTransportadora: 'CCO CENTRAL 3 CORAÇÕES',
    placa: 'SBT0C92',
    eventualidade: 'Informativo operacional / Troca de chaves de armazém',
    descricaoOcorrencia: 'Concluído o inventário matinal dos lacres eletrônicos e chaves de custódia do CCO. Todas as 14 chaves operacionais e 10 rádios HT conferidos no cofre seguro.',
    atualizacao: {
      temSubstituicao: false,
      descricaoRetorno: 'Registro lavrado no livro digital do CCO e transmitido ao supervisor de plantão para ciência.',
    },
    status: 'para conhecimento',
  },
  {
    id: 'plantao-5',
    dataRegistro: '17/08/2026',
    horaRegistro: '10:05',
    turno: 'Turno A (06:00 - 18:00)',
    operador: 'Lucas Ferreira',
    observacao: 'Lançamento de viagem e espelhamento Omnilink concluído.',
    unidadeTransportadora: 'JETTA TRANSPORTES E LOGISTICA LTDA',
    placa: 'DVS5J65',
    eventualidade: 'Cadastro de SM e Espelhamento Grid',
    descricaoOcorrencia: 'Solicitação de Monitoramento (SM Nº 449201) para carregamento de café gourmet com destino ao Rio de Janeiro. Todos os testes de macro e atuadores aprovados.',
    atualizacao: {
      temSubstituicao: false,
      descricaoRetorno: 'Viagem iniciada com sucesso. Espelhamento ativo na central 24h e posições atualizadas a cada 3 minutos no sistema Grid.',
    },
    status: 'registrado no grid',
  },
];
