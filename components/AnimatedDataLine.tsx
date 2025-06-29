import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';

// Helper type for point coordinates - must have at least x and y
type Point = [number, number, number?];
type Point2D = { x: number; y: number };

// Utility function to generate a bezier curve path string from points
const generateCurvedPath = (points: Point[], viewportSize: { width: number; height: number }): string => {
  if (points.length < 2) return '';
  
  // Project 3D points to 2D SVG viewport
  const projectedPoints = points.map(([x, y, z = 0]) => {
    const scale = Math.min(viewportSize.width, viewportSize.height) / 12;
    const centerX = viewportSize.width / 2;
    const centerY = viewportSize.height / 2;
    
    return {
      x: centerX + x * scale,
      y: centerY + y * scale
    };
  });
  
  // Start path at the first point
  let path = `M ${projectedPoints[0].x} ${projectedPoints[0].y}`;
  
  // For each segment, create a curved path
  for (let i = 1; i < projectedPoints.length; i++) {
    const current = projectedPoints[i];
    const previous = projectedPoints[i - 1];
    
    if (i === 1) {
      // First segment - simple curve to next point
      const controlX = (previous.x + current.x) / 2;
      const controlY = (previous.y + current.y) / 2;
      path += ` Q ${controlX},${controlY} ${current.x},${current.y}`;
    } else {
      // Subsequent segments - use smooth cubic bezier curves
      const prevControl = {
        x: previous.x + (previous.x - projectedPoints[i - 2].x) / 4,
        y: previous.y + (previous.y - projectedPoints[i - 2].y) / 4
      };
      
      const currControl = {
        x: current.x - (current.x - previous.x) / 4,
        y: current.y - (current.y - previous.y) / 4
      };
      
      path += ` C ${prevControl.x},${prevControl.y} ${currControl.x},${currControl.y} ${current.x},${current.y}`;
    }
  }
  
  return path;
};

// Generate an array of points along a path for data flow particles
const generatePathPoints = (path: SVGPathElement, count: number): Point2D[] => {
  if (!path) return [];
  
  const length = path.getTotalLength();
  return Array.from({ length: count }, (_, i) => {
    const point = path.getPointAtLength((i / (count - 1)) * length);
    return { x: point.x, y: point.y };
  });
};

// The actual data line component
const DataLine: React.FC<{
  pathString: string;
  color: string;
  thickness: number;
  speed: number;
  glowIntensity?: number;
  dashArray?: number;
  dashOffset?: number;
}> = ({ 
  pathString, 
  color, 
  thickness, 
  speed, 
  glowIntensity = 5,
  dashArray,
  dashOffset
}) => {
  const [opacity, setOpacity] = useState(0.8);
  const pathRef = useRef<SVGPathElement>(null);
  
  // Create unique gradient ID for this line
  const gradientId = useMemo(() => `gradient-${Math.random().toString(36).substring(2, 9)}`, []);
  
  // Pulse effect animation
  useAnimationFrame((time) => {
    const newOpacity = Math.sin(time * 0.001 * speed) * 0.2 + 0.8;
    setOpacity(newOpacity);
  });
  
  return (
    <g className="data-line">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="50%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
        
        <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={glowIntensity} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Base glow effect path */}
      <path
        d={pathString}
        stroke={color}
        strokeWidth={thickness * 3}
        fill="none"
        strokeOpacity={0.1}
        filter={`url(#glow-${gradientId})`}
      />
      
      {/* Main path */}
      <path
        ref={pathRef}
        d={pathString}
        stroke={`url(#${gradientId})`}
        strokeWidth={thickness}
        fill="none"
        strokeOpacity={opacity}
        strokeLinecap="round"
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
      />
    </g>
  );
};

