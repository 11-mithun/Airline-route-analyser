import { ObjectId, findDocuments, findOneDocument, insertDocument, updateDocument, deleteDocument } from '../db/mongo-mock';

// Define the collection names
const ROUTES_COLLECTION = 'routes';
const AIRPORTS_COLLECTION = 'airports';
const PERFORMANCE_METRICS_COLLECTION = 'performance_metrics';
const PREDICTIONS_COLLECTION = 'predictions';
const SIMULATION_SCENARIOS_COLLECTION = 'simulation_scenarios';

// Interface definitions
export interface IAirport {
  _id?: ObjectId;
  code: string;
  name: string;
  position: [number, number, number]; // 3D coordinates for visualization
  country: string;
  city: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRoute {
  _id?: ObjectId;
  from: string; // Airport code
  to: string; // Airport code
  fromCity: string;
  toCity: string;
  distance: number; // in km
  profitability: number; // as a percentage
  volume: number; // scaled 1-10 for visualization
  efficiency: number; // as a percentage
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPerformanceMetric {
  _id?: ObjectId;
  routeId: string | ObjectId;
  date: Date;
  loadFactor: number; // passenger capacity utilization percentage
  revenue: number;
  cost: number;
  profit: number;
  sentiment: number; // -100 to 100 scale
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPrediction {
  _id?: ObjectId;
  routeId: string | ObjectId;
  createdAt: Date;
  forecastDate30: Date; // 30 day forecast
  forecastDate90: Date; // 90 day forecast
  currentProfit: number;
  forecast30: { value: number; trend: 'up' | 'down' };
  forecast90: { value: number; trend: 'up' | 'down' };
  confidence: number; // 0-100 percentage
  factors: Array<{ name: string; weight: number }>;
}

export interface ISimulationScenario {
  _id?: ObjectId;
  name: string;
  description: string;
  parameters: {
    fuelPrice: number;
    loadFactor: number;
    competitionLevel: string;
    seasonalPattern: string;
  };
  results: {
    profitChange: number;
    revenue: number;
    cost: number;
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
  };
  createdAt: Date;
  createdBy?: string;
}

// Airport Model methods
export const AirportModel = {
  async findAll(): Promise<IAirport[]> {
    return findDocuments(AIRPORTS_COLLECTION);
  },

  async findByCode(code: string): Promise<IAirport | null> {
    return findOneDocument(AIRPORTS_COLLECTION, { code });
  },

  async create(airport: IAirport): Promise<IAirport> {
    airport.createdAt = new Date();
    airport.updatedAt = new Date();
    const result = await insertDocument(AIRPORTS_COLLECTION, airport);
    return { ...airport, _id: result.insertedId };
  }
};

// Route Model methods
export const RouteModel = {
  async findAll(): Promise<IRoute[]> {
    return findDocuments(ROUTES_COLLECTION);
  },

  async findById(id: string | ObjectId): Promise<IRoute | null> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    return findOneDocument(ROUTES_COLLECTION, { _id });
  },

  async findByAirports(from: string, to: string): Promise<IRoute | null> {
    return findOneDocument(ROUTES_COLLECTION, { from, to });
  },

  async create(route: IRoute): Promise<IRoute> {
    route.createdAt = new Date();
    route.updatedAt = new Date();
    const result = await insertDocument(ROUTES_COLLECTION, route);
    return { ...route, _id: result.insertedId };
  },

  async update(id: string | ObjectId, updates: Partial<IRoute>): Promise<boolean> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    updates.updatedAt = new Date();
    const result = await updateDocument(ROUTES_COLLECTION, { _id }, updates);
    return result.modifiedCount > 0;
  }
};

// Performance Metrics Model methods
export const PerformanceMetricModel = {
  async findByRouteId(routeId: string | ObjectId): Promise<IPerformanceMetric[]> {
    return findDocuments(PERFORMANCE_METRICS_COLLECTION, { routeId });
  },

  async findByDateRange(startDate: Date, endDate: Date): Promise<IPerformanceMetric[]> {
    return findDocuments(PERFORMANCE_METRICS_COLLECTION, {
      date: { $gte: startDate, $lte: endDate }
    });
  },

  async create(metric: IPerformanceMetric): Promise<IPerformanceMetric> {
    metric.createdAt = new Date();
    metric.updatedAt = new Date();
    const result = await insertDocument(PERFORMANCE_METRICS_COLLECTION, metric);
    return { ...metric, _id: result.insertedId };
  }
};

// Prediction Model methods
export const PredictionModel = {
  async findByRouteId(routeId: string | ObjectId): Promise<IPrediction[]> {
    return findDocuments(PREDICTIONS_COLLECTION, { routeId });
  },

  async create(prediction: IPrediction): Promise<IPrediction> {
    const result = await insertDocument(PREDICTIONS_COLLECTION, prediction);
    return { ...prediction, _id: result.insertedId };
  }
};

// Simulation Scenario Model methods
export const SimulationScenarioModel = {
  async findAll(): Promise<ISimulationScenario[]> {
    return findDocuments(SIMULATION_SCENARIOS_COLLECTION);
  },

  async findById(id: string | ObjectId): Promise<ISimulationScenario | null> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    return findOneDocument(SIMULATION_SCENARIOS_COLLECTION, { _id });
  },

  async create(scenario: ISimulationScenario): Promise<ISimulationScenario> {
    const result = await insertDocument(SIMULATION_SCENARIOS_COLLECTION, scenario);
    return { ...scenario, _id: result.insertedId };
  },

  async delete(id: string | ObjectId): Promise<boolean> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await deleteDocument(SIMULATION_SCENARIOS_COLLECTION, { _id });
    return result.deletedCount > 0;
  }
};