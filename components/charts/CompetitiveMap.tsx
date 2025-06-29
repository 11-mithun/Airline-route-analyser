import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// Airport node representation
interface Airport {
  code: string;
  name: string;
  position: [number, number, number]; // 3D coordinates
  country: string;
  traffic?: number; // Optional traffic volume
}

// Route with profitability and competitor information
interface CompetitiveRoute {
  from: string;
  to: string;
  profitability: number;
  volume: number;
  competitors: Array<{
    name: string;
    marketShare: number;
    efficiency: number;
  }>;
}

interface CompetitiveMapProps {
  airports: Airport[];
  routes: CompetitiveRoute[];
  height?: number;
  selectedMetric?: 'profitability' | 'marketShare' | 'efficiency';
  onRouteSelect?: (route: CompetitiveRoute) => void;
}

// Advanced 3D projection with perspective
const project3DTo2D = (position: [number, number, number], rotation: number, perspective: number, viewportSize: { width: number, height: number }) => {
  const [x, y, z] = position;
  
  // Apply rotation
  const cosR = Math.cos(rotation);
  const sinR = Math.sin(rotation);
  const rotatedX = x * cosR - z * sinR;
  const rotatedZ = z * cosR + x * sinR;
  
  // Apply perspective
  const scale = perspective / (perspective + rotatedZ);
  const projectedX = rotatedX * scale;
  const projectedY = y * scale;
  
  // Center and scale to viewport
  const viewScale = Math.min(viewportSize.width, viewportSize.height) / 12;
  const centerX = viewportSize.width / 2;
  const centerY = viewportSize.height / 2;
  
  return {
    x: centerX + projectedX * viewScale,
    y: centerY - projectedY * viewScale, // Flip Y axis
    z: rotatedZ, // Keep Z for depth sorting
    scale
  };
};

// Calculate 3D bezier curve between points
const calculate3DArcPath = (
  start: { x: number, y: number },
  end: { x: number, y: number },
  startZ: number,
  endZ: number,
  curvature: number = 0.3,
  segments: number = 20
) => {
  // Calculate midpoint with height based on distance
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // The control point is elevated more for longer distances
  const controlY = midY - distance * curvature;
  
  // Start building the path
  let path = `M ${start.x},${start.y}`;
  
  // Create segments for the curve
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    
    // Quadratic Bezier formula
    const x = start.x * mt2 + midX * 2 * mt * t + end.x * t2;
    const y = start.y * mt2 + controlY * 2 * mt * t + end.y * t2;
    
    path += ` L ${x},${y}`;
  }
  
  return path;
};

