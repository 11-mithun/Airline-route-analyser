// Mock airline data for development purposes
// This would typically be fetched from an API in production

// Airport data
export interface Airport {
  code: string;
  name: string;
  position: [number, number, number]; // [x, y, z] coordinates for 3D visualization
  country: string;
  city: string;
}

// Route data
export interface Route {
  id: number;
  from: string;
  to: string;
  fromCity: string;
  toCity: string;
  distance: number; // in km
  profitability: number; // as a percentage
  volume: number; // scaled 1-10 for visualization
  efficiency: number; // as a percentage
}

// KPI data
export interface KPI {
  title: string;
  value: string;
  change: { value: number; isPositive: boolean };
  progressValue: number;
  icon: React.ReactNode;
}

// Feature importance for ML model
export interface Feature {
  name: string;
  importance: number; // 0-1
}

// Recommendation for route optimization
export interface Recommendation {
  type: 'increase' | 'warning' | 'decrease';
  title: string;
  description: string;
  impact: string;
  confidence: number;
}

// Route forecast
export interface RouteForecast {
  id: number;
  from: string;
  to: string;
  fromCity: string;
  toCity: string;
  currentProfit: string;
  forecast30: { value: string; trend: 'up' | 'down' };
  forecast90: { value: string; trend: 'up' | 'down' };
  confidence: number;
}

// Simulation parameters
export interface SimulationParameters {
  fuelPrice: number;
  loadFactor: number;
  competitionLevel: string;
  seasonalPattern: string;
}

// Simulation result
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

// Data point for charts
export interface DataPoint {
  name: string;
  [key: string]: number | string;
}
