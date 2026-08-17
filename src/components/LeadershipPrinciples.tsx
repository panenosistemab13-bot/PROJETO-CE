import React, { useState, useEffect } from 'react';

const PRINCIPLES = [
  {
    id: 1,
    title: 'ENCANTE O CONSUMIDOR',
    desc: 'Coloque-se no lugar do consumidor para compreender e atender suas necessidades com excelência.',
  },
  {
    id: 2,
    title: 'CONSTRUA LAÇOS LEGÍTIMOS E DURADOUROS',
    desc: 'Construa um ambiente de confiança, dedique tempo a ouvir e promova o respeito e a inclusão.',
  },
  {
    id: 3,
    title: 'PLANEJE E FAÇA ACONTECER',
    desc: 'Seja proativo, foque na solução dos problemas e na entrega eficiente de resultados.',
  },
  {
    id: 4,
    title: 'EMPREENDA E INOVE',
    desc: 'Seja curioso, criativo e ágil, transformando oportunidades em valor prático para o negócio.',
  },
  {
    id: 5,
    title: 'TENHA ATITUDE DE DONO',
    desc: 'Comprometa-se com o resultado global, agindo com extrema responsabilidade, ética e zelo.',
  },
  {
    id: 6,
    title: 'COMUNIQUE-SE COM CLAREZA E RESPEITO',
    desc: 'Posicione-se de forma construtiva e compartilhe informações com total transparência.',
  },
  {
    id: 7,
    title: 'TENHA HUMILDADE PARA APRENDER E ENSINAR',
    desc: 'Aprenda com a experiência dos outros, inove e invista no crescimento contínuo da equipe.',
  },
  {
    id: 8,
    title: 'SEJA RESILIENTE',
    desc: 'Tenha flexibilidade e perseverança para se adaptar às adversidades com foco e disciplina.',
  },
  {
    id: 9,
    title: 'CONSTRUA UMA EMPRESA SUSTENTÁVEL',
    desc: 'Considere os impactos sociais, éticos e ambientais em todas as decisões para o futuro.',
  },
];

export function LeadershipPrinciples() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const getRandomIndex = (exclude: number) => {
      let next = Math.floor(Math.random() * PRINCIPLES.length);
      while (next === exclude) {
        next = Math.floor(Math.random() * PRINCIPLES.length);
      }
      return next;
    };

    const interval = setInterval(() => {
      setFade(false); // Inicia o fade out
      
      setTimeout(() => {
        setCurrentIndex((prev) => getRandomIndex(prev)); // Troca a frase aleatoriamente
        setFade(true); // Inicia o fade in
      }, 600); // Tempo para a transição de fade out completar
    }, 60000); // Troca a cada 60 segundos (1 minuto)

    return () => clearInterval(interval);
  }, []);

  const current = PRINCIPLES[currentIndex];

  return (
    <div className="flex items-start space-x-2.5 2xl:space-x-3 mt-4 max-w-md select-none opacity-90 hover:opacity-100 transition-opacity">
      {/* Reduced size badge */}
      <div className="w-7 h-7 2xl:w-8 2xl:h-8 rounded-full border border-[#c9a265]/40 bg-[#14120e]/80 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-lg mt-0.5">
        <span className="text-[#dfbe85] font-bold font-serif text-xs 2xl:text-sm">
          {current.id}
        </span>
      </div>
      
      <div className={`transition-opacity duration-700 ease-in-out flex flex-col ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <h4 className="text-[8px] 2xl:text-[9px] font-bold text-[#c9a265] tracking-[0.2em] uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] mb-0.5">
          Princípios de Liderança 3C
        </h4>
        <p className="text-xs 2xl:text-sm font-bold text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] leading-tight mb-0.5">
          {current.title}
        </p>
        <p className="text-[9.5px] 2xl:text-[10.5px] text-[#e2e8f0] font-medium drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] leading-snug">
          {current.desc}
        </p>
      </div>
    </div>
  );
}