// Route component with competitors
const CompetitiveRouteLine: React.FC<{
  from: { x: number, y: number, scale: number };
  to: { x: number, y: number, scale: number };
  fromZ: number;
  toZ: number;
  route: CompetitiveRoute;
  selected: boolean;
  onSelect: () => void;
  animationProgress: number;
}> = ({ from, to, fromZ, toZ, route, selected, onSelect, animationProgress }) => {
  // Determine main color based on profitability using forest fire theme
  const mainColor = useMemo(() => {
    if (route.profitability < 0) return '#ff3333'; // Negative - bright red
    if (route.profitability < 0.5) return '#ffcc00'; // Medium - bright yellow
    return '#00ff66'; // High - bright green (forest fire theme)
  }, [route.profitability]);
  
  // Line thickness based on volume
  const strokeWidth = useMemo(() => 
    Math.max(1, Math.min(6, route.volume * 0.6)), 
    [route.volume]
  );
  
  // Calculate path
  const path = useMemo(() => 
    calculate3DArcPath(from, to, fromZ, toZ, 0.3, 40), 
    [from.x, from.y, to.x, to.y, fromZ, toZ]
  );
  
  // Animation settings
  const dashLength = 12;
  const dashGap = 24;
  const dashArray = `${dashLength} ${dashGap}`;
  const pathLength = 1000; // Approximate
  const offset = (animationProgress * 50) % (dashLength + dashGap);
  
  // Opacity based on scale for perspective effect
  const opacity = (from.scale + to.scale) / 2 * 0.7 + 0.3;
  
  // Competitive data visualization
  const hasCompetitors = route.competitors && route.competitors.length > 0;
  
  return (
    <g className="competitive-route-line" onClick={onSelect}>
      {/* Base path with glow effect */}
      <path
        d={path}
        stroke={mainColor}
        strokeWidth={strokeWidth + 4}
        strokeOpacity={selected ? 0.3 : 0.1}
        fill="none"
        filter={selected ? "url(#routeGlow)" : undefined}
      />
      
      {/* Main path */}
      <path
        d={path}
        stroke={mainColor}
        strokeWidth={strokeWidth}
        strokeOpacity={opacity * (selected ? 1 : 0.7)}
        fill="none"
        className={`cursor-pointer transition-all duration-300 ${selected ? 'filter-glow' : ''}`}
      />
      
      {/* Animated overlay - data flow visualization */}
      <path
        d={path}
        stroke={selected ? "#ffffff" : mainColor}
        strokeWidth={strokeWidth - 1}
        strokeDasharray={dashArray}
        strokeDashoffset={offset}
        strokeOpacity={selected ? 0.9 : 0.5}
        fill="none"
        strokeLinecap="round"
      />
      
      {/* If selected, show competitor markers */}
      {selected && hasCompetitors && route.competitors.map((competitor, idx) => {
        // Position markers along the path at different points
        const position = (idx + 1) / (route.competitors.length + 1);
        // Simple linear interpolation for marker position
        const x = from.x + (to.x - from.x) * position;
        const y = from.y + (to.y - from.y) * position;
        
        // Color based on efficiency
        const markerColor = competitor.efficiency > 0.8 ? '#00ffcc' : 
                           competitor.efficiency > 0.5 ? '#ffcc00' : '#ff3333';
        
        // Size based on market share
        const markerSize = Math.max(4, Math.min(12, competitor.marketShare * 20));
        
        return (
          <g key={`competitor-${idx}`} className="competitor-marker">
            <circle
              cx={x}
              cy={y}
              r={markerSize}
              fill={markerColor}
              fillOpacity={0.7}
              stroke="#ffffff"
              strokeWidth={1}
              strokeOpacity={0.8}
            />
            <text
              x={x}
              y={y + markerSize + 10}
              fontSize={10}
              fontFamily="sans-serif"
              fill="#ffffff"
              textAnchor="middle"
              opacity={0.9}
            >
              {competitor.name}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// Enhanced airport visualization
const EnhancedAirportNode: React.FC<{
  projection: { x: number, y: number, z: number, scale: number };
  airport: Airport;
  selected: boolean;
  onSelect: () => void;
  animationProgress: number;
}> = ({ projection, airport, selected, onSelect, animationProgress }) => {
  const { x, y, scale } = projection;
  
  // Pulse animation with increased intensity for selected airports
  const pulseScale = 1 + Math.sin(animationProgress * 4) * (selected ? 0.2 : 0.1);
  const selectionScale = selected ? 1.5 : 1;
  const baseRadius = Math.max(4, Math.min(12, (airport.traffic || 5) * 0.8));
  const radius = baseRadius * scale * pulseScale * selectionScale;
  
  // Opacity based on z position for depth effect
  const opacity = Math.min(1, Math.max(0.3, scale * 1.5));
  
  return (
    <g 
      className={`airport-node ${selected ? 'selected' : ''}`} 
      onClick={onSelect}
    >
      {/* Background glow for selected airports */}
      {selected && (
        <circle
          cx={x}
          cy={y}
          r={radius * 2}
          fill="url(#airportSelectedGlow)"
          opacity={0.7}
        />
      )}
      
      {/* Outer ring with rotating animation */}
      <motion.circle
        cx={x}
        cy={y}
        r={radius * 1.3}
        fill="none"
        stroke="#00ff33"
        strokeWidth={1.5}
        strokeOpacity={selected ? 0.6 : 0.3}
        strokeDasharray="4 6"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          transformOrigin: `${x}px ${y}px`,
        }}
      />
      
      {/* Main node */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={selected ? "#00ff33" : "#006622"}
        fillOpacity={opacity}
        stroke="#00ff99"
        strokeWidth={selected ? 2 : 1}
        strokeOpacity={selected ? 0.8 : 0.4}
        className="cursor-pointer hover:fill-forest-light transition-colors duration-300"
      />
      
      {/* Airport code */}
      <text
        x={x}
        y={y + 3}
        fontSize={radius * 0.9}
        fontFamily="monospace"
        fontWeight="bold"
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity={opacity}
      >
        {airport.code}
      </text>
      
      {/* Extended info for selected airports */}
      {selected && (
        <g className="airport-info">
          <rect
            x={x + radius * 1.5}
            y={y - 30}
            width={airport.name.length * 6 + 20}
            height={60}
            rx={5}
            fill="rgba(0, 10, 5, 0.8)"
            stroke="#00ff33"
            strokeWidth={1}
          />
          <text
            x={x + radius * 1.5 + 10}
            y={y - 10}
            fontSize={12}
            fontWeight="bold"
            fill="#00ff99"
          >
            {airport.name}
          </text>
          <text
            x={x + radius * 1.5 + 10}
            y={y + 10}
            fontSize={10}
            fill="#ffffff"
          >
            {airport.country}
          </text>
          <text
            x={x + radius * 1.5 + 10}
            y={y + 25}
            fontSize={9}
            fill="#00cc99"
          >
            Traffic: {airport.traffic || "N/A"}
          </text>
        </g>
      )}
    </g>
  );
};

// Main competitive map component with 3D visualization and rotation
const CompetitiveMap: React.FC<CompetitiveMapProps> = ({ 
  airports, 
  routes, 
  height = 600,
  selectedMetric = 'profitability',
  onRouteSelect
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height });
  const [rotation, setRotation] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [perspective, setPerspective] = useState(20);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Large set of routes - 100+ routes for advanced visualization
  const [expandedRoutes, setExpandedRoutes] = useState<CompetitiveRoute[]>([]);
  
  // Initialize routes
  useEffect(() => {
    // Set the initial routes directly
    setExpandedRoutes(routes);
    setIsLoaded(true);
  }, [routes]);
  
  // Initialize and handle resize
  useEffect(() => {
    const updateViewportSize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
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
  }, [height]);
  
  // Animation loop with auto-rotation
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = 0;
    
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      
      // Update animation state
      setAnimationProgress(prev => prev + deltaTime * 0.0005);
      
      // Auto-rotation
      if (isAutoRotating) {
        setRotation(prev => (prev + deltaTime * 0.0002) % (Math.PI * 2));
      }
      
      lastTimestamp = timestamp;
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAutoRotating]);
  
  // Compute 3D projections of all airports
  const projectedAirports = useMemo(() => {
    if (viewportSize.width === 0) return new Map();
    
    const projections = new Map();
    
    // Process each airport
    airports.forEach(airport => {
      const projection = project3DTo2D(
        airport.position, 
        rotation, 
        perspective, 
        viewportSize
      );
      
      projections.set(airport.code, {
        ...airport,
        projection,
      });
    });
    
    return projections;
  }, [airports, rotation, perspective, viewportSize]);
  
  // Depth-sorted airports and routes for correct 3D rendering
  const depthSortedElements = useMemo(() => {
    if (viewportSize.width === 0 || expandedRoutes.length === 0) {
      return { airports: [], routes: [] };
    }
    
    // Extract all airport projections
    const airportItems = Array.from(projectedAirports.values()).map((item: any) => ({
      type: 'airport',
      z: item.projection.z,
      data: item
    }));
    
    // Create route items with average z value for depth sorting
    const routeItems = expandedRoutes.map(route => {
      const fromAirport = projectedAirports.get(route.from);
      const toAirport = projectedAirports.get(route.to);
      
      if (!fromAirport || !toAirport) return null;
      
      const avgZ = (fromAirport.projection.z + toAirport.projection.z) / 2;
      
      return {
        type: 'route',
        z: avgZ,
        data: {
          route,
          from: fromAirport.projection,
          to: toAirport.projection,
          fromZ: fromAirport.projection.z,
          toZ: toAirport.projection.z,
        }
      };
    }).filter(Boolean);
    
    // Combine and sort all elements by z-depth (further away first)
    const allItems = [...airportItems, ...routeItems.filter(Boolean)].sort((a, b) => {
      if (!a || !b) return 0;
      return b.z - a.z;
    });
    
    // Split back into separate arrays
    const airports = allItems
      .filter(item => item && item.type === 'airport')
      .map(item => item ? item.data : null)
      .filter(Boolean);
    
    const routes = allItems
      .filter(item => item && item.type === 'route')
      .map(item => item ? item.data : null)
      .filter(Boolean);
    
    return { airports, routes };
  }, [projectedAirports, expandedRoutes, viewportSize]);
  
  // Handle route selection with callback
  const handleRouteSelect = (route: CompetitiveRoute) => {
    const routeId = `${route.from}-${route.to}`;
    setSelectedRoute(prevSelected => prevSelected === routeId ? null : routeId);
    
    if (onRouteSelect) {
      onRouteSelect(route);
    }
  };
  
  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center bg-midnight rounded-lg" style={{ height, width: '100%' }}>
        <div className="text-forest-light">
          <svg className="animate-spin h-10 w-10 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8 8 0 0112 20v-4a4.002 4.002 0 00-3.203-3.924L6 17.291z"></path>
          </svg>
          <p className="mt-2">Generating 3D network data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef} 
      className="relative bg-black rounded-xl overflow-hidden border border-forest border-opacity-30" 
      style={{ height, width: '100%' }}
    >
      {/* Map title and controls */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
        <div className="bg-black bg-opacity-60 rounded-lg p-2 border border-forest border-opacity-30">
          <h3 className="text-md font-semibold text-forest-light glow-text">3D Competitive Route Map</h3>
        </div>
        
        <div className="flex space-x-2">
          <button 
            className={`p-2 rounded-lg text-xs ${isAutoRotating ? 'bg-forest text-black' : 'bg-black text-forest'} border border-forest border-opacity-40`}
            onClick={() => setIsAutoRotating(!isAutoRotating)}
          >
            {isAutoRotating ? 'Stop Rotation' : 'Auto Rotate'}
          </button>
          
          <button 
            className="p-2 rounded-lg bg-black text-forest text-xs border border-forest border-opacity-40"
            onClick={() => setPerspective(prev => Math.min(prev + 5, 40))}
          >
            Zoom In
          </button>
          
          <button 
            className="p-2 rounded-lg bg-black text-forest text-xs border border-forest border-opacity-40"
            onClick={() => setPerspective(prev => Math.max(prev - 5, 10))}
          >
            Zoom Out
          </button>
        </div>
      </div>
      
      {/* Main SVG canvas for visualization */}
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
        className="bg-gradient-to-b from-black to-midnight"
      >
        {/* Definitions for gradients and filters */}
        <defs>
          <radialGradient id="airportSelectedGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#00ff33" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00ff33" stopOpacity="0" />
          </radialGradient>
          
          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#006622" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        
        {/* Background grid with perspective effect */}
        <rect
          x="0"
          y="0"
          width={viewportSize.width}
          height={viewportSize.height}
          fill="url(#grid)"
          opacity={0.5}
        />
        
        {/* 3D axis guides */}
        <g className="axis-guides" opacity="0.4">
          <line 
            x1={viewportSize.width / 2} 
            y1="0" 
            x2={viewportSize.width / 2} 
            y2={viewportSize.height}
            stroke="#00ff33" 
            strokeWidth="1" 
            strokeDasharray="5 5"
          />
          <line 
            x1="0" 
            y1={viewportSize.height / 2} 
            x2={viewportSize.width} 
            y2={viewportSize.height / 2}
            stroke="#00ff33" 
            strokeWidth="1" 
            strokeDasharray="5 5"
          />
        </g>
        
        {/* Render all elements in depth-sorted order */}
        {depthSortedElements.routes.map((routeData: any, index) => {
          const routeId = `${routeData.route.from}-${routeData.route.to}`;
          const isSelected = routeId === selectedRoute;
          
          return (
            <CompetitiveRouteLine
              key={`route-${index}`}
              from={routeData.from}
              to={routeData.to}
              fromZ={routeData.fromZ}
              toZ={routeData.toZ}
              route={routeData.route}
              selected={isSelected}
              onSelect={() => handleRouteSelect(routeData.route)}
              animationProgress={animationProgress}
            />
          );
        })}
        
        {depthSortedElements.airports.map((airport: any, index) => (
          <EnhancedAirportNode
            key={`airport-${index}`}
            projection={airport.projection}
            airport={airport}
            selected={selectedAirport === airport.code}
            onSelect={() => setSelectedAirport(prev => prev === airport.code ? null : airport.code)}
            animationProgress={animationProgress}
          />
        ))}
      </svg>
      
      {/* Floating metrics panel */}
      <div className="absolute right-2 bottom-2 bg-black bg-opacity-80 rounded-lg p-3 border border-forest border-opacity-40 z-10">
        <h4 className="text-sm font-semibold text-forest-light mb-2 glow-text">Route Statistics</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-midnight p-2 rounded-lg">
            <p className="text-gray-400">Total Routes</p>
            <p className="text-forest-light text-xl font-bold">{expandedRoutes.length}</p>
          </div>
          <div className="bg-midnight p-2 rounded-lg">
            <p className="text-gray-400">Profitable</p>
            <p className="text-forest-light text-xl font-bold">
              {expandedRoutes.filter(r => r.profitability > 0).length}
            </p>
          </div>
          <div className="bg-midnight p-2 rounded-lg">
            <p className="text-gray-400">Avg. Competitors</p>
            <p className="text-forest-light text-xl font-bold">
              {(expandedRoutes.reduce((sum, r) => sum + r.competitors.length, 0) / expandedRoutes.length).toFixed(1)}
            </p>
          </div>
          <div className="bg-midnight p-2 rounded-lg">
            <p className="text-gray-400">Top Market</p>
            <p className="text-forest-light text-xl font-bold">
              {expandedRoutes.sort((a, b) => b.volume - a.volume)[0]?.from + "-" + expandedRoutes.sort((a, b) => b.volume - a.volume)[0]?.to}
            </p>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-3 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-forest-light">High Profitability</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-forest-light">Medium Profitability</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-forest-light">Low/Negative Profitability</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-1 h-1 rounded-full bg-white"></div>
            <div className="w-1 h-1 rounded-full bg-white mx-1"></div>
            <div className="w-1 h-1 rounded-full bg-white"></div>
            <span className="text-forest-light">Active Flight Path</span>
          </div>
        </div>
      </div>
      
      {/* Selected route details */}
      {selectedRoute && (
        <div className="absolute left-2 bottom-2 bg-black bg-opacity-80 rounded-lg p-3 max-w-xs border border-forest border-opacity-40 z-20">
          <h4 className="text-sm font-semibold text-forest-light mb-2 glow-text">
            Route Details: {selectedRoute.replace('-', ' → ')}
          </h4>
          
          {(() => {
            const route = expandedRoutes.find(r => `${r.from}-${r.to}` === selectedRoute);
            if (!route) return null;
            
            const fromAirport = airports.find(a => a.code === route.from);
            const toAirport = airports.find(a => a.code === route.to);
            
            return (
              <div className="text-xs">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">From:</span>
                  <span className="text-forest-light">{fromAirport?.name || route.from}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">To:</span>
                  <span className="text-forest-light">{toAirport?.name || route.to}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Profitability:</span>
                  <span className={route.profitability > 0.5 ? 'text-green-400' : route.profitability > 0 ? 'text-yellow-400' : 'text-red-400'}>
                    {(route.profitability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Volume:</span>
                  <span className="text-forest-light">{route.volume} units</span>
                </div>
                
                <div className="mt-3 mb-2">
                  <div className="text-gray-400 font-semibold border-b border-forest border-opacity-30 pb-1 mb-2">
                    Competitors ({route.competitors.length})
                  </div>
                  
                  {route.competitors.map((comp, idx) => (
                    <div key={idx} className="bg-midnight-light p-2 rounded-lg mb-1 flex justify-between">
                      <span className="text-forest-light">{comp.name}</span>
                      <span className="text-gray-300">{(comp.marketShare * 100).toFixed(1)}% share</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  className="mt-2 w-full py-1 bg-forest text-black text-xs rounded-lg font-semibold"
                  onClick={() => setSelectedRoute(null)}
                >
                  Close Details
                </button>
              </div>
            );
          })()}
        </div>
      )}
      
      {/* User interaction hint */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 py-1 px-3 rounded-full text-xs text-forest-light">
        Click on airports or routes for details
      </div>
    </div>
  );
};

export default CompetitiveMap;