// Data models for CementAI Nexus Frontend

export interface SimulationConfig {
  plant_capacity: number;
  sensor_count: number;
  simulation_speed: number;
  noise_level: number;
  anomaly_probability: number;
  quality_variation: number;
}

export interface SensorReading {
  timestamp: Date;
  sensor_id: string;
  value: number;
  unit: string;
  location: string;
  sensor_type: string;
}

export interface ProcessParameters {
  timestamp: Date;
  kiln_temperature: number;
  kiln_pressure: number;
  raw_mill_power: number;
  cement_mill_power: number;
  production_rate: number;
  energy_consumption: number;
  alternative_fuel_rate: number;
  raw_meal_flow: number;
  cement_fineness: number;
  clinker_temperature: number;
  exhaust_fan_speed: number;
  preheater_temperature: number;
}

export interface QualityMetrics {
  timestamp: Date;
  sample_id: string;
  blaine_fineness: number;
  compressive_strength_3d: number;
  compressive_strength_28d: number;
  setting_time_initial: number;
  setting_time_final: number;
  quality_score: number;
  defect_count: number;
  consistency: number;
  chemical_composition: {
    c3s: number;
    c2s: number;
    c3a: number;
    c4af: number;
    so3: number;
    free_lime: number;
  };
}

export interface EquipmentStatus {
  equipment_id: string;
  equipment_name: string;
  status: 'running' | 'stopped' | 'maintenance' | 'error';
  efficiency: number;
  temperature: number;
  vibration_level: number;
  power_consumption: number;
  runtime_hours: number;
  last_maintenance: Date;
  location: string;
  alerts: string[];
}

export interface EnvironmentalData {
  timestamp: Date;
  co2_emissions: number;
  nox_emissions: number;
  so2_emissions: number;
  dust_emissions: number;
  energy_consumption_specific: number;
  alternative_fuel_substitution: number;
  waste_heat_recovery: number;
  water_consumption: number;
}

export interface PlantOverview {
  timestamp: Date;
  overall_efficiency: number;
  production_rate_current: number;
  production_rate_target: number;
  energy_consumption_current: number;
  energy_consumption_target: number;
  quality_score_avg: number;
  active_alerts_count: number;
  equipment_running_count: number;
  equipment_total_count: number;
  environmental_compliance: boolean;
}

export interface Alert {
  id: string;
  timestamp: Date;
  type: 'warning' | 'error' | 'info';
  category: 'quality' | 'equipment' | 'process' | 'environmental' | 'safety';
  title: string;
  message: string;
  source: string;
  acknowledged: boolean;
  resolved: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface AIRecommendation {
  id: string;
  timestamp: Date;
  type: 'optimization' | 'maintenance' | 'quality' | 'energy' | 'environmental';
  title: string;
  description: string;
  potential_impact: string;
  implementation_difficulty: 'easy' | 'medium' | 'hard';
  estimated_savings: number;
  confidence_score: number;
}

export interface DashboardData {
  plant_overview: PlantOverview;
  recent_sensors: SensorReading[];
  current_parameters: ProcessParameters;
  recent_quality: QualityMetrics[];
  equipment_status: EquipmentStatus[];
  active_alerts: Alert[];
  ai_recommendations: AIRecommendation[];
  environmental_data: EnvironmentalData;
}

// Additional interfaces for AI responses
export interface AIResponse {
  response: string;
  recommendations?: string[];
  confidence?: number;
  timestamp?: Date;
}

export interface QualityFluctuation {
  parameter: string;
  current_value: number;
  target_value: number;
  deviation_percent: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  trend: 'stable' | 'increasing' | 'decreasing';
  recommendation: string;
  correction_action: string;
}