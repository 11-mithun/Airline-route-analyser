import React, { useRef, useEffect, useState, useMemo } from 'react';

// Airport node representation
interface Airport {
  code: string;
  name: string;
  position: [number, number, number]; // We'll convert 3D positions to 2D for SVG
}

// Route with profitability information
interface Route {
  from: string;
  to: string;
  profitability: number;
  volume: number;
}

interface NetworkMapProps {
  airports: Airport[];
  routes: Route[];
  height?: number;
}

// Convert 3D coordinates to 2D SVG viewport
const projectPosition = (position: [number, number, number], viewportSize: { width: number, height: number }) => {
  // Simple projection: just use x and z for horizontal plane, discard y (height)
  const [x, _, z] = position;
  
  // Scale and center within the viewport
  const scale = Math.min(viewportSize.width, viewportSize.height) / 10;
  const centerX = viewportSize.width / 2;
  const centerY = viewportSize.height / 2;
  
  return {
    x: centerX + x * scale,
    y: centerY + z * scale
  };
};

// Calculate curved path between two points
const calculateArcPath = (
  start: { x: number, y: number }, 
  end: { x: number, y: number },
  curvature: number = 0.2
) => {
  // Calculate midpoint
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  
  // Calculate distance
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate control point (perpendicular to line)
  const perpX = -dy;
  const perpY = dx;
  const perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
  
  // Create control point
  const controlX = midX + (perpX / perpLength) * distance * curvature;
  const controlY = midY + (perpY / perpLength) * distance * curvature;
  
  return `M ${start.x},${start.y} Q ${controlX},${controlY} ${end.x},${end.y}`;
};

// A line representing a route between airports
const RouteLine: React.FC<{
  from: { x: number, y: number };
  to: { x: number, y: number };
  profitability: number;
  volume: number;
  animationOffset: number;
}> = ({ from, to, profitability, volume, animationOffset }) => {
  // Determine color based on profitability
  const color = useMemo(() => {
    if (profitability < 0) return '#E53935'; // Bad
    if (profitability < 0.5) return '#FFC107'; // Warning
    return '#4CAF50'; // Good
  }, [profitability]);
  
  // Line thickness based on volume
  const strokeWidth = useMemo(() => 
    Math.max(1, Math.min(5, volume * 0.5)), 
    [volume]
  );
  
  // Calculate path
  const path = useMemo(() => 
    calculateArcPath(from, to), 
    [from.x, from.y, to.x, to.y]
  );
  
  // Animation properties
  const dashArray = 10;
  const animationSpeed = profitability > 0 ? 200 : 400; // Faster animation for profitable routes
  
  return (
    <g className="route-line">
      {/* Base path */}
      <path
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={0.3}
        fill="none"
      />
      
      {/* Animated overlay */}
      <path
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        strokeDashoffset={animationOffset * animationSpeed % (dashArray * 2)}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
};

// Airport node visualization
const AirportNode: React.FC<{
  position: { x: number, y: number };
  airport: Airport;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  animationFrame: number;
}> = ({ position, airport, isHovered, onMouseEnter, onMouseLeave, animationFrame }) => {
  // Pulse animation effect
  const scale = 1 + Math.sin(animationFrame * 0.05) * 0.1;
  const hoverScale = isHovered ? 1.5 : 1;
  const radius = 8 * scale * hoverScale;
  
  return (
    <g className="airport-node" 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}
    >
      {/* Glow effect for hover */}
      {isHovered && (
        <circle
          cx={position.x}
          cy={position.y}
          r={16}
          fill="url(#airportGlow)"
        />
      )}
      
      {/* Main circle */}
      <circle
        cx={position.x}
        cy={position.y}
        r={radius}
        fill="#4CAF50"
        className={isHovered ? "cursor-pointer" : ""}
      />
      
      {/* Label */}
      <g className={`airport-label ${isHovered ? 'visible' : ''}`}>
        <rect
          x={position.x + 12}
          y={position.y - 10}
          width={airport.code.length * 10 + 10}
          height={20}
          rx={4}
          fill="rgba(24, 24, 36, 0.85)"
          stroke={isHovered ? "#4CAF50" : "#444"}
          strokeWidth={isHovered ? 2 : 1}
        />
        <text
          x={position.x + 17}
          y={position.y + 5}
          fontSize={12}
          fontFamily="monospace"
          fontWeight={isHovered ? "bold" : "normal"}
          fill="#fff"
        >
          {airport.code}
        </text>
      </g>
    </g>
  );
};

