# Airline Route Profitability & Efficiency Analyzer (Immersive Edition)

A comprehensive, immersive analytics application for airline route profitability and efficiency analysis with high-performance visualization and real-time data processing.

![Airline Route Profitability & Efficiency Analyzer](./generated-icon.png)

## Key Features

### Advanced 3D Data Visualization
- **Interactive 3D Competitive Map**: Dynamically visualize hundreds of routes with real-time rotation and depth sorting
- **Network Performance Map**: View route profitability and efficiency with animated data flows
- **Advanced SVG Rendering**: Custom-built visualization components with smooth animations
- **Forest Fire Theme**: Visually striking dark theme with vibrant green accent elements and glow effects

### Comprehensive Analytics Dashboard
- **Real-time Performance Metrics**: Monitor key indicators including load factor, revenue/mile, and fuel efficiency
- **Competitor Analysis**: Track market share and efficiency across different routes
- **Top Route Performance**: Analyze the most profitable and efficient routes with detailed metrics
- **Trend Analysis**: View performance trends over time with interactive charts

### AI-Driven Predictive Analytics
- **ML-Based Forecasting**: Predict future route performance with advanced machine learning algorithms
- **Explainable AI Features**: Understand the reasoning behind predictions with transparent model insights
- **Anomaly Detection**: Automatically identify unusual patterns in route performance
- **Strategic Recommendations**: Receive AI-generated suggestions for route optimization

### Simulation Capabilities
- **Economic Scenario Simulator**: Test how different economic factors affect route profitability
- **Competitor Response Modeling**: Predict how competitors will react to strategy changes
- **Sensitivity Analysis**: Understand how sensitive route profitability is to different factors
- **What-If Analysis**: Explore the impact of different business decisions

### Enterprise-Grade Infrastructure
- **High-Performance Data Processing**: Handle large datasets with optimized algorithms
- **Real-Time Updates**: Dynamic data refresh with WebSocket support
- **Responsive Design**: Full functionality across all device sizes
- **PostgreSQL Database Integration**: Robust data storage with Drizzle ORM

## Technical Architecture
- **Frontend**: React with TypeScript
- **State Management**: React Query for server state, React hooks for UI state
- **Visualization**: Custom SVG/Canvas-based rendering with Framer Motion
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with custom animations

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
4. Start the development server: `npm run dev`

## Usage
The application offers several key sections:

- **Analytics Dashboard**: Monitor overall performance across all routes
- **Route Details**: Drill down into specific route metrics and historical performance
- **Competitive Analysis**: Compare your performance against competitors
- **Predictive Analytics**: View forecasts and model explanations
- **Simulation**: Run what-if scenarios with different economic conditions

## Contributing
We welcome contributions to this project. Please feel free to submit a pull request or open an issue for bugs or feature requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details.