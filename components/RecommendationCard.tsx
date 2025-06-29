import React from 'react';
import { motion } from 'framer-motion';

type RecommendationType = 'increase' | 'warning' | 'decrease';

interface RecommendationCardProps {
  type: RecommendationType;
  title: string;
  description: string;
  impact: string;
  confidence: number;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  type,
  title,
  description,
  impact,
  confidence
}) => {
  // Determine border color based on type
  const getBorderColor = () => {
    switch (type) {
      case 'increase':
        return 'border-green-500';
      case 'warning':
        return 'border-yellow-500';
      case 'decrease':
        return 'border-red-500';
      default:
        return 'border-gray-500';
    }
  };

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'increase':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-green-400 mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-yellow-400 mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        );
      case 'decrease':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-red-400 mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className={`bg-midnight rounded-lg p-4 border-l-4 ${getBorderColor()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center mb-2">
        {getIcon()}
        <h4 className="font-medium">{title}</h4>
      </div>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <div className="flex justify-between text-xs">
        <span className="text-forest">{impact}</span>
        <span className="text-gray-400">Confidence: {confidence}%</span>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
