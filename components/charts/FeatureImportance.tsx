import React from 'react';
import { motion } from 'framer-motion';

interface Feature {
  name: string;
  importance: number;
}

interface FeatureImportanceProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const FeatureImportance: React.FC<FeatureImportanceProps> = ({
  features,
  title = "Feature Importance",
  subtitle = "Key factors influencing route profitability",
  className
}) => {
  // Sort features by importance in descending order
  const sortedFeatures = [...features].sort((a, b) => b.importance - a.importance);
  
  return (
    <div className={`bg-midnight-light rounded-xl p-6 shadow-xl ${className}`}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-sm text-gray-400 mb-4">{subtitle}</p>
      
      <div className="space-y-4">
        {sortedFeatures.map((feature, index) => (
          <motion.div 
            key={index}
            className="bg-midnight rounded-lg p-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center mb-1">
              <p className="font-medium">{feature.name}</p>
              <p className="text-forest font-bold">{Math.round(feature.importance * 100)}%</p>
            </div>
            <motion.div 
              className="w-full bg-midnight-dark rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <motion.div 
                className="bg-forest h-2 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${feature.importance * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex items-center">
          <i className="ri-information-line text-forest mr-2"></i>
          <p className="text-xs text-gray-400">Based on SHAP analysis of model features</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureImportance;
