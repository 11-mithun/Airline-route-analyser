// Analytics service for airline route performance data

// Performance data types
interface PerformanceDataPoint {
  name: string;
  profitability: number;
  efficiency: number;
}

// Airport and route data types
interface Airport {
  code: string;
  name: string;
  position: [number, number, number];
}

interface Route {
  from: string;
  to: string;
  profitability: number;
  volume: number;
}

// KPI data type
interface KpiData {
  title: string;
  value: string;
  change: { value: number; isPositive: boolean };
  progressValue: number;
  icon: string; // SVG path or icon class
}

// Route data type
interface RouteData {
  id: number;
  from: string;
  to: string;
  fromCity: string;
  toCity: string;
  efficiency: number;
}

// Generate performance data based on timeframe
export function getPerformanceData(timeframe: string = 'daily'): PerformanceDataPoint[] {
  let data: PerformanceDataPoint[] = [];
  
  switch(timeframe) {
    case 'daily':
      data = [
        { name: 'Day 1', profitability: 80, efficiency: 75 },
        { name: 'Day 2', profitability: 78, efficiency: 72 },
        { name: 'Day 3', profitability: 82, efficiency: 76 },
        { name: 'Day 4', profitability: 85, efficiency: 79 },
        { name: 'Day 5', profitability: 84, efficiency: 80 },
        { name: 'Day 6', profitability: 87, efficiency: 82 },
        { name: 'Day 7', profitability: 90, efficiency: 85 }
      ];
      break;
    case 'weekly':
      data = [
        { name: 'Week 1', profitability: 82, efficiency: 77 },
        { name: 'Week 2', profitability: 84, efficiency: 79 },
        { name: 'Week 3', profitability: 86, efficiency: 81 },
        { name: 'Week 4', profitability: 89, efficiency: 83 }
      ];
      break;
    case 'monthly':
      data = [
        { name: 'Jan', profitability: 81, efficiency: 76 },
        { name: 'Feb', profitability: 83, efficiency: 78 },
        { name: 'Mar', profitability: 85, efficiency: 80 },
        { name: 'Apr', profitability: 87, efficiency: 82 },
        { name: 'May', profitability: 89, efficiency: 84 },
        { name: 'Jun', profitability: 90, efficiency: 86 }
      ];
      break;
    default:
      data = [
        { name: 'Day 1', profitability: 80, efficiency: 75 },
        { name: 'Day 2', profitability: 78, efficiency: 72 },
        { name: 'Day 3', profitability: 82, efficiency: 76 },
        { name: 'Day 4', profitability: 85, efficiency: 79 },
        { name: 'Day 5', profitability: 84, efficiency: 80 },
        { name: 'Day 6', profitability: 87, efficiency: 82 },
        { name: 'Day 7', profitability: 90, efficiency: 85 }
      ];
  }
  
  return data;
}

// Get the top performing routes by efficiency
export function getTopRoutes(limit: number = 10): RouteData[] {
  // Sample top routes data
  const routes: RouteData[] = [
    { id: 1, from: 'DEL', to: 'BOM', fromCity: 'Delhi', toCity: 'Mumbai', efficiency: 92.8 },
    { id: 2, from: 'BLR', to: 'HYD', fromCity: 'Bangalore', toCity: 'Hyderabad', efficiency: 89.5 },
    { id: 3, from: 'CCU', to: 'MAA', fromCity: 'Kolkata', toCity: 'Chennai', efficiency: 87.2 },
    { id: 4, from: 'DEL', to: 'GOI', fromCity: 'Delhi', toCity: 'Goa', efficiency: 86.1 },
    { id: 5, from: 'BOM', to: 'COK', fromCity: 'Mumbai', toCity: 'Kochi', efficiency: 85.3 },
    { id: 6, from: 'DEL', to: 'BLR', fromCity: 'Delhi', toCity: 'Bangalore', efficiency: 84.7 },
    { id: 7, from: 'BOM', to: 'MAA', fromCity: 'Mumbai', toCity: 'Chennai', efficiency: 83.9 },
    { id: 8, from: 'DEL', to: 'HYD', fromCity: 'Delhi', toCity: 'Hyderabad', efficiency: 83.2 },
    { id: 9, from: 'BLR', to: 'GOI', fromCity: 'Bangalore', toCity: 'Goa', efficiency: 82.5 },
    { id: 10, from: 'DEL', to: 'IXC', fromCity: 'Delhi', toCity: 'Chandigarh', efficiency: 81.8 }
  ];
  
  return routes.slice(0, limit);
}

