import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  change: { value: number; isPositive: boolean };
  icon: React.ReactNode;
  progressValue?: number; // 0-100
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  icon,
  progressValue,
  className,
}) => {
  return (
    <motion.div
      className={cn("bg-midnight-light rounded-xl p-6 shadow-xl border border-forest border-opacity-30 hover:border-opacity-60 transition-all duration-300", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0, 255, 0, 0.2)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-medium text-forest-light">{title}</h4>
        <div className="text-forest text-xl p-2 rounded-full bg-forest bg-opacity-10">{icon}</div>
      </div>
      
      <p className="text-3xl font-bold text-forest-light glow-text">{value}</p>
      
      <div className="mt-3 flex items-center text-sm">
        {change.isPositive ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-1 data-highlight" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 7a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M10.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L11 4.414V14a1 1 0 1 1-2 0V4.414L5.707 7.707a1 1 0 0 1-1.414-1.414l4-4z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-1 data-highlight" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 13a1 1 0 0 1-1-1V5a1 1 0 1 1 2 0v7a1 1 0 0 1-1 1z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M10.293 17.707a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L10 15.586V6a1 1 0 1 1 2 0v9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4z" clipRule="evenodd" />
          </svg>
        )}
        <span className={change.isPositive ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
          {change.isPositive ? '+' : ''}{change.value}%
        </span>
        <span className="text-forest-light ml-2">vs last month</span>
      </div>
      
      {typeof progressValue === 'number' && (
        <div className="mt-4 h-2 w-full bg-midnight rounded-full overflow-hidden border border-forest border-opacity-20">
          <motion.div
            className="h-full bg-gradient-to-r from-forest to-forest-light rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="h-full w-full animate-pulse opacity-70"></div>
          </motion.div>
        </div>
      )}
      
      <motion.div 
        className="absolute bottom-0 right-0 w-12 h-12 opacity-10"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#00ff00">
          <circle cx="50" cy="50" r="40" strokeWidth="2" />
          <circle cx="50" cy="50" r="30" strokeWidth="2" />
          <circle cx="50" cy="50" r="20" strokeWidth="2" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default KpiCard;
