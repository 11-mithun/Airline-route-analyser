import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export interface SimulationParameters {
  fuelPrice: number;
  loadFactor: number;
  competitionLevel: string;
  seasonalPattern: string;
}

interface SimulationControlsProps {
  parameters: SimulationParameters;
  onParametersChange: (params: SimulationParameters) => void;
  onRunSimulation: () => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  parameters,
  onParametersChange,
  onRunSimulation
}) => {
  const updateParameter = <K extends keyof SimulationParameters>(
    key: K, 
    value: SimulationParameters[K]
  ) => {
    onParametersChange({
      ...parameters,
      [key]: value
    });
  };

  return (
    <div className="w-full lg:w-1/3 pr-0 lg:pr-6 mb-6 lg:mb-0">
      <h3 className="text-xl font-semibold mb-4">Scenario Parameters</h3>
      <p className="text-sm text-gray-400 mb-6">Adjust variables to simulate different scenarios</p>
      
      <div className="space-y-5">
        {/* Fuel Price Slider */}
        <motion.div 
          className="bg-midnight p-4 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Fuel Price</label>
            <span className="text-sm text-forest">${parameters.fuelPrice.toFixed(2)}/gal</span>
          </div>
          <Slider
            value={[parameters.fuelPrice]}
            min={2}
            max={5}
            step={0.05}
            onValueChange={(values) => updateParameter('fuelPrice', values[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$2.00</span>
            <span>$3.50</span>
            <span>$5.00</span>
          </div>
        </motion.div>
        
        {/* Load Factor Slider */}
        <motion.div 
          className="bg-midnight p-4 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Avg. Load Factor</label>
            <span className="text-sm text-forest">{parameters.loadFactor}%</span>
          </div>
          <Slider
            value={[parameters.loadFactor]}
            min={50}
            max={100}
            step={1}
            onValueChange={(values) => updateParameter('loadFactor', values[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </motion.div>
        
        {/* Competition Level */}
        <motion.div 
          className="bg-midnight p-4 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Competition Level</label>
            <span className="text-sm text-forest">{parameters.competitionLevel}</span>
          </div>
          <Select 
            value={parameters.competitionLevel} 
            onValueChange={(value) => updateParameter('competitionLevel', value)}
          >
            <SelectTrigger className="w-full bg-midnight-dark border border-gray-700 rounded-md">
              <SelectValue placeholder="Select competition level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Extreme">Extreme</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
        
        {/* Seasonal Demand Pattern */}
        <motion.div 
          className="bg-midnight p-4 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Seasonal Pattern</label>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={parameters.seasonalPattern === 'Low' ? 'default' : 'outline'}
              className={parameters.seasonalPattern === 'Low' ? 'bg-forest text-white' : 'bg-midnight-dark text-white'}
              onClick={() => updateParameter('seasonalPattern', 'Low')}
            >
              Low
            </Button>
            <Button 
              variant={parameters.seasonalPattern === 'Medium' ? 'default' : 'outline'}
              className={parameters.seasonalPattern === 'Medium' ? 'bg-forest text-white' : 'bg-midnight-dark text-white'}
              onClick={() => updateParameter('seasonalPattern', 'Medium')}
            >
              Medium
            </Button>
            <Button 
              variant={parameters.seasonalPattern === 'Peak' ? 'default' : 'outline'}
              className={parameters.seasonalPattern === 'Peak' ? 'bg-forest text-white' : 'bg-midnight-dark text-white'}
              onClick={() => updateParameter('seasonalPattern', 'Peak')}
            >
              Peak
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            className="w-full py-6 bg-forest hover:bg-forest-dark text-white rounded-lg font-medium transition-colors"
            onClick={onRunSimulation}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Run Simulation
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default SimulationControls;