// Particles that flow along the data line
const DataParticles: React.FC<{
  pathString: string;
  color: string;
  count: number;
  speed: number;
  size?: number;
}> = ({ pathString, color, count, speed, size = 3 }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [particles, setParticles] = useState<Array<{ position: number; speed: number; size: number }>>([]);
  const [pathPoints, setPathPoints] = useState<Point2D[]>([]);
  
  // Create a temporary path element to calculate path points
  useEffect(() => {
    if (!pathString) return;
    
    const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tempPath.setAttribute('d', pathString);
    document.body.appendChild(tempPath);
    
    // Calculate points along the path
    const points = generatePathPoints(tempPath, 100);
    setPathPoints(points);
    
    // Initialize particles
    const newParticles = Array.from({ length: count }, () => ({
      position: Math.random(),
      speed: (0.001 + Math.random() * 0.003) * speed,
      size: size * (0.7 + Math.random() * 0.6)
    }));
    setParticles(newParticles);
    
    // Clean up
    document.body.removeChild(tempPath);
  }, [pathString, count, speed, size]);
  
  // Animate particles
  useAnimationFrame(() => {
    if (pathPoints.length === 0) return;
    
    setParticles(prev => prev.map(particle => {
      // Move particle along the path
      let newPosition = particle.position + particle.speed;
      if (newPosition > 1) newPosition = 0;
      
      return {
        ...particle,
        position: newPosition
      };
    }));
  });
  
  if (pathPoints.length === 0) return null;
  
  return (
    <g className="data-particles">
      {particles.map((particle, index) => {
        // Get point along the path
        const pointIndex = Math.floor(particle.position * (pathPoints.length - 1));
        const point = pathPoints[pointIndex];
        
        return (
          <g key={index} className="data-particle">
            <circle
              cx={point.x}
              cy={point.y}
              r={particle.size}
              fill={color}
              opacity={0.8}
            >
              <animate
                attributeName="opacity"
                values="0.4;0.8;0.4"
                dur={`${2 / particle.speed}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={point.x}
              cy={point.y}
              r={particle.size * 2}
              fill={color}
              opacity={0.2}
            >
              <animate
                attributeName="r"
                values={`${particle.size};${particle.size * 3};${particle.size}`}
                dur={`${3 / particle.speed}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}
    </g>
  );
};

// Data stream effect - animating multiple lines with particles
const DataStream: React.FC<{
  paths: Point[][];
  colors: string[];
  thickness?: number[];
  speed?: number[];
  viewportSize: { width: number; height: number };
}> = ({ paths, colors, thickness = [], speed = [], viewportSize }) => {
  const [dashOffset, setDashOffset] = useState(0);
  
  // Generate path strings for each data line
  const pathStrings = useMemo(() => 
    paths.map(path => generateCurvedPath(path, viewportSize)), 
    [paths, viewportSize]
  );
  
  // Animate the dash offset for flowing lines
  useAnimationFrame((time) => {
    setDashOffset(prev => prev - 1);
  });
  
  return (
    <g className="data-stream">
      {pathStrings.map((pathString, index) => (
        <g key={`stream-${index}`}>
          <DataLine
            pathString={pathString}
            color={colors[index] || '#4CAF50'}
            thickness={thickness[index] || 2}
            speed={speed[index] || 1}
            dashArray={20}
            dashOffset={dashOffset * (speed[index] || 1)}
          />
          <DataParticles
            pathString={pathString}
            color={colors[index] || '#4CAF50'}
            count={Math.floor(((thickness[index] || 2) * 10) + 5)}
            speed={speed[index] || 1}
            size={(thickness[index] || 2) * 0.8}
          />
        </g>
      ))}
    </g>
  );
};

// DataNodes - connection points for data streams
const DataNodes: React.FC<{
  nodes: Array<{ position: Point; label?: string; size?: number }>;
  colors: string[];
  viewportSize: { width: number; height: number };
}> = ({ nodes, colors, viewportSize }) => {
  // Project 3D positions to 2D SVG viewport
  const projectedNodes = useMemo(() => 
    nodes.map(node => {
      const [x, y, z = 0] = node.position;
      const scale = Math.min(viewportSize.width, viewportSize.height) / 12;
      const centerX = viewportSize.width / 2;
      const centerY = viewportSize.height / 2;
      
      return {
        ...node,
        position: {
          x: centerX + x * scale,
          y: centerY + y * scale
        }
      };
    }), 
    [nodes, viewportSize]
  );
  
  return (
    <g className="data-nodes">
      {projectedNodes.map((node, index) => (
        <g key={`node-${index}`} className="data-node">
          {/* Outer glow */}
          <circle
            cx={node.position.x}
            cy={node.position.y}
            r={(node.size || 5) * 2}
            fill={colors[index % colors.length] || '#4CAF50'}
            opacity={0.1}
          >
            <animate
              attributeName="r"
              values={`${(node.size || 5) * 1.5};${(node.size || 5) * 2.5};${(node.size || 5) * 1.5}`}
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Main node */}
          <circle
            cx={node.position.x}
            cy={node.position.y}
            r={node.size || 5}
            fill={colors[index % colors.length] || '#4CAF50'}
            opacity={0.8}
          >
            <animate
              attributeName="opacity"
              values="0.6;0.9;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Label if provided */}
          {node.label && (
            <g>
              <rect
                x={node.position.x + 10}
                y={node.position.y - 10}
                width={node.label.length * 7 + 10}
                height={20}
                rx={5}
                fill="rgba(0,0,0,0.7)"
                stroke={colors[index % colors.length] || '#4CAF50'}
                strokeWidth={1}
              />
              <text
                x={node.position.x + 15}
                y={node.position.y + 5}
                fontSize={12}
                fontFamily="monospace"
                fill="#fff"
              >
                {node.label}
              </text>
            </g>
          )}
        </g>
      ))}
    </g>
  );
};

// Interface for component props
interface AnimatedDataLineProps {
  className?: string;
  variant?: 'network' | 'flow' | 'circuit';
  theme?: 'forest' | 'ocean' | 'sunset';
  animated?: boolean;
}

// Main component
const AnimatedDataLine: React.FC<AnimatedDataLineProps> = ({ 
  className,
  variant = 'flow',
  theme = 'forest',
  animated = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 800, height: 400 });
  
  // Color themes with enhanced vibrant forest fire theme
  const themes = {
    forest: ['#1eff00', '#00ff8d', '#00ffaa', '#50ff00'], // Enhanced vibrant "forest fire" green theme
    ocean: ['#03A9F4', '#00BCD4', '#4DD0E1'],
    sunset: ['#FF9800', '#F44336', '#9C27B0']
  };
  
  const colors = themes[theme] || themes.forest;
  
  // Define explicitly typed point structures for layout data
  const flowPaths: Point[][] = [
    [[-5, 2, 0], [-2, -1, 0], [2, 1, 0], [5, -2, 0]],
    [[-5, -1, 0], [-1, 1, 0], [1, -1, 0], [5, 1, 0]],
    [[-4, 0, 0], [0, 2, 0], [4, 0, 0]]
  ];

  const flowNodes: Array<{ position: Point; label: string; size: number }> = [
    { position: [-5, 2, 0], label: 'Start', size: 6 },
    { position: [5, -2, 0], label: 'End', size: 6 },
    { position: [-5, -1, 0], label: 'A', size: 5 },
    { position: [5, 1, 0], label: 'B', size: 5 },
    { position: [-4, 0, 0], label: 'C', size: 4 },
    { position: [4, 0, 0], label: 'D', size: 4 }
  ];

  const networkPaths: Point[][] = [
    [[-4, -3, 0], [-2, -1, 0], [0, 0, 0], [2, -2, 0], [4, -3, 0]],
    [[-4, 0, 0], [-2, 0, 0], [0, 0, 0], [2, 0, 0], [4, 0, 0]],
    [[-4, 3, 0], [-2, 1, 0], [0, 0, 0], [2, 2, 0], [4, 3, 0]],
    [[-2, -3, 0], [-1, -1.5, 0], [0, 0, 0], [1, 1.5, 0], [2, 3, 0]],
    [[2, 3, 0], [1, 1.5, 0], [0, 0, 0], [-1, -1.5, 0], [-2, -3, 0]]
  ];

  const networkNodes: Array<{ position: Point; label: string; size: number }> = [
    { position: [0, 0, 0], label: 'Hub', size: 8 },
    { position: [-4, -3, 0], label: 'A1', size: 5 },
    { position: [4, -3, 0], label: 'A2', size: 5 },
    { position: [-4, 0, 0], label: 'B1', size: 5 },
    { position: [4, 0, 0], label: 'B2', size: 5 },
    { position: [-4, 3, 0], label: 'C1', size: 5 },
    { position: [4, 3, 0], label: 'C2', size: 5 },
    { position: [-2, -3, 0], label: 'D1', size: 4 },
    { position: [2, 3, 0], label: 'D2', size: 4 }
  ];

  const circuitPaths: Point[][] = [
    [[-5, 0, 0], [-4, 0, 0], [-3, 1, 0], [-2, -1, 0], [-1, 1, 0], [0, -1, 0], [1, 1, 0], [2, -1, 0], [3, 1, 0], [4, 0, 0], [5, 0, 0]],
    [[-3, 3, 0], [-3, 1, 0]],
    [[0, 3, 0], [0, -1, 0]],
    [[3, 3, 0], [3, 1, 0]],
    [[-3, -3, 0], [-3, -1, 0], [-3, -1, 0], [0, -1, 0], [0, -3, 0]],
    [[3, -3, 0], [3, -1, 0], [3, -1, 0], [0, -1, 0]]
  ];

  const circuitNodes: Array<{ position: Point; label: string; size: number }> = [
    { position: [-5, 0, 0], label: 'IN', size: 6 },
    { position: [5, 0, 0], label: 'OUT', size: 6 },
    { position: [-3, 3, 0], label: 'A', size: 5 },
    { position: [0, 3, 0], label: 'B', size: 5 },
    { position: [3, 3, 0], label: 'C', size: 5 },
    { position: [-3, -3, 0], label: 'D', size: 5 },
    { position: [0, -3, 0], label: 'E', size: 5 },
    { position: [3, -3, 0], label: 'F', size: 5 }
  ];

  // Data layouts for different variants with proper typing
  const variants: Record<string, {
    paths: Point[][];
    nodes: Array<{ position: Point; label: string; size: number }>;
    thickness: number[];
    speed: number[];
  }> = {
    flow: {
      paths: flowPaths,
      nodes: flowNodes,
      thickness: [2.5, 2, 1.5],
      speed: [0.8, 1.2, 1]
    },
    network: {
      paths: networkPaths,
      nodes: networkNodes,
      thickness: [2, 2, 2, 1.5, 1.5],
      speed: [0.8, 1, 1.2, 0.9, 1.1]
    },
    circuit: {
      paths: circuitPaths,
      nodes: circuitNodes,
      thickness: [2.5, 1.5, 1.5, 1.5, 1.5, 1.5],
      speed: [0.6, 1, 1.2, 1, 0.8, 1.1]
    }
  };
  
  // Get the configuration for the selected variant
  const config = variants[variant];
  
  // Update viewport size on component mount and window resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setViewportSize({ width, height });
      }
    };
    
    // Initial update
    updateSize();
    
    // Add resize listener
    window.addEventListener('resize', updateSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return (
    <div ref={containerRef} className={`animated-data-line ${className || ''}`} style={{ width: '100%', height: '100%' }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
        className="bg-black rounded-lg"
      >
        {/* Grid background */}
        <g className="grid">
          {Array.from({ length: 20 }).map((_, i) => (
            <g key={`grid-${i}`}>
              <line 
                x1={viewportSize.width * i / 20} 
                y1={0} 
                x2={viewportSize.width * i / 20} 
                y2={viewportSize.height} 
                stroke="#333" 
                strokeWidth={i % 5 === 0 ? 0.5 : 0.2} 
                strokeOpacity={0.5}
              />
              <line 
                x1={0} 
                y1={viewportSize.height * i / 20} 
                x2={viewportSize.width} 
                y2={viewportSize.height * i / 20} 
                stroke="#333" 
                strokeWidth={i % 5 === 0 ? 0.5 : 0.2} 
                strokeOpacity={0.5}
              />
            </g>
          ))}
        </g>
        
        {/* Data streams (lines and particles) */}
        {animated && (
          <DataStream
            paths={config.paths}
            colors={colors}
            thickness={config.thickness}
            speed={config.speed}
            viewportSize={viewportSize}
          />
        )}
        
        {/* Non-animated lines if static display is requested */}
        {!animated && config.paths.map((path, index) => (
          <path
            key={`static-path-${index}`}
            d={generateCurvedPath(path, viewportSize)}
            stroke={colors[index % colors.length]}
            strokeWidth={config.thickness[index] || 2}
            fill="none"
            strokeOpacity={0.7}
          />
        ))}
        
        {/* Data nodes */}
        <DataNodes
          nodes={config.nodes}
          colors={colors}
          viewportSize={viewportSize}
        />
      </svg>
    </div>
  );
};

export default AnimatedDataLine;
