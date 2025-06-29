import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import LineChart from './charts/LineChart';

export interface SimulationResult {
  profitChange: number;
  revenue: string;
  cost: string;
  margin: number;
  timelineData: Array<{
    name: string;
    baseline: number;
    simulated: number;
  }>;
  insights: Array<{
    type: 'positive' | 'warning' | 'info';
    title: string;
    description: string;
  }>;
}

interface SimulationResultsProps {
  result: SimulationResult;
  onExport?: () => void;
  onShare?: () => void;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ 
  result,
  onExport,
  onShare
}) => {
  const getIconForInsightType = (type: string) => {
    switch (type) {
      case 'positive':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-green-400 text-sm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-yellow-400 text-sm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        );
      case 'info':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-blue-400 text-sm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        );
    }
  };

  const getBgColorForInsightType = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-900';
      case 'warning': return 'bg-yellow-900';
      case 'info': return 'bg-blue-900';
      default: return 'bg-gray-900';
    }
  };

  return (
    <div className="w-full lg:w-2/3 bg-midnight rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Simulation Results</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="border border-gray-700"
            onClick={onExport}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border border-gray-700"
            onClick={onShare}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </Button>
        </div>
      </div>
      
      <motion.div 
        className="bg-midnight-dark rounded-lg p-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-wrap -mx-2">
          <div className="w-1/2 md:w-1/4 px-2 mb-4">
            <p className="text-xs text-gray-400">Profit Change</p>
            <p className={`text-xl font-bold ${result.profitChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {result.profitChange >= 0 ? '+' : ''}{result.profitChange.toFixed(1)}%
            </p>
          </div>
          <div className="w-1/2 md:w-1/4 px-2 mb-4">
            <p className="text-xs text-gray-400">Revenue</p>
            <p className="text-xl font-bold text-white">{result.revenue}</p>
          </div>
          <div className="w-1/2 md:w-1/4 px-2 mb-4">
            <p className="text-xs text-gray-400">Cost</p>
            <p className="text-xl font-bold text-white">{result.cost}</p>
          </div>
          <div className="w-1/2 md:w-1/4 px-2 mb-4">
            <p className="text-xs text-gray-400">Margin</p>
            <p className="text-xl font-bold text-white">{result.margin.toFixed(1)}%</p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="chart-container bg-midnight-dark rounded-lg p-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <LineChart 
          data={result.timelineData}
          lines={[
            { dataKey: 'baseline', stroke: '#888888', name: 'Current Baseline', strokeDasharray: '5 5' },
            { dataKey: 'simulated', stroke: '#4CAF50', name: 'Simulated Scenario' }
          ]}
          height={240}
        />
      </motion.div>
      
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h4 className="font-medium text-sm">Key Insights:</h4>
        
        {result.insights.map((insight, index) => (
          <motion.div 
            key={index}
            className="bg-midnight-dark p-3 rounded-lg flex items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + (index * 0.1) }}
          >
            <div className={`flex-shrink-0 w-6 h-6 rounded-full ${getBgColorForInsightType(insight.type)} flex items-center justify-center mr-2`}>
              {getIconForInsightType(insight.type)}
            </div>
            <div>
              <p className="text-sm font-medium">{insight.title}</p>
              <p className="text-xs text-gray-400 mt-1">{insight.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SimulationResults;
