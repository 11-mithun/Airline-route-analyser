import React from 'react';
import { motion } from 'framer-motion';

interface RouteCardProps {
  rank?: number;
  from: string;
  to: string;
  fromCity: string;
  toCity: string;
  efficiency: number;
  onClick?: () => void;
}

const RouteCard: React.FC<RouteCardProps> = ({
  rank,
  from,
  to,
  fromCity,
  toCity,
  efficiency,
  onClick
}) => {
  // Determine badge color based on rank
  let badgeBg = "bg-midnight";
  let badgeBorder = "border-gray-700";
  let glowEffect = "";
  
  if (rank === 1) {
    badgeBg = "bg-black";
    badgeBorder = "border-forest";
    glowEffect = "glow-text";
  }
  else if (rank === 2) {
    badgeBg = "bg-black";
    badgeBorder = "border-forest-dark";
  }
  else if (rank === 3) {
    badgeBg = "bg-black";
    badgeBorder = "border-gray-600";
  }
  
  // Calculate efficiency class
  let efficiencyClass = "text-yellow-400";
  if (efficiency >= 90) efficiencyClass = "text-green-400 glow-text";
  else if (efficiency >= 80) efficiencyClass = "text-forest-light";
  else if (efficiency < 70) efficiencyClass = "text-red-400";
  
  return (
    <motion.div
      className="bg-midnight rounded-lg p-4 flex items-center justify-between cursor-pointer border border-forest border-opacity-20 hover:border-opacity-60 hover:bg-midnight-light transition-all duration-300"
      whileHover={{ y: -2, boxShadow: "0 8px 16px rgba(0, 255, 0, 0.15)" }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      onClick={onClick}
    >
      <div className="flex items-center">
        {rank && (
          <div className={`w-10 h-10 rounded-full ${badgeBg} border-2 ${badgeBorder} flex items-center justify-center text-forest-light text-md font-bold mr-4 ${glowEffect}`}>
            {rank}
          </div>
        )}
        <div>
          <div className="flex items-center">
            <p className="font-semibold text-forest-light">{from}</p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-8 mx-0.5 text-forest" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            <p className="font-semibold text-forest-light">{to}</p>
          </div>
          <p className="text-xs text-forest-light opacity-80">{fromCity} to {toCity}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center justify-end">
          <motion.div 
            className="w-2 h-2 rounded-full bg-forest mr-2"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <p className={`font-bold text-lg ${efficiencyClass}`}>{efficiency.toFixed(1)}%</p>
        </div>
        <p className="text-xs text-forest-light opacity-80">Efficiency Rating</p>
      </div>
    </motion.div>
  );
};

export default RouteCard;
