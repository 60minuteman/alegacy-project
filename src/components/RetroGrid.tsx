'use client';

import React, { useEffect, useRef } from 'react';

export default function RetroGrid({
  className,
  angle = 65,
}: {
  className?: string;
  angle?: number;
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let startTime: number;
    const animateGrid = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) * 0.05;
      grid.style.transform = `translateY(${progress % 60}px)`;
      requestAnimationFrame(animateGrid);
    };

    const animationFrame = requestAnimationFrame(animateGrid);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const combinedClassName = `pointer-events-none absolute inset-0 overflow-hidden ${className || ''}`;
  const gridStyle = {
    '--grid-angle': `${angle}deg`,
    perspective: '200px',
  } as React.CSSProperties;

  return (
    <div className={combinedClassName} style={gridStyle}>
      <div className="absolute inset-0" style={{ transform: `rotateX(var(--grid-angle))` }}>
        <div
          ref={gridRef}
          style={{
            position: 'absolute',
            top: '-60px',
            left: '-50%',
            right: '-50%',
            bottom: '-60px',
            backgroundImage: `
              linear-gradient(to right, rgba(0, 70, 67, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 70, 67, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'translateY(0)',
          }}
        />
      </div>
    </div>
  );
}
