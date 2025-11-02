// API Configuration for CementAI Nexus Frontend
// Uses environment variables from .env.local
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

// API endpoint configuration
export const API_ENDPOINTS = {
  // Health check
  health: '/api/health',
  
  // Real-time data endpoints
  sensors: '/api/sensors/realtime',
  plantStatus: '/api/plant/status',
  processParameters: '/api/process/parameters',
  qualityCurrent: '/api/quality/current',
  equipmentStatus: '/api/equipment/status',
  environmentalCurrent: '/api/environmental/current',
  dashboardData: '/api/dashboard/data',
  
  // Simulation control
  simulationStart: '/api/simulation/start',
  simulationStop: '/api/simulation/stop',
  simulationAnomaly: '/api/simulation/anomaly',
  
  // AI endpoints
  aiChat: '/api/ai/chat',
  aiRecommendations: '/api/ai/recommendations',
  aiExplainAnomaly: '/api/ai/explain-anomaly',
  aiQualityFluctuations: '/api/ai/quality-fluctuations',
  aiQualityTrends: '/api/ai/quality-trends',
  aiProactiveCorrections: '/api/ai/proactive-quality-corrections',
  aiInputFluctuations: '/api/ai/input-fluctuations',
  aiRealTimeOptimization: '/api/ai/real-time-optimization',
  aiSystemPrompt: '/api/ai/system-prompt',
  
  // Real data management
  realDataLoad: '/api/real-data/load',
  realDataToggle: '/api/real-data/toggle',
  realDataStatus: '/api/real-data/status',
  
  // Firebase integration
  firebaseTest: '/api/firebase/test'
};

// WebSocket event names
export const WS_EVENTS = {
  connect: 'connect',
  disconnect: 'disconnect',
  dashboardUpdate: 'dashboard_update',
  sensorData: 'sensor_data',
  processData: 'process_data',
  requestSensorData: 'request_sensor_data',
  requestProcessData: 'request_process_data'
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function to build WebSocket URL
export const buildWsUrl = (): string => {
  return WS_URL;
};

console.log('API Configuration loaded:', {
  API_BASE_URL,
  WS_URL: WS_URL,
  environment: process.env.NODE_ENV || 'development'
});