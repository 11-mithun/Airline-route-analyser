import React, { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import AnimatedDataLine from '@/components/AnimatedDataLine';
import NavigationCard from '@/components/NavigationCard';
import CompetitiveMap from '@/components/charts/CompetitiveMap';
import Footer from '@/components/Footer';

const Home: React.FC = () => {
  const [, setLocation] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToExplore = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Animated background with data lines */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatedDataLine className="w-full h-full" />
      </div>
      
      {/* Immersive Container with Snap Scrolling */}
      <div className="relative">
        {/* Landing Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <svg className="absolute w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              <path className="data-line" d="M0,540 C300,400 600,700 900,300 S1300,600 1600,200 S1900,500 1920,540" fill="none" stroke="#4CAF50" strokeWidth="3" opacity="0.7"></path>
              <path className="data-line" d="M0,600 C400,800 700,200 1100,600 S1500,100 1920,600" fill="none" stroke="#8BC34A" strokeWidth="2" opacity="0.5"></path>
              <path className="data-line" d="M0,400 C500,700 800,100 1200,800 S1600,300 1920,500" fill="none" stroke="#E53935" strokeWidth="2" opacity="0.4"></path>
            </svg>
          </div>
          
          <div className="relative z-10 container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-5xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-forest-light via-forest to-forest-dark">
                Airline Route Analyzer
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                An immersive platform for predictive analytics and route profitability
              </p>
            </motion.div>
            
            {/* Interactive Cards for Navigation */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <NavigationCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                }
                title="Analytics Dashboard"
                description="Explore interactive 3D visualizations of route data."
                path="/analytics"
              />
              
              <NavigationCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                }
                title="Predictive Models"
                description="ML-powered insights for route profitability."
                path="/predictions"
              />
              
              <NavigationCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                title="Simulation Engine"
                description="Interactive 'What-If' scenario testing."
                path="/simulation"
              />
            </motion.div>
            
            <motion.div 
              className="mt-16 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              onClick={scrollToExplore}
            >
              <motion.div 
                className="w-8 h-8 mx-auto rounded-full border-2 border-forest flex items-center justify-center"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-forest" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <p className="text-sm text-gray-400 mt-2">Scroll to explore</p>
            </motion.div>
          </div>
        </section>
        
        {/* System Overview Section */}
        <section className="py-20 bg-black relative" ref={scrollRef}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-forest-light to-forest">System Overview</span>
                <div className="h-1 w-24 bg-forest rounded-full mx-auto mt-2"></div>
              </h2>
              <p className="text-gray-300 mt-4 max-w-3xl mx-auto">
                Our platform combines advanced analytics, machine learning, and 3D visualization
                to optimize airline route profitability and efficiency.
              </p>
            </motion.div>
            
            {/* 3D Competitive Map Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <CompetitiveMap
                airports={[
                  { code: 'JFK', name: 'New York', position: [-5, 1, 3], country: 'USA', traffic: 8 },
                  { code: 'LAX', name: 'Los Angeles', position: [-8, -2, 1], country: 'USA', traffic: 9 },
                  { code: 'MIA', name: 'Miami', position: [-3, -4, 2], country: 'USA', traffic: 7 },
                  { code: 'ORD', name: 'Chicago', position: [-1, 2, 1], country: 'USA', traffic: 8 },
                  { code: 'SFO', name: 'San Francisco', position: [-7, -1, 2], country: 'USA', traffic: 7 },
                  { code: 'SEA', name: 'Seattle', position: [-6, 0, 3], country: 'USA', traffic: 6 },
                  { code: 'DEN', name: 'Denver', position: [-4, 1, 2], country: 'USA', traffic: 7 },
                  { code: 'PHX', name: 'Phoenix', position: [-5, -2, 1], country: 'USA', traffic: 6 },
                  { code: 'BOS', name: 'Boston', position: [-3, 3, 0], country: 'USA', traffic: 6 },
                  { code: 'ATL', name: 'Atlanta', position: [-2, -1, 2], country: 'USA', traffic: 8 },
                  { code: 'ANC', name: 'Anchorage', position: [-8, 4, 0], country: 'USA', traffic: 4 },
                  { code: 'LAS', name: 'Las Vegas', position: [-6, -2, 1], country: 'USA', traffic: 7 },
                  { code: 'DFW', name: 'Dallas', position: [-4, -3, 2], country: 'USA', traffic: 8 },
                  { code: 'MCO', name: 'Orlando', position: [-2, -3, 0], country: 'USA', traffic: 7 },
                  { code: 'DTW', name: 'Detroit', position: [-3, 2, 1], country: 'USA', traffic: 6 }
                ]}
                routes={[
                  { 
                    from: 'JFK', to: 'LAX', profitability: 0.87, volume: 9,
                    competitors: [
                      { name: 'Delta', marketShare: 0.40, efficiency: 0.87 },
                      { name: 'American', marketShare: 0.35, efficiency: 0.82 },
                      { name: 'JetBlue', marketShare: 0.25, efficiency: 0.79 }
                    ] 
                  },
                  { 
                    from: 'MIA', to: 'ORD', profitability: 0.76, volume: 7,
                    competitors: [
                      { name: 'American', marketShare: 0.55, efficiency: 0.76 },
                      { name: 'United', marketShare: 0.30, efficiency: 0.72 }
                    ] 
                  },
                  { 
                    from: 'SFO', to: 'SEA', profitability: 0.92, volume: 8,
                    competitors: [
                      { name: 'United', marketShare: 0.45, efficiency: 0.92 },
                      { name: 'Alaska', marketShare: 0.40, efficiency: 0.88 },
                      { name: 'Delta', marketShare: 0.15, efficiency: 0.85 }
                    ] 
                  },
                  { 
                    from: 'DEN', to: 'PHX', profitability: 0.68, volume: 6,
                    competitors: [
                      { name: 'Southwest', marketShare: 0.60, efficiency: 0.68 },
                      { name: 'Frontier', marketShare: 0.25, efficiency: 0.62 },
                      { name: 'United', marketShare: 0.15, efficiency: 0.70 }
                    ] 
                  },
                  { 
                    from: 'BOS', to: 'ATL', profitability: 0.81, volume: 5,
                    competitors: [
                      { name: 'Delta', marketShare: 0.50, efficiency: 0.81 },
                      { name: 'JetBlue', marketShare: 0.30, efficiency: 0.78 }
                    ] 
                  },
                  { 
                    from: 'SEA', to: 'ANC', profitability: 0.79, volume: 4,
                    competitors: [
                      { name: 'Alaska', marketShare: 0.75, efficiency: 0.79 },
                      { name: 'Delta', marketShare: 0.25, efficiency: 0.74 }
                    ] 
                  }
                ]}
                height={450}
                selectedMetric="profitability"
              />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                className="bg-midnight-light rounded-xl p-6 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-full bg-forest bg-opacity-20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-gray-400">
                  Continuously updated dashboards provide immediate insights into route performance, load factors, and profitability metrics.
                </p>
              </motion.div>
              
              <motion.div
                className="bg-midnight-light rounded-xl p-6 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-full bg-forest bg-opacity-20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">ML-Powered Predictions</h3>
                <p className="text-gray-400">
                  Advanced machine learning models forecast route performance, allowing airlines to anticipate changes and optimize accordingly.
                </p>
              </motion.div>
              
              <motion.div
                className="bg-midnight-light rounded-xl p-6 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-full bg-forest bg-opacity-20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">3D Visualizations</h3>
                <p className="text-gray-400">
                  Immersive 3D visualizations transform complex data into intuitive, interactive representations for enhanced decision-making.
                </p>
              </motion.div>
              
              <motion.div
                className="bg-midnight-light rounded-xl p-6 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-full bg-forest bg-opacity-20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">What-If Simulations</h3>
                <p className="text-gray-400">
                  Test different scenarios and instantly see the projected impact on profitability, efficiency, and operational metrics.
                </p>
              </motion.div>
              
              <motion.div
                className="bg-midnight-light rounded-xl p-6 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-full bg-forest bg-opacity-20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Strategic Recommendations</h3>
                <p className="text-gray-400">
                  Automatically generated, data-driven recommendations to optimize routes, schedules, and pricing for maximum profitability.
                </p>
              </motion.div>
              
              <motion.div
                className="bg-midnight-light rounded-xl p-6 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-full bg-forest bg-opacity-20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure & Scalable</h3>
                <p className="text-gray-400">
                  Enterprise-grade security with role-based access control, ensuring data protection while maintaining performance at scale.
                </p>
              </motion.div>
            </div>
            
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <button 
                className="bg-forest hover:bg-forest-dark text-white px-8 py-3 rounded-lg font-medium transition-colors"
                onClick={() => setLocation('/analytics')}
              >
                Explore the Platform
              </button>
            </motion.div>
          </div>
        </section>
        
        <Footer />
      </div>
    </div>
  );
};

export default Home;
