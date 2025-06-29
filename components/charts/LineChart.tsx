import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { motion } from 'framer-motion';

interface DataPoint {
  name: string;
  [key: string]: number | string;
}

interface LineConfig {
  dataKey: string;
  stroke: string;
  name?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  className?: string;
}

interface LineChartProps {
  data: DataPoint[];
  lines: LineConfig[];
  xAxisDataKey?: string;
  title?: string;
  subtitle?: string;
  height?: number;
  legend?: boolean;
  grid?: boolean;
  tooltip?: boolean;
  className?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  lines,
  xAxisDataKey = 'name',
  title,
  subtitle,
  height = 300,
  legend = true,
  grid = true,
  tooltip = true,
  className = '',
}) => {
  return (
    <motion.div 
      className={`w-full bg-midnight-light p-5 rounded-xl border border-forest border-opacity-40 shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ boxShadow: "0 8px 32px rgba(0, 255, 0, 0.1)" }}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-xl font-semibold text-forest-light glow-text">{title}</h3>}
          {subtitle && (
            <div className="flex items-center mt-1">
              <p className="text-sm text-forest-light opacity-80">{subtitle}</p>
              <div className="ml-2 h-1 w-16 bg-forest-dark rounded-full"></div>
            </div>
          )}
        </div>
      )}
      
      <div className="relative" style={{ width: '100%', height }}>
        {/* 3D depth effect background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-forest opacity-5 rounded-lg"></div>
        
        {/* Chart container with inner glow */}
        <div className="absolute inset-0 rounded-lg shadow-inner" style={{ boxShadow: 'inset 0 0 20px rgba(0, 255, 0, 0.05)' }}></div>
        
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            className="z-10"
          >
            {grid && <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#00ff00" />}
            <XAxis 
              dataKey={xAxisDataKey} 
              tick={{ fill: '#00ff00', opacity: 0.7 }}
              axisLine={{ stroke: '#00ff00', opacity: 0.3 }}
            />
            <YAxis 
              tick={{ fill: '#00ff00', opacity: 0.7 }}
              axisLine={{ stroke: '#00ff00', opacity: 0.3 }}
            />
            {tooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                border: '1px solid #00ff00',
                boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
                borderRadius: '4px' 
              }}
              labelStyle={{ color: '#00ff00' }}
              itemStyle={{ color: '#ffffff' }}
              cursor={{ stroke: '#00ff00', strokeWidth: 1, strokeDasharray: '5 5' }}
            />}
            {legend && <Legend 
              wrapperStyle={{ color: '#00ff00', opacity: 0.9 }}
              iconType="circle"
            />}
            
            {lines.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name || line.dataKey}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth || 3}
                strokeDasharray={line.strokeDasharray}
                dot={{ 
                  r: 4, 
                  strokeWidth: 2,
                  fill: '#000000',
                  stroke: line.stroke,
                }}
                activeDot={{ 
                  r: 8, 
                  strokeWidth: 0,
                  fill: line.stroke,
                  stroke: '#000000',
                  className: 'animate-ping' 
                }}
                isAnimationActive={true}
                animationDuration={2000}
                animationEasing="ease-in-out"
                className={line.className}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
        
        {/* Animated corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-forest opacity-60 rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-forest opacity-60 rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-forest opacity-60 rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-forest opacity-60 rounded-br-lg"></div>
        
        {/* Glowing dot that follows the path */}
        <motion.div 
          className="absolute w-2 h-2 rounded-full bg-forest z-10"
          style={{ boxShadow: '0 0 8px #00ff00, 0 0 12px #00ff00' }}
          animate={{
            x: [0, '100%', '100%', 0, 0],
            y: ['50%', '30%', '70%', '40%', '50%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </motion.div>
  );
};

export default LineChart;
