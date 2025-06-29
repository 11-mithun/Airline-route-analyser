// Predictions service for airline route forecasting

// Feature importance type
interface Feature {
  name: string;
  importance: number;
}

// Model metrics type
interface ModelMetric {
  name: string;
  value: string;
}

// Route forecast type
interface RouteForecast {
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

// Performance data point type
interface PerformanceDataPoint {
  name: string;
  actual: number;
  predicted: number;
}

// Get profitability model data
export function getProfitabilityModelData() {
  // Performance comparison between actual and predicted values
  const performanceData: PerformanceDataPoint[] = [
    { name: 'Week 1', actual: 82, predicted: 80 },
    { name: 'Week 2', actual: 85, predicted: 83 },
    { name: 'Week 3', actual: 78, predicted: 76 },
    { name: 'Week 4', actual: 80, predicted: 82 },
    { name: 'Week 5', actual: 88, predicted: 86 },
    { name: 'Week 6', actual: 92, predicted: 90 },
    { name: 'Week 7', actual: 86, predicted: 87 }
  ];
  
  // Model metrics
  const modelMetrics: ModelMetric[] = [
    { name: 'Model Type', value: 'LSTM + Ensemble' },
    { name: 'Accuracy', value: '94.3%' },
    { name: 'RMSE', value: '0.072' },
    { name: 'Last Updated', value: 'Today, 14:30' }
  ];
  
  // Feature importance for explainability
  const features: Feature[] = [
    { name: 'Load Factor', importance: 0.93 },
    { name: 'Fuel Price', importance: 0.87 },
    { name: 'Route Demand', importance: 0.82 },
    { name: 'Seasonal Factors', importance: 0.76 },
    { name: 'Competition', importance: 0.65 }
  ];
  
  return {
    performanceData,
    modelMetrics,
    features
  };
}

// Get route forecasts
export function getRouteForecasts(): RouteForecast[] {
  return [
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
    },
    { 
      id: 4, 
      from: 'BOM', 
      to: 'GOI', 
      fromCity: 'Mumbai', 
      toCity: 'Goa', 
      currentProfit: '+$7,200', 
      forecast30: { value: '+$7,800', trend: 'up' }, 
      forecast90: { value: '+$8,500', trend: 'up' }, 
      confidence: 85
    },
    { 
      id: 5, 
      from: 'BLR', 
      to: 'COK', 
      fromCity: 'Bangalore', 
      toCity: 'Kochi', 
      currentProfit: '+$5,300', 
      forecast30: { value: '+$4,800', trend: 'down' }, 
      forecast90: { value: '+$6,200', trend: 'up' }, 
      confidence: 78
    }
  ];
}

// Get complete predictions data
export function getPredictionsData() {
  return {
    profitabilityModelData: getProfitabilityModelData(),
    routeForecasts: getRouteForecasts()
  };
}

// Run a new prediction (would normally call an ML model)
export function runNewPrediction(routeId: number) {
  // Get all forecasts
  const forecasts = getRouteForecasts();
  
  // Find the specific route
  const routeForecast = forecasts.find(r => r.id === routeId);
  
  if (!routeForecast) {
    throw new Error('Route not found');
  }
  
  // In a real application, this would call an ML model
  // Here we just return the existing forecast with small modifications
  return {
    ...routeForecast,
    forecast30: { 
      value: parseInt(routeForecast.forecast30.value.replace(/[^0-9-]/g, '')) * 1.05 + '$', 
      trend: routeForecast.forecast30.trend 
    },
    forecast90: { 
      value: parseInt(routeForecast.forecast90.value.replace(/[^0-9-]/g, '')) * 1.1 + '$', 
      trend: routeForecast.forecast90.trend 
    },
    confidence: Math.min(routeForecast.confidence + 2, 100)
  };
}
