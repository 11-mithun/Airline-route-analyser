import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import LineChart from '@/components/charts/LineChart';
import NetworkMap from '@/components/charts/NetworkMap';
import CompetitiveMap from '@/components/charts/CompetitiveMap';
import KpiCard from '@/components/KpiCard';
import RouteCard from '@/components/RouteCard';
import Footer from '@/components/Footer';

// Define types for our analytics data
interface PerformanceDataPoint {
  name: string;
  profitability: number;
  efficiency: number;
  [key: string]: number | string; // Add index signature for DataPoint compatibility
}

interface Route {
  id: number;
  from: string;
  to: string;
  fromCity: string;
  toCity: string;
  efficiency: number;
}

interface KpiDataItem {
  title: string;
  value: string;
  change: { value: number; isPositive: boolean };
  progressValue: number;
  icon: React.ReactNode;
}

interface NetworkDataPoint {
  airports: Array<{
    code: string;
    name: string;
    position: [number, number, number];
  }>;
  routes: Array<{
    from: string;
    to: string;
    profitability: number;
    volume: number;
  }>;
}

interface AnalyticsData {
  performanceData: PerformanceDataPoint[];
  topRoutes: Route[];
  kpiData: KpiDataItem[];
  networkData: NetworkDataPoint;
}

const Analytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState('daily');
  const [mapView, setMapView] = useState('profitability');
  
  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics'],
    retry: false,
  });

  // Mock data while loading
  const loadingData: AnalyticsData = {
    performanceData: [
      { name: 'Day 1', profitability: 80, efficiency: 75 },
      { name: 'Day 2', profitability: 78, efficiency: 72 },
      { name: 'Day 3', profitability: 82, efficiency: 76 },
      { name: 'Day 4', profitability: 85, efficiency: 79 },
      { name: 'Day 5', profitability: 84, efficiency: 80 },
      { name: 'Day 6', profitability: 87, efficiency: 82 },
      { name: 'Day 7', profitability: 90, efficiency: 85 }
    ],
    topRoutes: [
      { id: 1, from: 'DEL', to: 'BOM', fromCity: 'Delhi', toCity: 'Mumbai', efficiency: 92.8 },
      { id: 2, from: 'BLR', to: 'HYD', fromCity: 'Bangalore', toCity: 'Hyderabad', efficiency: 89.5 },
      { id: 3, from: 'CCU', to: 'MAA', fromCity: 'Kolkata', toCity: 'Chennai', efficiency: 87.2 },
      { id: 4, from: 'DEL', to: 'GOI', fromCity: 'Delhi', toCity: 'Goa', efficiency: 86.1 }
    ],
    kpiData: [
      { 
        title: 'Avg. Load Factor', 
        value: '78.3%', 
        change: { value: 2.4, isPositive: true },
        progressValue: 78.3,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z"/>
            <path d="M3 10h18"/>
            <path d="M7 15h2"/>
            <path d="M15 15h2"/>
          </svg>
        )
      },
      { 
        title: 'Revenue/Mile', 
        value: '$0.14', 
        change: { value: 0.8, isPositive: false },
        progressValue: 65,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
            <path d="M12 18V6"/>
          </svg>
        )
      },
      { 
        title: 'On-Time Performance', 
        value: '91.2%', 
        change: { value: 1.5, isPositive: true },
        progressValue: 91.2,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        )
      },
      { 
        title: 'Fuel Efficiency', 
        value: '83.7%', 
        change: { value: 3.2, isPositive: true },
        progressValue: 83.7,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 22V12a9 9 0 0 1 18 0v10"/>
            <path d="M21 22H3"/>
            <line x1="12" x2="12" y1="8" y2="12"/>
          </svg>
        )
      }
    ],
    networkData: {
      airports: [
        { code: 'DEL', name: 'Delhi', position: [-3, 1, 0] },
        { code: 'BOM', name: 'Mumbai', position: [-1, -2, 0] },
        { code: 'BLR', name: 'Bangalore', position: [1, -3, 0] },
        { code: 'HYD', name: 'Hyderabad', position: [3, -2, 0] },
        { code: 'CCU', name: 'Kolkata', position: [2, 2, 0] },
        { code: 'MAA', name: 'Chennai', position: [0, -3, 0] },
        { code: 'GOI', name: 'Goa', position: [-2, -3, 0] }
      ],
      routes: [
        { from: 'DEL', to: 'BOM', profitability: 0.92, volume: 9 },
        { from: 'BLR', to: 'HYD', profitability: 0.89, volume: 7 },
        { from: 'CCU', to: 'MAA', profitability: 0.87, volume: 6 },
        { from: 'DEL', to: 'GOI', profitability: 0.86, volume: 5 },
        { from: 'DEL', to: 'CCU', profitability: -0.2, volume: 4 },
        { from: 'BOM', to: 'BLR', profitability: 0.4, volume: 6 }
      ]
    }
  };
  
  // Use actual data if available, loading data otherwise
  const data = analyticsData || loadingData;
  
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold mb-8 text-center relative glow-text">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-forest-light to-forest">Analytics Dashboard</span>
            <div className="h-1 w-24 bg-forest rounded-full mx-auto mt-2 pulse-effect"></div>
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Route Performance Overview */}
          <motion.div 
            className="lg:col-span-2 card bg-midnight-light rounded-xl p-6 shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-semibold text-forest-light glow-text">Route Performance Overview</h3>
              <div className="flex space-x-2">
                <button 
                  className={`p-2 rounded-md ${timeframe === 'daily' ? 'bg-forest text-white' : 'bg-midnight text-forest-light'} text-sm`}
                  onClick={() => setTimeframe('daily')}
                >
                  Daily
                </button>
                <button 
                  className={`p-2 rounded-md ${timeframe === 'weekly' ? 'bg-forest text-white' : 'bg-midnight text-forest-light'} text-sm`}
                  onClick={() => setTimeframe('weekly')}
                >
                  Weekly
                </button>
                <button 
                  className={`p-2 rounded-md ${timeframe === 'monthly' ? 'bg-forest text-white' : 'bg-midnight text-forest-light'} text-sm`}
                  onClick={() => setTimeframe('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>
            
            <div className="chart-container bg-midnight rounded-lg p-4 overflow-hidden relative border border-forest border-opacity-30">
              <LineChart 
                data={data.performanceData}
                lines={[
                  { dataKey: 'profitability', stroke: '#00ff00', name: 'Profitability', className: 'chart-stroke' },
                  { dataKey: 'efficiency', stroke: '#ff9000', name: 'Efficiency Rating', className: 'chart-stroke' }
                ]}
                height={300}
              />
              <div className="absolute bottom-4 right-4 flex items-center space-x-3 bg-black bg-opacity-50 p-2 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-forest-light">Profitability</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                  <span className="text-xs text-forest-light">Efficiency</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-midnight p-3 rounded-lg text-center border border-forest border-opacity-20 hover:border-opacity-60 transition-all duration-300 data-highlight">
                <p className="text-forest-light text-xs">Avg. Load Factor</p>
                <p className="text-2xl font-bold text-forest glow-text">78.3%</p>
                <p className="text-xs text-green-400">+2.4%</p>
              </div>
              <div className="bg-midnight p-3 rounded-lg text-center border border-forest border-opacity-20 hover:border-opacity-60 transition-all duration-300 data-highlight">
                <p className="text-forest-light text-xs">Revenue Per Mile</p>
                <p className="text-2xl font-bold text-forest glow-text">$0.14</p>
                <p className="text-xs text-red-400">-0.8%</p>
              </div>
              <div className="bg-midnight p-3 rounded-lg text-center border border-forest border-opacity-20 hover:border-opacity-60 transition-all duration-300 data-highlight">
                <p className="text-forest-light text-xs">Cost Efficiency</p>
                <p className="text-2xl font-bold text-forest glow-text">82.5%</p>
                <p className="text-xs text-green-400">+1.2%</p>
              </div>
            </div>
          </motion.div>
          
          {/* Top Performing Routes */}
          <motion.div 
            className="card bg-midnight-light rounded-xl p-6 shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-forest-light glow-text">Top Performing Routes</h3>
            
            <div className="space-y-4">
              {data.topRoutes.map((route: Route, index: number) => (
                <RouteCard 
                  key={route.id}
                  rank={index + 1}
                  from={route.from}
                  to={route.to}
                  fromCity={route.fromCity}
                  toCity={route.toCity}
                  efficiency={route.efficiency}
                />
              ))}
              
              <button className="w-full mt-2 py-2 text-sm text-forest hover:text-forest-light transition-colors flex items-center justify-center border border-forest border-opacity-20 rounded-lg hover:border-opacity-60">
                View all routes 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Network Performance Map */}
        <motion.div 
          className="card bg-midnight-light rounded-xl p-6 shadow-xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold text-forest-light glow-text">Network Performance Map</h3>
            <div className="flex space-x-2">
              <button 
                className={`p-2 rounded-md ${mapView === 'profitability' ? 'bg-forest text-white' : 'bg-midnight text-forest-light'} text-sm`}
                onClick={() => setMapView('profitability')}
              >
                Profitability
              </button>
              <button 
                className={`p-2 rounded-md ${mapView === 'loadFactor' ? 'bg-forest text-white' : 'bg-midnight text-forest-light'} text-sm`}
                onClick={() => setMapView('loadFactor')}
              >
                Load Factor
              </button>
              <button 
                className={`p-2 rounded-md ${mapView === 'delays' ? 'bg-forest text-white' : 'bg-midnight text-forest-light'} text-sm`}
                onClick={() => setMapView('delays')}
              >
                Delays
              </button>
            </div>
          </div>
          
          <div className="bg-midnight rounded-lg relative overflow-hidden border border-forest border-opacity-30" style={{ height: '500px' }}>
            <NetworkMap 
              airports={data.networkData.airports}
              routes={data.networkData.routes}
              height={500}
            />
            
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 p-3 rounded-lg border border-forest border-opacity-30">
              <div className="text-xs text-forest-light mb-2">Map Legend</div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-forest-light">High Profitability</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-xs text-forest-light">Medium Profitability</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-xs text-forest-light">Low Profitability</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* 3D Competitive Map */}
        <motion.div 
          className="card bg-black rounded-xl p-6 shadow-xl mb-12 border border-forest border-opacity-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h3 className="text-2xl font-bold text-forest-light glow-text mb-6">3D Competitive Route Analysis</h3>
          
          <CompetitiveMap 
            airports={[
              { code: 'DEL', name: 'Delhi', position: [-5, 1, 3], country: 'India', traffic: 8 },
              { code: 'BOM', name: 'Mumbai', position: [-3, -2, 1], country: 'India', traffic: 7 },
              { code: 'BLR', name: 'Bangalore', position: [-1, -4, 2], country: 'India', traffic: 6 },
              { code: 'HYD', name: 'Hyderabad', position: [1, -3, 0], country: 'India', traffic: 5 },
              { code: 'CCU', name: 'Kolkata', position: [3, 2, -1], country: 'India', traffic: 6 },
              { code: 'MAA', name: 'Chennai', position: [2, -2, -2], country: 'India', traffic: 5 },
              { code: 'GOI', name: 'Goa', position: [-2, -3, -3], country: 'India', traffic: 4 },
              { code: 'JFK', name: 'New York', position: [-8, 4, -4], country: 'USA', traffic: 9 },
              { code: 'LHR', name: 'London', position: [-6, 5, -2], country: 'UK', traffic: 9 },
              { code: 'DXB', name: 'Dubai', position: [-4, 0, 5], country: 'UAE', traffic: 8 },
              { code: 'SIN', name: 'Singapore', position: [5, -5, 2], country: 'Singapore', traffic: 7 },
              { code: 'HKG', name: 'Hong Kong', position: [7, -1, 3], country: 'China', traffic: 7 },
              { code: 'SYD', name: 'Sydney', position: [8, -6, -5], country: 'Australia', traffic: 6 }
            ]}
            routes={[
              { 
                from: 'DEL', to: 'BOM', profitability: 0.92, volume: 9,
                competitors: [
                  { name: 'AirIndia', marketShare: 0.45, efficiency: 0.85 },
                  { name: 'IndiGo', marketShare: 0.30, efficiency: 0.90 },
                  { name: 'Vistara', marketShare: 0.15, efficiency: 0.80 }
                ] 
              },
              { 
                from: 'BLR', to: 'HYD', profitability: 0.89, volume: 7,
                competitors: [
                  { name: 'IndiGo', marketShare: 0.55, efficiency: 0.88 },
                  { name: 'SpiceJet', marketShare: 0.25, efficiency: 0.75 }
                ] 
              },
              { 
                from: 'DEL', to: 'LHR', profitability: 0.78, volume: 10,
                competitors: [
                  { name: 'AirIndia', marketShare: 0.35, efficiency: 0.76 },
                  { name: 'BritishAirways', marketShare: 0.40, efficiency: 0.82 },
                  { name: 'Lufthansa', marketShare: 0.15, efficiency: 0.88 }
                ] 
              },
              { 
                from: 'BOM', to: 'DXB', profitability: 0.86, volume: 8,
                competitors: [
                  { name: 'Emirates', marketShare: 0.50, efficiency: 0.92 },
                  { name: 'AirIndia', marketShare: 0.20, efficiency: 0.75 }
                ] 
              },
              { 
                from: 'DEL', to: 'SIN', profitability: 0.75, volume: 6,
                competitors: [
                  { name: 'SingaporeAir', marketShare: 0.45, efficiency: 0.94 },
                  { name: 'IndiGo', marketShare: 0.25, efficiency: 0.82 },
                  { name: 'AirIndia', marketShare: 0.20, efficiency: 0.70 }
                ] 
              },
              { 
                from: 'JFK', to: 'LHR', profitability: 0.95, volume: 10,
                competitors: [
                  { name: 'BritishAirways', marketShare: 0.30, efficiency: 0.88 },
                  { name: 'Delta', marketShare: 0.25, efficiency: 0.85 },
                  { name: 'UnitedAir', marketShare: 0.20, efficiency: 0.82 },
                  { name: 'AmericanAir', marketShare: 0.15, efficiency: 0.78 }
                ] 
              }
            ]}
            height={600}
            selectedMetric="profitability"
          />
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-midnight p-5 rounded-xl border border-forest border-opacity-30 hover:border-opacity-60 transition-all duration-300">
              <h4 className="text-lg font-semibold text-forest-light mb-3">Competitor Analysis</h4>
              <p className="text-sm text-gray-300 mb-4">Our airline faces strong competition on 87% of routes, with an average of 2.8 competitors per route. The most contested routes are international long-haul flights.</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-forest">View detailed report</span>
                <div className="w-8 h-8 rounded-full bg-forest bg-opacity-20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-forest">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-midnight p-5 rounded-xl border border-forest border-opacity-30 hover:border-opacity-60 transition-all duration-300">
              <h4 className="text-lg font-semibold text-forest-light mb-3">Market Share Metrics</h4>
              <p className="text-sm text-gray-300 mb-4">We currently lead on domestic routes with 47% market share, but international routes show only 28% market share with significant growth opportunity.</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-forest">View market data</span>
                <div className="w-8 h-8 rounded-full bg-forest bg-opacity-20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-forest">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-midnight p-5 rounded-xl border border-forest border-opacity-30 hover:border-opacity-60 transition-all duration-300">
              <h4 className="text-lg font-semibold text-forest-light mb-3">Strategic Opportunities</h4>
              <p className="text-sm text-gray-300 mb-4">AI analysis identified 15 under-served routes with high profit potential and low competition. Expansion could yield 12% revenue growth.</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-forest">View opportunities</span>
                <div className="w-8 h-8 rounded-full bg-forest bg-opacity-20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-forest">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Key Performance Indicators */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold col-span-full mb-4 text-forest-light glow-text">
            Key Performance Indicators
            <div className="h-1 w-16 bg-forest rounded-full mt-2"></div>
          </h2>
          
          {data.kpiData.map((kpi: KpiDataItem, index: number) => (
            <div className="card group" key={index}>
              <KpiCard
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                icon={kpi.icon}
                progressValue={kpi.progressValue}
              />
            </div>
          ))}
        </motion.div>
        
        {/* Advanced Analytics Features Section */}
        <motion.div
          className="mb-12 bg-midnight-light rounded-xl p-6 border border-forest border-opacity-30 card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.01 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-forest-light glow-text">Advanced Analytics Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-midnight p-4 rounded-lg border border-forest border-opacity-20 hover:border-opacity-60 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-forest bg-opacity-20 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-md font-semibold text-forest-light mb-2">Predictive Trends Analysis</h4>
              <p className="text-sm text-gray-300">Advanced ML algorithms to predict future route performance based on historical data patterns.</p>
            </div>
            
            <div className="bg-midnight p-4 rounded-lg border border-forest border-opacity-20 hover:border-opacity-60 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-forest bg-opacity-20 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h4 className="text-md font-semibold text-forest-light mb-2">Competitive Benchmarking</h4>
              <p className="text-sm text-gray-300">Compare route performance against industry standards and competing airlines.</p>
            </div>
            
            <div className="bg-midnight p-4 rounded-lg border border-forest border-opacity-20 hover:border-opacity-60 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-forest bg-opacity-20 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-md font-semibold text-forest-light mb-2">Real-time Anomaly Detection</h4>
              <p className="text-sm text-gray-300">Instantly identify operational anomalies with automated alerts and recommendations.</p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <button className="bg-forest hover:bg-forest-dark text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 flex items-center">
              Explore Advanced Features
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Analytics;
