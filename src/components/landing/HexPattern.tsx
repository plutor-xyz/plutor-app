'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';

interface HexagonProps {
  x: number;
  y: number;
  size: number;
  row: number;
  col: number;
  hexId: string;
  activeHexagons: Map<string, number>;
  onHexHover: (hexId: string) => void;
  flipped?: boolean;
}

const Hexagon: React.FC<HexagonProps> = ({
  x,
  y,
  size,
  row,
  col,
  hexId,
  activeHexagons,
  onHexHover,
  flipped = false
}) => {
  const [holographicActive, setHolographicActive] = useState(false);
  const opacity = activeHexagons.get(hexId) || 0;
  const isActive = opacity > 0;
  const isSpecial = hexId === '2-1' || hexId === 'R4-1' || hexId === '5-1' || hexId === 'R1-1';
  
  useEffect(() => {
    if (!isSpecial) return;
    
    const intervalTime = (hexId === '5-1' || hexId === 'R1-1') ? 3000 : 4000;
    
    const interval = setInterval(() => {
      setHolographicActive(true);
      setTimeout(() => {
        setHolographicActive(false);
      }, 1000);
    }, intervalTime);
    
    return () => clearInterval(interval);
  }, [isSpecial, hexId]);
  
  const getNeighborGlow = () => {
    const activeSpecialHexes = Array.from(activeHexagons.keys()).filter(id => 
      (id === '2-1' || id === 'R4-1' || id === '5-1' || id === 'R1-1') && activeHexagons.get(id)! > 0
    );
    
    if (activeSpecialHexes.length === 0) return 0;
    
    let maxGlow = 0;
    activeSpecialHexes.forEach(specialId => {
      const [specialRow, specialCol] = specialId.replace('R', '').split('-').map(Number);
      const distance = Math.sqrt(Math.pow(row - specialRow, 2) + Math.pow(col - specialCol, 2));
      
      if (distance <= 2 && distance > 0) { 
        const glowIntensity = Math.max(0, 0.4 - (distance - 1) * 0.2); 
        maxGlow = Math.max(maxGlow, glowIntensity);
      }
    });
    
    return maxGlow;
  };
  
  const neighborGlow = getNeighborGlow();

  const getOpacity = () => {
    const totalRows = 9;
    
    if (row <= 1) {
      return 0.5 + (row * 0.35); 
    }
    
    if (row >= totalRows - 2) {
      const distanceFromEnd = totalRows - 1 - row;
      return 0.5 + (distanceFromEnd * 0.35); 
    }
    
    const centerRow = 4;
    const centerCol = 1.2;
    
    const rowDistance = Math.abs(row - centerRow);
    const colDistance = Math.abs(col - centerCol);
    const distance = Math.sqrt(rowDistance * rowDistance + colDistance * colDistance);
    const maxDistance = Math.sqrt(16 + 2.25);
    const normalizedDistance = distance / maxDistance;
    
    return Math.max(0.7, 1 - Math.pow(normalizedDistance, 1.8) * 0.3);
  };

  const getBlurInfo = () => {
    const totalRows = 9;
    
    const isTopLeftCorner = (row === 0 && col === 0) || (row === 1 && col === 0);
    const isTopRightCorner = (row === 0 && col === 1);
    const isBottomCorner = (row === 8 && col === 0) || (row === 8 && col === 1) || (row === 7 && col === 0) || (row === 7 && col === 1);
    const isGradientHex = (row === 2 && col === 0) || (row === 1 && col === 1) || (row === 1 && col === 2) || (row === 0 && col === 3) ||
                         (row === 3 && col === 0) || (row === 2 && col === 1) || (row === 0 && col === 2) || (row === 1 && col === 3);
    
    if (isTopLeftCorner || isTopRightCorner) {
      return { blur: 2, type: 'full' };
    }
    
    if (isBottomCorner) {
      return { blur: 2, type: 'full' };
    }
    
    if (isGradientHex) {
      let gradientDirection = '';
      if (row === 2 && col === 0) gradientDirection = 'opacityGradient20'; // 2-0
      if (row === 1 && col === 1) gradientDirection = 'opacityGradient11'; // 1-1
      if (row === 1 && col === 2) gradientDirection = 'opacityGradient12'; // 1-2
      if (row === 0 && col === 3) gradientDirection = 'opacityGradient03'; // 0-3
      
      if (row === 3 && col === 0) gradientDirection = 'opacityGradient30'; // 3-0
      if (row === 2 && col === 1) gradientDirection = 'opacityGradient21'; // 2-1
      if (row === 0 && col === 2) gradientDirection = 'opacityGradient02'; // 0-2
      if (row === 1 && col === 3) gradientDirection = 'opacityGradient13'; // 1-3
      
      return { blur: 0, type: 'opacityGradient', direction: gradientDirection };
    }
    
    if (row >= totalRows - 2) {
      const distanceFromEnd = totalRows - 1 - row;
      return { blur: 1.5 - (distanceFromEnd * 1), type: 'full' };
    }
    
    // No blur for other hexagons
    return { blur: 0, type: 'none' };
  };

  const baseOpacity = getOpacity();
  const blurInfo = getBlurInfo();
  
  let strokeColor = '#898989'; 
  let strokeWidth = 1.5;
  let glowEffect = '';
  
  
  if (isSpecial && isActive) {
    strokeColor = '#39FF14'; 
    strokeWidth = 3;
    glowEffect = `drop-shadow(0 0 8px #39FF14) drop-shadow(0 0 16px #7EE03E)`;
  } else if (isActive) {
    strokeColor = '#7EE03E';
    strokeWidth = 2.5;
  } else if (neighborGlow > 0) {
    const glowIntensity = neighborGlow;
    strokeColor = `rgba(126, 224, 62, ${0.3 + glowIntensity * 0.7})`; 
    strokeWidth = 1.5 + glowIntensity;
    glowEffect = `drop-shadow(0 0 ${glowIntensity * 6}px rgba(126, 224, 62, ${glowIntensity}))`;
  }

  const hexPath = useMemo(() => {
    const angles = [];
    for (let i = 0; i < 6; i++) {
      angles.push((60 * i) * Math.PI / 180);
    }
    const points = angles.map(angle => [
      x + size * Math.cos(angle),
      y + size * Math.sin(angle)
    ]);
    
    const radius = 3;
    let path = '';
    
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      const prev = points[(i - 1 + points.length) % points.length];
      
      const dx1 = current[0] - prev[0];
      const dy1 = current[1] - prev[1];
      const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
      
      const dx2 = next[0] - current[0];
      const dy2 = next[1] - current[1];
      const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      
      const ux1 = (dx1 / len1) * radius;
      const uy1 = (dy1 / len1) * radius;
      const ux2 = (dx2 / len2) * radius;
      const uy2 = (dy2 / len2) * radius;
      
      const cornerStart = [current[0] - ux1, current[1] - uy1];
      const cornerEnd = [current[0] + ux2, current[1] + uy2];
      
      if (i === 0) {
        path += `M ${cornerStart[0]} ${cornerStart[1]} `;
      } else {
        path += `L ${cornerStart[0]} ${cornerStart[1]} `;
      }
      
      path += `Q ${current[0]} ${current[1]} ${cornerEnd[0]} ${cornerEnd[1]} `;
    }
    
    path += 'Z';
    return path;
  }, [x, y, size]);

  const handleMouseEnter = useCallback(() => {
    onHexHover(hexId);
  }, [hexId, onHexHover]);
  

  const renderPlutorSymbol = () => {
    if (!isActive || !isSpecial) return null;
    
    const symbolScale = 0.6;
    const logoScale = 0.12;
    
    return (
      <g 
        transform={`translate(${x}, ${y}) ${flipped ? 'scale(-1, 1)' : ''}`}
        style={{
          transition: 'opacity 1.5s ease-out'
        }}
        opacity={opacity}
      >
        <g transform={`scale(${logoScale}) translate(-250, -250)`}>
          <path fill="#39FF14" d="M 364.32 84.92 Q 364.33 84.92 364.32 84.94 Q 364.75 87.67 364.62 91.00 Q 364.58 92.04 365.98 100.38 C 367.50 109.37 372.63 114.91 381.58 116.98 Q 384.92 117.76 390.44 118.37 A 0.07 0.07 0.0 0 1 390.44 118.50 Q 385.32 118.93 379.87 120.47 Q 369.32 123.46 366.50 134.05 Q 366.35 134.59 365.06 141.92 C 364.76 143.59 364.47 151.23 364.28 151.23 C 364.10 151.23 363.81 143.59 363.52 141.92 Q 362.23 134.59 362.09 134.05 Q 359.28 123.45 348.73 120.45 Q 343.28 118.91 338.16 118.47 A 0.07 0.07 0.0 0 1 338.16 118.34 Q 343.68 117.74 347.03 116.96 C 355.98 114.90 361.11 109.37 362.64 100.38 Q 364.05 92.04 364.02 91.00 Q 363.89 87.67 364.32 84.94 Q 364.31 84.92 364.32 84.92 Z"/>
          <circle fill="#39FF14" cx="140.46" cy="131.56" r="5.23"/>
          <path fill="#39FF14" d="M 212.13 312.48 L 212.10 314.46 Q 212.10 321.60 212.03 328.76 Q 212.01 331.31 209.87 331.95 Q 197.98 335.51 197.75 335.58 Q 189.58 338.14 175.85 341.20 Q 168.34 342.88 163.36 343.17 A 0.53 0.53 0.0 0 1 162.80 342.64 L 162.80 149.39 A 1.51 1.39 -42.6 0 1 162.82 149.15 Q 163.09 147.63 165.11 146.40 Q 166.04 145.83 168.05 145.83 Q 231.47 145.85 267.72 145.83 C 274.22 145.83 280.99 146.90 286.75 147.78 Q 295.74 149.15 305.69 153.34 Q 338.61 167.22 347.19 202.03 Q 348.28 206.45 348.99 213.07 C 349.94 221.86 349.34 228.82 348.50 235.72 C 348.06 239.30 346.99 242.44 346.33 245.60 Q 345.33 250.40 340.30 260.56 A 3.45 3.37 -7.8 0 1 339.45 261.65 C 323.63 275.20 305.41 286.58 286.99 296.85 A 4.30 4.16 -65.9 0 1 286.07 297.22 Q 276.23 299.90 265.74 300.00 Q 248.88 300.17 218.36 300.15 Q 214.11 300.15 212.38 304.32 A 2.24 2.19 -34.3 0 0 212.21 305.17 L 212.13 312.48 Z M 211.66 194.70 L 211.66 254.36 A 4.68 4.68 0.0 0 0 216.34 259.04 L 264.52 259.04 A 34.74 32.94 0.0 0 0 299.26 226.10 L 299.26 222.96 A 34.74 32.94 0.0 0 0 264.52 190.02 L 216.34 190.02 A 4.68 4.68 0.0 0 0 211.66 194.70 Z"/>
          <path fill="#39FF14" d="M 358.17 178.09 Q 359.31 177.76 361.03 177.57 Q 368.51 176.75 373.24 176.58 Q 386.57 176.09 395.20 179.79 Q 404.73 183.87 406.86 193.83 Q 407.10 194.94 406.94 199.78 Q 406.84 202.96 406.02 205.64 Q 402.84 215.90 397.35 224.15 Q 387.47 238.99 373.19 252.70 C 344.93 279.81 311.42 301.80 276.58 320.07 Q 260.73 328.39 245.69 334.66 Q 225.79 342.96 215.66 346.36 Q 212.79 347.33 212.49 347.59 A 1.24 1.21 -19.2 0 0 212.07 348.44 Q 212.02 349.22 212.20 372.33 C 212.25 379.31 211.14 384.01 203.53 383.98 Q 195.27 383.94 169.63 383.91 Q 164.49 383.91 162.85 378.22 A 0.99 0.61 -65.4 0 1 162.82 377.98 L 162.78 359.36 A 0.81 0.80 88.7 0 0 161.94 358.55 Q 146.91 359.12 133.75 357.99 Q 131.82 357.82 124.59 356.24 C 112.89 353.68 100.22 347.12 95.35 335.68 C 94.29 333.19 93.56 328.21 93.84 325.04 Q 94.61 316.52 97.68 309.44 Q 102.68 297.93 110.91 287.65 Q 125.55 269.37 144.76 255.64 A 0.21 0.21 0.0 0 1 145.05 255.68 L 145.06 255.68 A 0.22 0.21 51.8 0 1 145.03 255.98 Q 126.69 272.35 113.17 290.88 C 106.11 300.54 99.36 313.90 100.18 325.32 Q 100.94 336.13 111.76 343.04 Q 117.95 346.99 124.70 348.55 C 127.81 349.26 131.62 350.15 135.49 350.46 Q 148.98 351.56 159.74 350.24 Q 194.30 345.98 223.87 334.82 C 250.30 324.85 275.52 311.35 299.84 296.84 Q 337.62 274.29 370.43 243.97 C 381.31 233.91 391.73 222.61 397.61 209.55 C 400.07 204.08 401.39 194.58 397.39 189.39 C 393.90 184.87 388.28 181.81 383.16 180.62 C 380.03 179.89 377.70 179.09 374.83 178.82 Q 366.64 178.04 358.25 178.53 A 0.12 0.12 0.0 0 1 358.12 178.41 L 358.12 178.15 A 0.06 0.06 0.0 0 1 358.17 178.09 Z"/>
          <ellipse fill="#39FF14" cx="340.22" cy="336.09" rx="5.41" ry="5.30" transform="rotate(-12.4)"/>
          <ellipse fill="#39FF14" cx="296.80" cy="384.42" rx="4.31" ry="4.08" transform="rotate(-181.0)"/>
        </g>
      </g>
    );
  };

  const renderDots = () => {
    if (!isActive || isSpecial) return null;
    
    let dotColor = '#898989'; 
    let dotOpacity = opacity * 0.8;
    
    if (opacity > 0.75) {
      // Phase 1: Bright green
      dotColor = '#7EE03E';
      dotOpacity = opacity;
    } else if (opacity > 0.5) {
      // Phase 2: Transition from green to gray
      const transitionProgress = (0.75 - opacity) / 0.25; // 0 to 1
      
      // Interpolate between green and gray
      const r = Math.round(126 + (137 - 126) * transitionProgress); 
      const g = Math.round(224 + (137 - 224) * transitionProgress); 
      const b = Math.round(62 + (137 - 62) * transitionProgress);  
      
      dotColor = `rgb(${r}, ${g}, ${b})`;
      dotOpacity = opacity * 0.9;
    } else {
      // Phase 3: Gray fading to transparent
      dotColor = '#898989';
      dotOpacity = opacity * 0.8;
    }
    
    const dots = [];
    const dotSpacing = 16;
    const hexRadius = 50;
    
    const isInsideHexagon = (x: number, y: number, radius: number) => {
      const angles = Array.from({ length: 6 }, (_, i) => (60 * i * Math.PI) / 180);
      const hexPoints = angles.map(angle => ([
        radius * Math.cos(angle),
        radius * Math.sin(angle)
      ]));
      
      let inside = false;
      for (let i = 0, j = hexPoints.length - 1; i < hexPoints.length; j = i++) {
        const xi = hexPoints[i][0], yi = hexPoints[i][1];
        const xj = hexPoints[j][0], yj = hexPoints[j][1];
        
        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
          inside = !inside;
        }
      }
      return inside;
    };
    
    // Dots in a grid pattern
    for (let i = -hexRadius; i <= hexRadius; i += dotSpacing) {
      for (let j = -hexRadius; j <= hexRadius; j += dotSpacing) {
        if (isInsideHexagon(i, j, hexRadius)) {
          dots.push(
            <circle
              key={`${i}-${j}`}
              cx={x + i}
              cy={y + j}
              r="1.5"
              fill={dotColor}
              opacity={dotOpacity}
              style={{
                transition: 'fill 1.5s ease-out, opacity 1.5s ease-out'
              }}
            />
          );
        }
      }
    }
    
    return <g>{dots}</g>;
  };

  return (
    <g>
      {/* Invisible hit area for hover detection */}
      <circle
        cx={x}
        cy={y}
        r={size * 0.9}
        fill="transparent"
        stroke="none"
        style={{
          cursor: 'pointer',
          pointerEvents: 'all'
        }}
        onMouseEnter={handleMouseEnter}
      />
      
      {/* Holographic effect overlay for special hexagons */}
      {isSpecial && holographicActive && (
        <g style={{ pointerEvents: 'none' }}>
          <defs>
            <clipPath id={`hexClip-${hexId}`}>
              <path d={hexPath} />
            </clipPath>
          </defs>
          <g clipPath={`url(#hexClip-${hexId})`}>
            <rect
              x={x - size * 1.5}
              y={y - size * 1.5}
              width={size * 3}
              height={size * 3}
              fill="url(#holographicSweep)"
              style={{
                transformOrigin: `${x}px ${y}px`,
                animation: `holographicSweep-${hexId} 1.2s ease-in-out`
              }}
            />
          </g>
          <path
            d={hexPath}
            fill="none"
            stroke="#7EE03E"
            strokeWidth="1.5"
            style={{
              filter: 'drop-shadow(0 0 4px #7EE03E)',
              opacity: 0.6
            }}
          />
        </g>
      )}
      
      {/* Visual elements with proper opacity/blur */}
      <g 
        opacity={baseOpacity} 
        style={{ 
          transition: 'opacity 0.3s ease-in-out',
          pointerEvents: 'none' 
        }}
      >
        {blurInfo.type === 'opacityGradient' ? (
          /* Opacity gradient hexagon */
          <g mask={`url(#${blurInfo.direction}Mask)`}>
            <path
              d={hexPath}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              style={{
                transition: 'stroke 1.5s ease-out, stroke-width 0.3s ease-out',
                filter: glowEffect,
                strokeOpacity: isActive ? Math.min(opacity * 1.2, 1) : (neighborGlow > 0 ? 1 : 1)
              }}
            />
          </g>
        ) : blurInfo.type === 'gradient' ? (
          <>
            {/* Base layer - no blur */}
            <path
              d={hexPath}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              style={{
                transition: 'stroke 1.5s ease-out, stroke-width 0.3s ease-out',
                filter: glowEffect,
                strokeOpacity: isActive ? Math.min(opacity * 1.2, 1) : (neighborGlow > 0 ? 1 : 1)
              }}
            />
            
            {/* Gradient blur layer */}
            <g mask={`url(#${blurInfo.direction}Mask)`}>
              <path
                d={hexPath}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                style={{
                  transition: 'stroke 1.5s ease-out, stroke-width 0.3s ease-out',
                  filter: `blur(${blurInfo.blur}px) ${glowEffect}`,
                  strokeOpacity: isActive ? Math.min(opacity * 1.2, 1) : (neighborGlow > 0 ? 1 : 1)
                }}
              />
            </g>
          </>
        ) : (
          /* Regular hexagon with full blur or no blur */
          <path
            d={hexPath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            style={{
              transition: 'stroke 1.5s ease-out, stroke-width 0.3s ease-out',
              filter: `blur(${blurInfo.blur}px) ${glowEffect}`,
              strokeOpacity: isActive ? Math.min(opacity * 1.2, 1) : (neighborGlow > 0 ? 1 : 1)
            }}
          />
        )}
        
        {renderPlutorSymbol()}
        {renderDots()}
      </g>
    </g>
  );
};

