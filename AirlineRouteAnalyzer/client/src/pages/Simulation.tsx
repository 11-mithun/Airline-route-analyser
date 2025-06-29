import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import SimulationControls, { SimulationParameters } from '@/components/SimulationControls';
import SimulationResults, { SimulationResult } from '@/components/SimulationResults';
import RecommendationCard from '@/components/RecommendationCard';
import Footer from '@/components/Footer';
import { apiRequest } from '@/lib/queryClient';

const Simulation: React.FC = () => {
  // Initial simulation parameters
  const [parameters, setParameters] = useState<SimulationParameters>({
    fuelPrice: 3.25,
    loadFactor: 82,
    competitionLevel: 'Moderate',
    seasonalPattern: 'Medium'
  });
  
  // Fetch initial recommendations
  const { data: recommendationsData, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ['/api/simulation/recommendations'],
    retry: false,
  });
  
  // Run simulation mutation
  const { mutate: runSimulation, data: simulationResult, isPending: isRunningSimulation } = useMutation({
    mutationFn: async (params: SimulationParameters) => {
      const response = await apiRequest('POST', '/api/simulation/run', params);
      return response.json();
    }
  });
  
  // Handle parameter changes
  const handleParametersChange = (newParams: SimulationParameters) => {
    setParameters(newParams);
  };
  
  // Handle simulation run
  const handleRunSimulation = () => {
    runSimulation(parameters);
  };
  
  // Handle export
  const handleExport = () => {
    if (simulationResult) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(simulationResult));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "simulation_results.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };
  
  // Handle sharing
  const handleShare = () => {
    // Implement sharing functionality (e.g., copy link to clipboard)
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Simulation Results: Fuel Price: $${parameters.fuelPrice}, Load Factor: ${parameters.loadFactor}%, Competition: ${parameters.competitionLevel}, Season: ${parameters.seasonalPattern}`);
      alert('Simulation parameters copied to clipboard!');
    }
  };
  
  // Default recommendations if data is loading
  const defaultRecommendations = [
    {
      type: 'increase' as const,
      title: 'Increase Frequency',
      description: 'DEL → BOM route shows high demand elasticity. Increase weekly frequency by 15%.',
      impact: 'Profit Impact: +$26,500/month',
      confidence: 92
    },
    {
      type: 'warning' as const,
      title: 'Adjust Departure Times',
      description: 'BLR → HYD route shows higher load factor for early morning flights. Reschedule afternoon flight.',
      impact: 'Profit Impact: +$12,800/month',
      confidence: 87
    },
    {
      type: 'decrease' as const,
      title: 'Pricing Strategy',
      description: 'DEL → CCU route shows price sensitivity. Reduce fare by 8% to increase load factor and overall revenue.',
      impact: 'Profit Impact: +$17,200/month',
      confidence: 85
    }
  ];
  
  // Default simulation result if no simulation has been run yet
  const defaultSimulationResult: SimulationResult = {
    profitChange: 15.3,
    revenue: '$1.32M',
    cost: '$965K',
    margin: 26.9,
    timelineData: [
      { name: 'Month 1', baseline: 100, simulated: 105 },
      { name: 'Month 2', baseline: 98, simulated: 110 },
      { name: 'Month 3', baseline: 102, simulated: 120 },
      { name: 'Month 4', baseline: 100, simulated: 125 },
      { name: 'Month 5', baseline: 105, simulated: 135 },
      { name: 'Month 6', baseline: 103, simulated: 140 }
    ],
    insights: [
      {
        type: 'positive',
        title: 'Increasing load factor by 5% would improve profitability by 15.3%',
        description: 'Primary driver of improved performance'
      },
      {
        type: 'warning',
        title: 'Fuel price increase beyond $3.80/gal would eliminate profit gains',
        description: 'Consider fuel hedging strategies'
      },
      {
        type: 'info',
        title: 'Medium seasonal demand pattern optimizes the fleet utilization',
        description: 'Consider adjusting flight frequency during peak season'
      }
    ]
  };
  
  // Use actual data if available, fallback to defaults
  const recommendations = recommendationsData || defaultRecommendations;
  const result = simulationResult || defaultSimulationResult;
  
  return (
    <div className="bg-gradient-to-b from-midnight-dark to-midnight min-h-screen text-white">
      <div className="container mx-auto py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold mb-8 text-center relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-forest-light to-forest">What-If Simulation</span>
            <div className="h-1 w-24 bg-forest rounded-full mx-auto mt-2"></div>
          </h2>
        </motion.div>
        
        <motion.div 
          className="bg-midnight-light rounded-xl p-6 shadow-xl mb-8 border border-forest border-opacity-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-forest-light glow-text mb-6">Advanced Economic Scenario Simulator</h3>
          
          <div className="flex flex-col lg:flex-row">
            {/* Simulation Controls */}
            <SimulationControls 
              parameters={parameters} 
              onParametersChange={handleParametersChange}
              onRunSimulation={handleRunSimulation}
            />
            
            {/* Simulation Results */}
            <SimulationResults 
              result={result}
              onExport={handleExport}
              onShare={handleShare}
            />
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-midnight p-4 rounded-lg border border-forest border-opacity-20">
              <h4 className="text-lg font-semibold text-forest-light mb-2">Saved Scenarios</h4>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                <div className="bg-midnight-dark p-3 rounded-lg flex justify-between items-center hover:bg-midnight-light transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-forest-light">High Fuel Cost</p>
                    <p className="text-xs text-gray-400">Created: 2 days ago</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 rounded bg-forest bg-opacity-20 hover:bg-opacity-40 text-forest-light">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button className="p-1 rounded bg-red-800 bg-opacity-20 hover:bg-opacity-40 text-red-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="bg-midnight-dark p-3 rounded-lg flex justify-between items-center hover:bg-midnight-light transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-forest-light">Summer Peak</p>
                    <p className="text-xs text-gray-400">Created: 5 days ago</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 rounded bg-forest bg-opacity-20 hover:bg-opacity-40 text-forest-light">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button className="p-1 rounded bg-red-800 bg-opacity-20 hover:bg-opacity-40 text-red-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="bg-midnight-dark p-3 rounded-lg flex justify-between items-center hover:bg-midnight-light transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-forest-light">Economic Downturn</p>
                    <p className="text-xs text-gray-400">Created: 1 week ago</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 rounded bg-forest bg-opacity-20 hover:bg-opacity-40 text-forest-light">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button className="p-1 rounded bg-red-800 bg-opacity-20 hover:bg-opacity-40 text-red-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <button className="w-full mt-3 py-2 bg-midnight-dark hover:bg-forest hover:text-black text-forest-light text-sm rounded-lg border border-forest border-opacity-40 transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Save Current Scenario
              </button>
            </div>
            
            <div className="bg-midnight p-4 rounded-lg border border-forest border-opacity-20">
              <h4 className="text-lg font-semibold text-forest-light mb-2">Advanced Parameters</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Currency Exchange Rate (USD/EUR)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full bg-midnight-dark p-2 rounded border border-forest border-opacity-30 text-forest-light"
                      value="1.08"
                      step="0.01"
                      min="0.5"
                      max="2"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Airport Fee Increase (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full bg-midnight-dark p-2 rounded border border-forest border-opacity-30 text-forest-light"
                      value="2.5"
                      step="0.5"
                      min="0"
                      max="10"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">CO2 Emission Tax ($/ton)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full bg-midnight-dark p-2 rounded border border-forest border-opacity-30 text-forest-light"
                      value="25"
                      step="5"
                      min="0"
                      max="100"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <button className="w-full py-2 bg-forest text-black text-sm rounded-lg font-medium transition-colors">
                    Apply Advanced Parameters
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-midnight p-4 rounded-lg border border-forest border-opacity-20">
              <h4 className="text-lg font-semibold text-forest-light mb-2">Sensitivity Analysis</h4>
              <div className="space-y-3">
                <div className="bg-midnight-dark p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-forest-light">Fuel Price Sensitivity</p>
                    <span className="px-2 py-1 bg-red-900 bg-opacity-30 text-red-400 text-xs rounded">High</span>
                  </div>
                  <div className="w-full bg-midnight-light h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-500 to-red-500 h-full" style={{width: "85%"}}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">1% change results in 2.3% profit impact</p>
                </div>
                
                <div className="bg-midnight-dark p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-forest-light">Load Factor Sensitivity</p>
                    <span className="px-2 py-1 bg-green-900 bg-opacity-30 text-green-400 text-xs rounded">Moderate</span>
                  </div>
                  <div className="w-full bg-midnight-light h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-green-300 h-full" style={{width: "60%"}}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">1% change results in 1.5% profit impact</p>
                </div>
                
                <div className="bg-midnight-dark p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-forest-light">Competition Sensitivity</p>
                    <span className="px-2 py-1 bg-yellow-900 bg-opacity-30 text-yellow-400 text-xs rounded">Medium</span>
                  </div>
                  <div className="w-full bg-midnight-light h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-yellow-500 h-full" style={{width: "70%"}}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">1% change results in 0.8% profit impact</p>
                </div>
                
                <button className="w-full mt-2 py-2 bg-midnight-dark hover:bg-forest hover:text-black text-forest-light text-sm rounded-lg border border-forest border-opacity-40 transition-colors">
                  Run Full Sensitivity Analysis
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Optimization Recommendations */}
        <motion.div 
          className="bg-midnight-light rounded-xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-4">Route Optimization Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((recommendation, index) => (
              <RecommendationCard
                key={index}
                type={recommendation.type}
                title={recommendation.title}
                description={recommendation.description}
                impact={recommendation.impact}
                confidence={recommendation.confidence}
              />
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button 
              className="px-6 py-2 bg-forest hover:bg-forest-dark text-white rounded-lg font-medium transition-colors inline-flex items-center"
              onClick={() => window.open('/api/simulation/report', '_blank')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Generate Full Report
            </button>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Simulation;