// Get network visualization data based on view type
export function getNetworkData(view: string = 'profitability'): { airports: Airport[], routes: Route[] } {
  // Sample data for network visualization
  const airports: Airport[] = [
    { code: 'DEL', name: 'Delhi', position: [-3, 1, 0] },
    { code: 'BOM', name: 'Mumbai', position: [-1, -2, 0] },
    { code: 'BLR', name: 'Bangalore', position: [1, -3, 0] },
    { code: 'HYD', name: 'Hyderabad', position: [3, -2, 0] },
    { code: 'CCU', name: 'Kolkata', position: [2, 2, 0] },
    { code: 'MAA', name: 'Chennai', position: [0, -3, 0] },
    { code: 'GOI', name: 'Goa', position: [-2, -3, 0] }
  ];
  
  // Routes with different metrics depending on the view
  let routes: Route[] = [];
  
  if (view === 'profitability') {
    routes = [
      { from: 'DEL', to: 'BOM', profitability: 0.92, volume: 9 },
      { from: 'BLR', to: 'HYD', profitability: 0.89, volume: 7 },
      { from: 'CCU', to: 'MAA', profitability: 0.87, volume: 6 },
      { from: 'DEL', to: 'GOI', profitability: 0.86, volume: 5 },
      { from: 'DEL', to: 'CCU', profitability: -0.2, volume: 4 },
      { from: 'BOM', to: 'BLR', profitability: 0.4, volume: 6 }
    ];
  } else if (view === 'loadFactor') {
    routes = [
      { from: 'DEL', to: 'BOM', profitability: 0.88, volume: 9 },
      { from: 'BLR', to: 'HYD', profitability: 0.92, volume: 8 },
      { from: 'CCU', to: 'MAA', profitability: 0.85, volume: 7 },
      { from: 'DEL', to: 'GOI', profitability: 0.90, volume: 6 },
      { from: 'DEL', to: 'CCU', profitability: 0.75, volume: 5 },
      { from: 'BOM', to: 'BLR', profitability: 0.82, volume: 7 }
    ];
  } else if (view === 'delays') {
    routes = [
      { from: 'DEL', to: 'BOM', profitability: 0.95, volume: 9 },
      { from: 'BLR', to: 'HYD', profitability: 0.97, volume: 8 },
      { from: 'CCU', to: 'MAA', profitability: 0.80, volume: 7 },
      { from: 'DEL', to: 'GOI', profitability: 0.75, volume: 6 },
      { from: 'DEL', to: 'CCU', profitability: 0.65, volume: 5 },
      { from: 'BOM', to: 'BLR', profitability: 0.85, volume: 7 }
    ];
  }
  
  return {
    airports,
    routes
  };
}

// Get KPI data for dashboard
export function getKpiData(): KpiData[] {
  return [
    { 
      title: 'Avg. Load Factor', 
      value: '78.3%', 
      change: { value: 2.4, isPositive: true },
      progressValue: 78.3,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z"/><path d="M3 10h18"/><path d="M7 15h2"/><path d="M15 15h2"/></svg>'
    },
    { 
      title: 'Revenue/Mile', 
      value: '$0.14', 
      change: { value: 0.8, isPositive: false },
      progressValue: 65,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>'
    },
    { 
      title: 'On-Time Performance', 
      value: '91.2%', 
      change: { value: 1.5, isPositive: true },
      progressValue: 91.2,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
    },
    { 
      title: 'Fuel Efficiency', 
      value: '83.7%', 
      change: { value: 3.2, isPositive: true },
      progressValue: 83.7,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V12a9 9 0 0 1 18 0v10"/><path d="M21 22H3"/><line x1="12" x2="12" y1="8" y2="12"/></svg>'
    }
  ];
}

// Get complete analytics data
export function getAnalyticsData() {
  return {
    performanceData: getPerformanceData(),
    topRoutes: getTopRoutes(),
    kpiData: getKpiData(),
    networkData: getNetworkData()
  };
}