interface HexPatternProps {
  width?: number;
  height?: number;
  className?: string;
  flipped?: boolean;
  interactive?: boolean;
}

export const HexPattern: React.FC<HexPatternProps> = ({ 
  width = 451, 
  height = 850, 
  className = '',
  flipped = false,
  interactive = true
}) => {
  const [activeHexagons, setActiveHexagons] = useState<Map<string, number>>(new Map());
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  const hexSize = 68;
  const hexWidth = hexSize * 2;
  const hexHeight = hexSize * Math.sqrt(3);
  const cols = 4;
  const rows = 9;


  const handleHexHover = useCallback((hexId: string) => {
    const existingTimeout = timeoutsRef.current.get(hexId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    setActiveHexagons(prev => {
      const newMap = new Map(prev);
      newMap.set(hexId, 1);
      return newMap;
    });

    const fadeOutTimeout = setTimeout(() => {
      let startTime: number;
      const fadeDuration = 1500; // 1.5 seconds
      
      const fade = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / fadeDuration, 1);
        
        const newOpacity = 1 - progress;
        
        setActiveHexagons(prev => {
          const newMap = new Map(prev);
          if (newOpacity <= 0) {
            newMap.delete(hexId);
          } else {
            newMap.set(hexId, newOpacity);
          }
          return newMap;
        });
        
        if (progress < 1) {
          requestAnimationFrame(fade);
        } else {
          timeoutsRef.current.delete(hexId);
        }
      };
      
      requestAnimationFrame(fade);
    }, 0); // Start fading immediately for the 1.5s effect

    timeoutsRef.current.set(hexId, fadeOutTimeout);
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  useEffect(() => {
    if (!interactive) return;
    
    const trailSequence = ['1-0', '1-1', '2-1', '3-2', '3-3', 'R3-3', 'R3-2', 'R2-1', 'R1-1', 'R1-0'];
    const reverseSequence = [...trailSequence].reverse();
    const animationDelay = 250; 
    const pauseBetweenCycles = 3000;
    const pauseBetweenFullCycles = 8000;
    
    const runTrailAnimation = (sequence: string[], isReverse = false) => {
      sequence.forEach((hexId, index) => {
        const timeout = setTimeout(() => {
          handleHexHover(hexId);
        }, index * animationDelay);
        
        timeoutsRef.current.set(`trail-${hexId}-${isReverse}`, timeout);
      });
    };
    
    const startTrailCycle = () => {
      runTrailAnimation(trailSequence, false);
      
      const reverseTimeout = setTimeout(() => {
        runTrailAnimation(reverseSequence, true);
      }, (trailSequence.length * animationDelay) + pauseBetweenCycles);
      
      timeoutsRef.current.set('trail-reverse-start', reverseTimeout);
    };
    
    startTrailCycle();
    
    const fullCycleTime = (trailSequence.length * 2 * animationDelay) + pauseBetweenCycles + pauseBetweenFullCycles;
    const trailInterval = setInterval(startTrailCycle, fullCycleTime);
    
    return () => {
      clearInterval(trailInterval);
    };
  }, [interactive, handleHexHover]);

  const hexagons = useMemo(() => {
    const result: any[] = [];
    const hexWidth = hexSize * Math.sqrt(2.7); // Width of flat-top hexagon
    const hexHeight = hexSize * 2; // Height of flat-top hexagon
    const horizontalSpacing = hexWidth * 0.92; 
    const verticalSpacing = hexHeight * 0.871; 
    const startY = hexSize + 30;
    
    const hexagonsToRender = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if ((row === 2 && col === 3) || 
            (row === 4 && col === 3) || 
            (row === 6 && col === 3) ||
            (row === 7 && (col === 2 || col === 3)) ||
            (row === 8 && (col === 2 || col === 3))) { 
          continue;
        }
        
        const isOddCol = col % 2 === 1;
        let x = col * horizontalSpacing + hexSize - 50;
        const y = row * verticalSpacing + (isOddCol ? 59 : 0) + startY - 160;
        
        const hexId = flipped ? `R${row}-${col}` : `${row}-${col}`;
        
        const centerRow = 3;
        const centerCol = 1.5;
        const distanceFromCenter = Math.sqrt(
          Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
        );
        
        hexagonsToRender.push({
          hexId,
          x,
          y,
          row,
          col,
          distanceFromCenter
        });
        
      }
    }
    
    hexagonsToRender.sort((a, b) => b.distanceFromCenter - a.distanceFromCenter);
    
    hexagonsToRender.forEach(({ hexId, x, y, row, col }) => {
      result.push(
        <Hexagon
          key={hexId}
          x={x}
          y={y}
          size={hexSize}
          row={row}
          col={col}
          hexId={hexId}
          activeHexagons={activeHexagons}
          onHexHover={handleHexHover}
          flipped={flipped}
        />
      );
    });
    
    return result;
  }, [rows, cols, hexSize, activeHexagons, handleHexHover]);

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`} 
      className={className}
      style={{ 
        transform: flipped ? 'scaleX(-1)' : 'none',
        opacity: 0.5
      }}
    >
      <defs>
        {/* Holographic effect gradients and definitions */}
        <linearGradient id="holographicSweep" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="transparent"/>
          <stop offset="20%" stopColor="transparent"/>
          <stop offset="40%" stopColor="#7EE03E" stopOpacity="0.15"/>
          <stop offset="50%" stopColor="#39FF14" stopOpacity="0.4"/>
          <stop offset="60%" stopColor="#7EE03E" stopOpacity="0.15"/>
          <stop offset="80%" stopColor="transparent"/>
          <stop offset="100%" stopColor="transparent"/>
        </linearGradient>
        
        <style>{`
          @keyframes holographicSweep-2-1 {
            0% {
              transform: translateX(-120px) translateY(-120px) rotate(-45deg);
              opacity: 0;
            }
            20% {
              opacity: 0.3;
            }
            50% {
              opacity: 1;
            }
            80% {
              opacity: 0.3;
            }
            100% {
              transform: translateX(120px) translateY(120px) rotate(-45deg);
              opacity: 0;
            }
          }
          @keyframes holographicSweep-R4-1 {
            0% {
              transform: translateX(-120px) translateY(-120px) rotate(-45deg);
              opacity: 0;
            }
            20% {
              opacity: 0.3;
            }
            50% {
              opacity: 1;
            }
            80% {
              opacity: 0.3;
            }
            100% {
              transform: translateX(120px) translateY(120px) rotate(-45deg);
              opacity: 0;
            }
          }
          @keyframes holographicSweep-5-1 {
            0% {
              transform: translateX(-120px) translateY(0px) rotate(0deg);
              opacity: 0;
            }
            20% {
              opacity: 0.3;
            }
            50% {
              opacity: 1;
            }
            80% {
              opacity: 0.3;
            }
            100% {
              transform: translateX(120px) translateY(0px) rotate(0deg);
              opacity: 0;
            }
          }
          @keyframes holographicSweep-R1-1 {
            0% {
              transform: translateX(-120px) translateY(0px) rotate(0deg);
              opacity: 0;
            }
            20% {
              opacity: 0.3;
            }
            50% {
              opacity: 1;
            }
            80% {
              opacity: 0.3;
            }
            100% {
              transform: translateX(120px) translateY(0px) rotate(0deg);
              opacity: 0;
            }
          }
        `}</style>
        
        <g id="hexDotPattern">
          {/* Create fewer dots in a hexagonal pattern */}
          {(() => {
            const dots = [];
            const dotSpacing = 16; 
            const hexRadius = 50; 
            
            const isInsideHexagon = (x: number, y: number, radius: number) => {
              const angles = Array.from({ length: 6 }, (_, i) => (60 * i * Math.PI) / 180);
              const hexPoints = angles.map(angle => ([
                radius * Math.cos(angle),
                radius * Math.sin(angle)
              ]));
              
              let inside = false;
              for (let i = 0, j = hexPoints.length - 1; i < hexPoints.length; j = i++) {
                const xi = hexPoints[i][0], yi = hexPoints[i][1];
                const xj = hexPoints[j][0], yj = hexPoints[j][1];
                
                if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
                  inside = !inside;
                }
              }
              return inside;
            };
            
            for (let i = -hexRadius; i <= hexRadius; i += dotSpacing) {
              for (let j = -hexRadius; j <= hexRadius; j += dotSpacing) {
                if (isInsideHexagon(i, j, hexRadius)) {
                  dots.push(
                    <circle
                      key={`${i}-${j}`}
                      cx={i}
                      cy={j}
                      r="1.5"
                      fill="#898989"
                    />
                  );
                }
              }
            }
            
            return dots;
          })()}
        </g>
        
        {/* Radial gradient blur mask for corners */}
        <mask id="cornerBlurMask">
          <rect width="100%" height="100%" fill="black"/>
          
          {/* Top left corner gradient - adjusted for actual hex position */}
          <ellipse 
            cx="-50" 
            cy="-100" 
            rx="250" 
            ry="200" 
            fill="url(#topLeftBlurGradient)"
          />
          
          {/* Top right corner gradient - adjusted for actual hex position */}
          <ellipse 
            cx={width + 50} 
            cy="-100" 
            rx="250" 
            ry="200" 
            fill="url(#topRightBlurGradient)"
          />
        </mask>
        
        {/* Gradients for blur intensity */}
        <radialGradient id="topLeftBlurGradient" cx="0%" cy="0%">
          <stop offset="0%" stopColor="white" stopOpacity="1"/>
          <stop offset="60%" stopColor="white" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="black" stopOpacity="0"/>
        </radialGradient>
        
        <radialGradient id="topRightBlurGradient" cx="100%" cy="0%">
          <stop offset="0%" stopColor="white" stopOpacity="1"/>
          <stop offset="60%" stopColor="white" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="black" stopOpacity="0"/>
        </radialGradient>
        
        {/* Multiple blur filters for gradient effect */}
        <filter id="lightBlur">
          <feGaussianBlur stdDeviation="1"/>
        </filter>
        
        <filter id="mediumBlur">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
        
        <filter id="strongBlur">
          <feGaussianBlur stdDeviation="3"/>
        </filter>
        
        {/* Partial blur masks for half-hexagon effects */}
        <mask id="topHalfMask">
          <rect width="100%" height="100%" fill="black"/>
          <rect width="100%" height="50%" fill="white"/>
        </mask>
        
        <mask id="leftHalfMask">
          <rect width="100%" height="100%" fill="black"/>
          <rect width="50%" height="100%" fill="white"/>
        </mask>
        
        <mask id="topLeftQuarterMask">
          <rect width="100%" height="100%" fill="black"/>
          <rect width="50%" height="50%" fill="white"/>
        </mask>
        
        {/* Gradient masks for smoother transitions */}
        <mask id="topGradientMask">
          <rect width="100%" height="100%" fill="url(#topToBottomGradient)"/>
        </mask>
        
        <mask id="leftGradientMask">
          <rect width="100%" height="100%" fill="url(#leftToRightGradient)"/>
        </mask>
        
        <linearGradient id="topToBottomGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="1"/>
          <stop offset="50%" stopColor="white" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="black" stopOpacity="0"/>
        </linearGradient>
        
        <linearGradient id="leftToRightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="1"/>
          <stop offset="50%" stopColor="white" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="black" stopOpacity="0"/>
        </linearGradient>
        
        {/* Diagonal gradient for 1-1 hexagon */}
        <linearGradient id="topLeftToBottomRightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="1"/>
          <stop offset="50%" stopColor="white" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="black" stopOpacity="0"/>
        </linearGradient>
        
        {/* Simple half-masks for diagonal hexagons */}
        <mask id="diagonal20Mask">
          <rect width="100%" height="100%" fill="black"/>
          <rect width="50%" height="50%" fill="white"/>
        </mask>
        
        <mask id="diagonal11Mask">
          <rect width="100%" height="100%" fill="black"/>
          <rect width="100%" height="50%" fill="white"/>
        </mask>
        
        <mask id="diagonal12Mask">
          <rect width="100%" height="100%" fill="black"/>
          <rect width="100%" height="50%" fill="white"/>
        </mask>
        
        <mask id="diagonal03Mask">
          <rect width="100%" height="100%" fill="black"/>
          <rect width="50%" height="100%" fill="white"/>
        </mask>
        
        {/* Opacity gradient masks for smooth transitions */}
        <mask id="opacityGradient20Mask">
          <rect width="100%" height="100%" fill="url(#opacityGradient20)"/>
        </mask>
        
        <mask id="opacityGradient11Mask">
          <rect width="100%" height="100%" fill="url(#opacityGradient11)"/>
        </mask>
        
        <mask id="opacityGradient12Mask">
          <rect width="100%" height="100%" fill="url(#opacityGradient12)"/>
        </mask>
        
        <mask id="opacityGradient03Mask">
          <rect width="100%" height="100%" fill="url(#opacityGradient03)"/>
        </mask>
        
        {/* Additional masks for second ring */}
        <mask id="opacityGradient30Mask">
          <rect width="100%" height="100%" fill="url(#opacityGradient30)"/>
        </mask>
        
        <mask id="opacityGradient21Mask">
          <rect width="100%" height="100%" fill="url(#opacityGradient21)"/>
        </mask>
        
        <mask id="opacityGradient02Mask">
          <rect width="100%" height="100%" fill="url(#opacityGradient02)"/>
        </mask>
        
        <mask id="opacityGradient13Mask">
          <rect width="100%" height="100%" fill="url(#opacityGradient13)"/>
        </mask>
        
        {/* Gradients for opacity transitions - adjusted for smoother fade */}
        <linearGradient id="opacityGradient20" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.15"/>
          <stop offset="50%" stopColor="white" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="white" stopOpacity="1"/>
        </linearGradient>
        
        <linearGradient id="opacityGradient11" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.2"/>
          <stop offset="50%" stopColor="white" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="white" stopOpacity="1"/>
        </linearGradient>
        
        <linearGradient id="opacityGradient12" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.25"/>
          <stop offset="60%" stopColor="white" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="white" stopOpacity="1"/>
        </linearGradient>
        
        <linearGradient id="opacityGradient03" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3"/>
          <stop offset="70%" stopColor="white" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="white" stopOpacity="1"/>
        </linearGradient>
        
        {/* Second ring gradients - higher baseline opacity */}
        <linearGradient id="opacityGradient30" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
          <stop offset="80%" stopColor="white" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="white" stopOpacity="1"/>
        </linearGradient>
        
        <linearGradient id="opacityGradient21" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.45"/>
          <stop offset="70%" stopColor="white" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="white" stopOpacity="1"/>
        </linearGradient>
        
        <linearGradient id="opacityGradient02" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5"/>
          <stop offset="80%" stopColor="white" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="white" stopOpacity="1"/>
        </linearGradient>
        
        <linearGradient id="opacityGradient13" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55"/>
          <stop offset="90%" stopColor="white" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="white" stopOpacity="1"/>
        </linearGradient>
      </defs>
      
      {hexagons}
    </svg>
  );
};