// Main network map component that renders the SVG visualization
const NetworkMap: React.FC<NetworkMapProps> = ({ airports, routes, height = 500 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [animationFrame, setAnimationFrame] = useState(0);
  const [animationOffset, setAnimationOffset] = useState(0);
  const [hoveredAirport, setHoveredAirport] = useState<string | null>(null);

  // Initialize and handle resize
  useEffect(() => {
    const updateViewportSize = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setViewportSize({ width, height });
      }
    };

    // Initial size
    updateViewportSize();

    // Listen for resize
    window.addEventListener('resize', updateViewportSize);
    
    return () => {
      window.removeEventListener('resize', updateViewportSize);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = 0;
    
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      
      // Update animation state
      setAnimationFrame(prev => prev + 1);
      setAnimationOffset(prev => prev + deltaTime * 0.001); // Convert ms to seconds
      
      lastTimestamp = timestamp;
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Project all airport positions to 2D
  const projectedAirports = useMemo(() => {
    if (viewportSize.width === 0) return new Map();
    
    const projections = new Map();
    airports.forEach(airport => {
      projections.set(airport.code, {
        ...airport,
        projectedPosition: projectPosition(airport.position, viewportSize)
      });
    });
    
    return projections;
  }, [airports, viewportSize]);

  // Find connected routes for the hovered airport
  const connectedRoutes = useMemo(() => {
    if (!hoveredAirport) return new Set();
    
    const connected = new Set<string>();
    routes.forEach(route => {
      if (route.from === hoveredAirport) {
        connected.add(`${route.from}-${route.to}`);
      } else if (route.to === hoveredAirport) {
        connected.add(`${route.from}-${route.to}`);
      }
    });
    
    return connected;
  }, [hoveredAirport, routes]);

  if (viewportSize.width === 0) {
    return <div style={{ height }} className="bg-midnight rounded-lg relative" />;
  }

  return (
    <div className="relative" style={{ height }}>
      <svg 
        ref={svgRef} 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
        className="bg-midnight rounded-lg overflow-hidden"
      >
        {/* Definitions for gradients and filters */}
        <defs>
          <radialGradient id="airportGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4CAF50" stopOpacity="0" />
          </radialGradient>
          
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Background grid */}
        <g className="grid">
          {Array.from({ length: 20 }).map((_, i) => (
            <React.Fragment key={`grid-${i}`}>
              <line 
                x1={viewportSize.width * i / 20} 
                y1={0} 
                x2={viewportSize.width * i / 20} 
                y2={viewportSize.height} 
                stroke="#333" 
                strokeWidth={i % 5 === 0 ? 0.5 : 0.2} 
              />
              <line 
                x1={0} 
                y1={viewportSize.height * i / 20} 
                x2={viewportSize.width} 
                y2={viewportSize.height * i / 20} 
                stroke="#333" 
                strokeWidth={i % 5 === 0 ? 0.5 : 0.2} 
              />
            </React.Fragment>
          ))}
        </g>
        
        {/* Route connections - draw first so they appear under airports */}
        <g className="routes">
          {routes.map((route, index) => {
            const fromAirport = projectedAirports.get(route.from);
            const toAirport = projectedAirports.get(route.to);
            const routeId = `${route.from}-${route.to}`;
            const isHighlighted = hoveredAirport ? connectedRoutes.has(routeId) : false;
            
            if (!fromAirport || !toAirport) return null;
            
            return (
              <RouteLine 
                key={`route-${index}`}
                from={fromAirport.projectedPosition}
                to={toAirport.projectedPosition}
                profitability={route.profitability}
                volume={isHighlighted ? route.volume * 1.5 : route.volume}
                animationOffset={animationOffset}
              />
            );
          })}
        </g>
        
        {/* Airport nodes - draw last so they appear on top */}
        <g className="airports">
          {Array.from(projectedAirports.values()).map((airport: any, index) => (
            <AirportNode 
              key={`airport-${index}`}
              position={airport.projectedPosition}
              airport={airport}
              isHovered={hoveredAirport === airport.code}
              onMouseEnter={() => setHoveredAirport(airport.code)}
              onMouseLeave={() => setHoveredAirport(null)}
              animationFrame={animationFrame}
            />
          ))}
        </g>
        
        {/* Data flow visualization for connected routes */}
        {hoveredAirport && (
          <g className="data-flow-markers">
            {/* Type-safe iteration over Set values */}
            {Array.from(connectedRoutes).map((routeId: unknown) => {
              // Explicitly cast routeId to string to fix the type issue
              const routeIdStr = String(routeId);
              const [from, to] = routeIdStr.split('-');
              const route = routes.find(r => r.from === from && r.to === to);
              
              if (!route) return null;
              
              const fromAirport = projectedAirports.get(route.from);
              const toAirport = projectedAirports.get(route.to);
              
              if (!fromAirport || !toAirport) return null;
              
              // Calculate animation position along path
              const t = (animationOffset * 50) % 100 / 100;
              const startPos = fromAirport.projectedPosition;
              const endPos = toAirport.projectedPosition;
              
              // Simple linear interpolation for marker position
              const x = startPos.x + (endPos.x - startPos.x) * t;
              const y = startPos.y + (endPos.y - startPos.y) * t;
              
              return (
                <circle
                  key={`flow-${routeIdStr}`}
                  cx={x}
                  cy={y}
                  r={3}
                  fill={route.profitability >= 0 ? "#4CAF50" : "#E53935"}
                  filter="url(#glow)"
                />
              );
            })}
          </g>
        )}
      </svg>
      
      {/* Legend */}
      <div className="absolute top-2 right-2 bg-midnight-dark rounded-md p-2 text-xs text-gray-400 border border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 rounded-full bg-forest"></div>
          <span>High Profitability</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <div className="w-4 h-1 rounded-full bg-yellow-500"></div>
          <span>Medium Profitability</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <div className="w-4 h-1 rounded-full bg-accent-red"></div>
          <span>Low/Negative Profitability</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <div className="w-1 h-1 rounded-full bg-white"></div>
          <div className="w-1 h-1 rounded-full bg-white mx-1"></div>
          <div className="w-1 h-1 rounded-full bg-white"></div>
          <span>Data Flow</span>
        </div>
      </div>
      
      {/* Additional controls could be added here */}
      <div className="absolute bottom-2 left-2 flex space-x-2">
        <button className="p-1 bg-midnight-dark rounded-md hover:bg-midnight-light transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </button>
        <button className="p-1 bg-midnight-dark rounded-md hover:bg-midnight-light transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="12" cy="12" r="10"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </button>
        <button className="p-1 bg-midnight-dark rounded-md hover:bg-midnight-light transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </div>
      
      {/* Info panel for hovered airport */}
      {hoveredAirport && (
        <div className="absolute bottom-2 right-2 bg-midnight-dark rounded-md p-2 text-xs border border-gray-700" style={{maxWidth: '250px'}}>
          <h4 className="font-semibold text-white">{hoveredAirport} Details</h4>
          <div className="text-gray-400 mt-1">
            <p>Connected Routes: {connectedRoutes.size}</p>
            <p>Average Profitability: {Math.round(
              routes
                .filter(r => r.from === hoveredAirport || r.to === hoveredAirport)
                .reduce((sum, r) => sum + r.profitability, 0) / 
              Math.max(1, connectedRoutes.size) * 100
            )}%</p>
            <p>Total Volume: {routes
              .filter(r => r.from === hoveredAirport || r.to === hoveredAirport)
              .reduce((sum, r) => sum + r.volume, 0)
            }</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkMap;
