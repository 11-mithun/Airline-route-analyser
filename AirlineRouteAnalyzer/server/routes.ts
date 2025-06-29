import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getAnalyticsData, getPerformanceData, getTopRoutes, getNetworkData } from "./services/analytics";
import { getPredictionsData, getRouteForecasts } from "./services/predictions";
import { getRecommendations, runSimulation, generateReport } from "./services/simulation";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix: /api
  
  // Analytics endpoints
  app.get("/api/analytics", (req, res) => {
    try {
      const analyticsData = getAnalyticsData();
      res.json(analyticsData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics data" });
    }
  });
  
  app.get("/api/analytics/performance", (req, res) => {
    try {
      const timeframe = req.query.timeframe as string || 'daily';
      const performanceData = getPerformanceData(timeframe);
      res.json(performanceData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch performance data" });
    }
  });
  
  app.get("/api/analytics/top-routes", (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topRoutes = getTopRoutes(limit);
      res.json(topRoutes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top routes" });
    }
  });
  
  app.get("/api/analytics/network", (req, res) => {
    try {
      const view = req.query.view as string || 'profitability';
      const networkData = getNetworkData(view);
      res.json(networkData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch network data" });
    }
  });
  
  // Predictions endpoints
  app.get("/api/predictions", (req, res) => {
    try {
      const predictionsData = getPredictionsData();
      res.json(predictionsData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch predictions data" });
    }
  });
  
  app.get("/api/predictions/route-forecasts", (req, res) => {
    try {
      const routeForecasts = getRouteForecasts();
      res.json(routeForecasts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch route forecasts" });
    }
  });
  
  // Simulation endpoints
  app.get("/api/simulation/recommendations", (req, res) => {
    try {
      const recommendations = getRecommendations();
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });
  
  app.post("/api/simulation/run", (req, res) => {
    try {
      const parameters = req.body;
      const result = runSimulation(parameters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to run simulation" });
    }
  });
  
  app.get("/api/simulation/report", (req, res) => {
    try {
      const reportHtml = generateReport();
      res.setHeader('Content-Type', 'text/html');
      res.send(reportHtml);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
