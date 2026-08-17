import React, { useState, useEffect, useRef, useCallback } from 'react';

interface LateralGoldScrollbarProps {
  targetRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export const LateralGoldScrollbar: React.FC<LateralGoldScrollbarProps> = ({ targetRef, className = '' }) => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [thumbHeightPercent, setThumbHeightPercent] = useState(25);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef<number>(0);
  const dragStartPercentRef = useRef<number>(0);

  // Helper to resolve the scroll target element
  const getScrollContainer = useCallback((): HTMLElement | Window => {
    if (targetRef?.current) return targetRef.current;
    const mainEl = document.getElementById('main-scroll-container');
    if (mainEl) return mainEl;
    const autoScrollEl = document.querySelector('.overflow-y-auto') as HTMLElement;
    if (autoScrollEl) return autoScrollEl;
    return window;
  }, [targetRef]);

  // Update scroll percentage on page/target scroll
  const updateScrollState = useCallback(() => {
    const el = getScrollContainer();
    if (el instanceof HTMLElement) {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll > 0) {
        const pct = Math.min(100, Math.max(0, (el.scrollTop / maxScroll) * 100));
        setScrollPercentage(pct);
        const visibleRatio = el.clientHeight / el.scrollHeight;
        setThumbHeightPercent(Math.max(15, Math.min(55, visibleRatio * 100)));
      } else {
        setScrollPercentage(0);
        setThumbHeightPercent(30);
      }
    } else {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const pct = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollPercentage(pct);
        const visibleRatio = window.innerHeight / document.documentElement.scrollHeight;
        setThumbHeightPercent(Math.max(15, Math.min(55, visibleRatio * 100)));
      } else {
        setScrollPercentage(0);
        setThumbHeightPercent(30);
      }
    }
  }, [getScrollContainer]);

  useEffect(() => {
    const el = getScrollContainer();

    const handleScroll = () => {
      updateScrollState();
    };

    if (el instanceof HTMLElement) {
      el.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Observe DOM changes that alter scroll height
    let resizeObserver: ResizeObserver | null = null;
    if (el instanceof HTMLElement && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateScrollState();
      });
      resizeObserver.observe(el);
      if (el.firstElementChild) {
        resizeObserver.observe(el.firstElementChild);
      }
    }

    // Initial check and interval sync
    updateScrollState();
    const interval = setInterval(updateScrollState, 400);

    return () => {
      if (el instanceof HTMLElement) {
        el.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      clearInterval(interval);
    };
  }, [getScrollContainer, updateScrollState]);

  // Execute scroll to percentage
  const scrollToPercent = (percent: number, smooth: boolean = true) => {
    const clamped = Math.min(100, Math.max(0, percent));
    setScrollPercentage(clamped);

    const el = getScrollContainer();
    const behavior: ScrollBehavior = smooth ? 'smooth' : 'auto';

    if (el instanceof HTMLElement) {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll > 0) {
        el.scrollTo({
          top: (clamped / 100) * maxScroll,
          behavior,
        });
      }
    } else {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        window.scrollTo({
          top: (clamped / 100) * scrollHeight,
          behavior,
        });
      }
    }
  };

  // Click on Track to jump
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const percent = (offsetY / rect.height) * 100;
    scrollToPercent(percent, true);
  };

  // Arrow Click handlers
  const handleScrollToTop = (e: React.MouseEvent) => {
    e.stopPropagation();
    scrollToPercent(0, true);
  };

  const handleScrollToBottom = (e: React.MouseEvent) => {
    e.stopPropagation();
    scrollToPercent(100, true);
  };

  // Universal Pointer Event Handlers for Dragging (Mouse & Touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartYRef.current = e.clientY;
    dragStartPercentRef.current = scrollPercentage;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !trackRef.current) return;
    e.stopPropagation();

    const rect = trackRef.current.getBoundingClientRect();
    const deltaY = e.clientY - dragStartYRef.current;
    const deltaPercent = (deltaY / rect.height) * 100;
    const newPercent = dragStartPercentRef.current + deltaPercent;

    scrollToPercent(newPercent, false);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
      setIsDragging(false);
    }
  };

  // Thumb position calculation
  const maxTopPercent = 100 - thumbHeightPercent;
  const thumbTopPosition = (scrollPercentage / 100) * maxTopPercent;

  return (
    <div
      className={`fixed right-1 sm:right-2.5 top-20 bottom-8 z-50 flex flex-col items-center justify-between pointer-events-auto select-none transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Barra de Navegação Dourada"
    >
      {/* Container with Dark Navy/Black background strip */}
      <div className="relative w-4 sm:w-5 h-full bg-[#0c1017]/95 hover:bg-[#0c1017] border border-[#1f2737] hover:border-[#c9a265]/50 rounded-full flex flex-col items-center py-2 shadow-2xl backdrop-blur-md transition-all">
        
        {/* Top Upward Triangle / Arrow Button (Exact representation from screenshot) */}
        <button
          onClick={handleScrollToTop}
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center text-[#c9a265] hover:text-[#dfbe85] hover:scale-125 active:scale-95 transition-all cursor-pointer z-20 shrink-0"
          title="Rolar para o topo"
          aria-label="Rolar para o topo"
        >
          <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current drop-shadow-[0_0_4px_rgba(201,162,101,0.7)]">
            <polygon points="5,1 9,8 1,8" />
          </svg>
        </button>

        {/* Vertical Track Area */}
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative flex-1 w-full flex justify-center items-start my-1 cursor-pointer"
        >
          {/* Subtle central guideline */}
          <div className="absolute top-0 bottom-0 w-[1.5px] bg-[#1a2332] rounded-full" />

          {/* Golden Scroll Thumb - matches user's screenshot:
              Golden vertical rod with triangular/arrow apex & rounded pill bottom tip */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              top: `${thumbTopPosition}%`,
              height: `${thumbHeightPercent}%`,
              touchAction: 'none',
            }}
            className={`absolute w-[5px] sm:w-[6px] rounded-full transition-[width,transform] duration-75 cursor-grab active:cursor-grabbing ${
              isDragging ? 'scale-125 w-[7px]' : 'hover:scale-110'
            }`}
          >
            {/* Golden Vertical Rod with Gradient & Glow */}
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#f3e5ca] via-[#c9a265] to-[#8c6a38] shadow-[0_0_12px_rgba(201,162,101,0.8)] flex flex-col items-center justify-between border border-[#dfbe85]/40">
              {/* Top arrow cap inside thumb */}
              <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[4px] border-b-[#f3e5ca] -mt-1 shadow-sm" />
              
              {/* Bottom pill tip */}
              <div className="w-full h-[4px] rounded-b-full bg-[#8c6a38]" />
            </div>

            {/* Percentage Tooltip on Hover / Drag */}
            {(isHovered || isDragging) && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#0c1017] border border-[#c9a265] text-[#dfbe85] text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-2xl whitespace-nowrap pointer-events-none animate-in fade-in">
                {Math.round(scrollPercentage)}%
              </div>
            )}
          </div>
        </div>

        {/* Bottom Indicator / Downward Control */}
        <button
          onClick={handleScrollToBottom}
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center text-[#c9a265]/80 hover:text-[#dfbe85] hover:scale-125 active:scale-95 transition-all cursor-pointer z-20 shrink-0 mt-0.5"
          title="Rolar para o final"
          aria-label="Rolar para o final"
        >
          <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current opacity-80 hover:opacity-100 drop-shadow-[0_0_3px_rgba(201,162,101,0.5)]">
            <polygon points="1,2 9,2 5,9" />
          </svg>
        </button>
      </div>
    </div>
  );
};
