import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import LineChart from '@/components/charts/LineChart';
import FeatureImportance from '@/components/charts/FeatureImportance';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Predictions: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('profitability');
  
  // Fetch predictions data
  const { data: predictionsData, isLoading } = useQuery({
    queryKey: ['/api/predictions'],
    retry: false,
  });

  // Mock data while loading
  const loadingData = {
    profitabilityModelData: {
      performanceData: [
        { name: 'Week 1', actual: 82, predicted: 80 },
        { name: 'Week 2', actual: 85, predicted: 83 },
        { name: 'Week 3', actual: 78, predicted: 76 },
        { name: 'Week 4', actual: 80, predicted: 82 },
        { name: 'Week 5', actual: 88, predicted: 86 },
        { name: 'Week 6', actual: 92, predicted: 90 },
        { name: 'Week 7', actual: 86, predicted: 87 }
      ],
      modelMetrics: [
        { name: 'Model Type', value: 'LSTM + Ensemble' },
        { name: 'Accuracy', value: '94.3%' },
        { name: 'RMSE', value: '0.072' },
        { name: 'Last Updated', value: 'Today, 14:30' }
      ],
      features: [
        { name: 'Load Factor', importance: 0.93 },
        { name: 'Fuel Price', importance: 0.87 },
        { name: 'Route Demand', importance: 0.82 },
        { name: 'Seasonal Factors', importance: 0.76 },
        { name: 'Competition', importance: 0.65 }
      ]
    },
    routeForecasts: [
      { 
        id: 1, 
        from: 'DEL', 
        to: 'BOM', 
        fromCity: 'Delhi', 
        toCity: 'Mumbai', 
        currentProfit: '+$14,850', 
        forecast30: { value: '+$16,200', trend: 'up' }, 
        forecast90: { value: '+$18,500', trend: 'up' }, 
        confidence: 92
      },
      { 
        id: 2, 
        from: 'BLR', 
        to: 'HYD', 
        fromCity: 'Bangalore', 
        toCity: 'Hyderabad', 
        currentProfit: '+$9,320', 
        forecast30: { value: '+$10,500', trend: 'up' }, 
        forecast90: { value: '+$12,200', trend: 'up' }, 
        confidence: 88
      },
      { 
        id: 3, 
        from: 'DEL', 
        to: 'CCU', 
        fromCity: 'Delhi', 
        toCity: 'Kolkata', 
        currentProfit: '-$2,150', 
        forecast30: { value: '-$3,200', trend: 'down' }, 
        forecast90: { value: '+$1,800', trend: 'up' }, 
        confidence: 76
      }
    ]
  };
  
  // Use actual data if available, loading data otherwise
  const data = predictionsData || loadingData;
  
  return (
    <div className="bg-gradient-to-b from-midnight to-midnight-dark min-h-screen text-white">
      <div className="container mx-auto py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold mb-8 text-center relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-forest-light to-forest">ML-Powered Predictions</span>
            <div className="h-1 w-24 bg-forest rounded-full mx-auto mt-2"></div>
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Predictive Model Performance */}
          <motion.div 
            className="lg:col-span-2 bg-midnight-light rounded-xl p-6 shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-semibold">Profitability Prediction Model</h3>
              <div className="flex space-x-2">
                <span className="text-xs text-gray-400 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div>
                  Model Accuracy: 94.3%
                </span>
              </div>
            </div>
            
            <div className="chart-container bg-midnight rounded-lg p-4 overflow-hidden relative">
              <LineChart 
                data={data.profitabilityModelData.performanceData}
                lines={[
                  { dataKey: 'actual', stroke: '#4CAF50', name: 'Actual Profitability' },
                  { dataKey: 'predicted', stroke: '#E53935', name: 'Predicted (ML Model)', strokeDasharray: '5 5' }
                ]}
                height={300}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {data.profitabilityModelData.modelMetrics.map((metric, index) => (
                <div key={index} className="bg-midnight p-3 rounded-lg text-center">
                  <p className="text-gray-400 text-xs">{metric.name}</p>
                  <p className={`text-sm font-semibold ${metric.name === 'Accuracy' ? 'text-green-400' : 'text-white'}`}>
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Feature Importance Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <FeatureImportance 
              features={data.profitabilityModelData.features}
              title="Feature Importance"
              subtitle="Key factors influencing route profitability"
            />
          </motion.div>
        </div>
        
        {/* Route Forecasting Panel */}
        <motion.div 
          className="bg-midnight-light rounded-xl p-6 shadow-xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold">Route Profitability Forecast</h3>
            <Button className="bg-forest hover:bg-forest-dark text-white text-sm">
              Run New Prediction
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-midnight rounded-lg">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">Route</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">Current Profit</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">30-Day Forecast</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">90-Day Forecast</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">Confidence</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.routeForecasts.map((route) => (
                  <tr key={route.id} className="hover:bg-midnight-light transition-colors">
                    <td className="py-3 px-4 border-b border-gray-700">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-forest" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">{route.from} → {route.to}</p>
                          <p className="text-xs text-gray-400">{route.fromCity} to {route.toCity}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      <p className={`font-medium ${route.currentProfit.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {route.currentProfit}
                      </p>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      <div className="flex items-center">
                        <p className={`font-medium ${route.forecast30.value.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {route.forecast30.value}
                        </p>
                        {route.forecast30.trend === 'up' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      <div className="flex items-center">
                        <p className={`font-medium ${route.forecast90.value.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {route.forecast90.value}
                        </p>
                        {route.forecast90.trend === 'up' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      <div className="w-full bg-midnight-dark rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${route.confidence > 85 ? 'bg-forest' : 'bg-accent'}`} 
                          style={{ width: `${route.confidence}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{route.confidence}% confidence</p>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      <button className="p-1 text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* Additional Insights */}
        <motion.div 
          className="bg-midnight-light rounded-xl p-6 shadow-xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-4">Predictive Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-midnight rounded-lg p-4">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-forest mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <h4 className="font-medium">Demand Trend Analysis</h4>
              </div>
              <p className="text-sm text-gray-400">Model predicts 8.2% increase in overall passenger demand over next quarter, with strongest growth in DEL-BOM route.</p>
              <div className="mt-3 flex justify-between text-xs">
                <span className="text-forest">Impact: High</span>
                <span className="text-gray-400">Confidence: 91%</span>
              </div>
            </div>
            
            <div className="bg-midnight rounded-lg p-4">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <h4 className="font-medium">Fuel Price Alert</h4>
              </div>
              <p className="text-sm text-gray-400">Predicted fuel price volatility may impact profitability by up to 5.7% in Q3. Consider hedging strategies.</p>
              <div className="mt-3 flex justify-between text-xs">
                <span className="text-forest">Impact: Medium</span>
                <span className="text-gray-400">Confidence: 84%</span>
              </div>
            </div>
            
            <div className="bg-midnight rounded-lg p-4">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <h4 className="font-medium">Seasonal Pattern Detection</h4>
              </div>
              <p className="text-sm text-gray-400">ML model identifies stronger than expected seasonal patterns in BLR-HYD route. Consider dynamic pricing adjustments.</p>
              <div className="mt-3 flex justify-between text-xs">
                <span className="text-forest">Impact: Medium</span>
                <span className="text-gray-400">Confidence: 89%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Predictions;
