'use client'

import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
  AlertTitle,
  Button,
  IconButton,
  Collapse
} from '@mui/material';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  AutoFixHigh,
  Science,
  ExpandMore,
  PlayArrow,
  Stop
} from '@mui/icons-material';
import { DashboardData, ProcessParameters } from '../types/models';
import { buildApiUrl } from '../config/api';

interface QualityFluctuation {
  parameter: string;
  current_value: number;
  target_value: number;
  deviation_percent: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  trend: 'stable' | 'increasing' | 'decreasing';
  recommendation: string;
  correction_action: string;
}

interface InputMonitoringData {
  timestamp: string;
  kiln_temperature: number;
  raw_mill_power: number;
  cement_mill_power: number;
  raw_meal_flow: number;
  alternative_fuel_rate: number;
  clinker_temperature: number;
  quality_score: number;
}

interface QualityConsistencyMonitorProps {
  dashboardData?: DashboardData;
}

export default function QualityConsistencyMonitor({ dashboardData }: QualityConsistencyMonitorProps) {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [fluctuations, setFluctuations] = useState<QualityFluctuation[]>([]);
  const [historicalData, setHistoricalData] = useState<InputMonitoringData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState<string>('kiln_temperature');
  const [isExpanded, setIsExpanded] = useState(true);
  const [alertsCount, setAlertsCount] = useState({ critical: 0, high: 0, medium: 0 });

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://cement-line.onrender.com';

  // Quality thresholds for input parameters
  const qualityThresholds = {
    kiln_temperature: { min: 1450, max: 1500, optimal: 1475 },
    raw_mill_power: { min: 2800, max: 3000, optimal: 2900 },
    cement_mill_power: { min: 3100, max: 3300, optimal: 3200 },
    raw_meal_flow: { min: 2800, max: 3100, optimal: 2950 },
    alternative_fuel_rate: { min: 20, max: 35, optimal: 28 },
    clinker_temperature: { min: 1100, max: 1200, optimal: 1150 }
  };

  // Monitor input fluctuations in real-time
  useEffect(() => {
    if (!dashboardData || !isMonitoring) return;

    const currentParams = dashboardData.current_parameters;
    const timestamp = new Date().toISOString();

    // Add to historical data
    const newDataPoint: InputMonitoringData = {
      timestamp,
      kiln_temperature: currentParams.kiln_temperature,
      raw_mill_power: currentParams.raw_mill_power,
      cement_mill_power: currentParams.cement_mill_power,
      raw_meal_flow: currentParams.raw_meal_flow,
      alternative_fuel_rate: currentParams.alternative_fuel_rate,
      clinker_temperature: currentParams.clinker_temperature,
      quality_score: dashboardData.plant_overview.quality_score_avg
    };

    setHistoricalData(prev => [...prev.slice(-49), newDataPoint]);

    // Analyze fluctuations
    analyzeInputFluctuations(currentParams);
  }, [dashboardData, isMonitoring]); // Remove problematic dependency

  const analyzeInputFluctuations = useCallback((params: ProcessParameters) => {
    const newFluctuations: QualityFluctuation[] = [];
    const alerts = { critical: 0, high: 0, medium: 0 };

    Object.entries(qualityThresholds).forEach(([param, thresholds]) => {
      const currentValue = params[param as keyof ProcessParameters] as number;
      const deviation = Math.abs(currentValue - thresholds.optimal) / thresholds.optimal * 100;
      
      let severity: QualityFluctuation['severity'] = 'low';
      let recommendation = '';
      let correctionAction = '';

      if (currentValue < thresholds.min || currentValue > thresholds.max) {
        severity = 'critical';
        alerts.critical++;
        if (currentValue < thresholds.min) {
          recommendation = `${param.replace('_', ' ')} is critically low. Immediate adjustment required.`;
          correctionAction = `Increase ${param.replace('_', ' ')} to ${thresholds.optimal}`;
        } else {
          recommendation = `${param.replace('_', ' ')} is critically high. Immediate reduction required.`;
          correctionAction = `Decrease ${param.replace('_', ' ')} to ${thresholds.optimal}`;
        }
      } else if (deviation > 3) {
        severity = 'high';
        alerts.high++;
        recommendation = `${param.replace('_', ' ')} deviation is ${deviation.toFixed(1)}%. Adjustment recommended.`;
        correctionAction = `Adjust ${param.replace('_', ' ')} towards optimal ${thresholds.optimal}`;
      } else if (deviation > 1.5) {
        severity = 'medium';
        alerts.medium++;
        recommendation = `${param.replace('_', ' ')} showing minor fluctuation. Monitor closely.`;
        correctionAction = `Fine-tune ${param.replace('_', ' ')} settings`;
      }

      if (severity !== 'low') {
        newFluctuations.push({
          parameter: param,
          current_value: currentValue,
          target_value: thresholds.optimal,
          deviation_percent: deviation,
          severity,
          trend: calculateTrend(param, currentValue),
          recommendation,
          correction_action: correctionAction
        });
      }
    });

    setFluctuations(newFluctuations);
    setAlertsCount(alerts);
  }, []); // Add dependency array

  const calculateTrend = (param: string, _currentValue: number): QualityFluctuation['trend'] => {
    if (historicalData.length < 3) return 'stable';
    
    const recent = historicalData.slice(-3).map(d => d[param as keyof InputMonitoringData] as number);
    const slope = (recent[2] - recent[0]) / 2;
    
    if (Math.abs(slope) < 1) return 'stable';
    return slope > 0 ? 'increasing' : 'decreasing';
  };

  const generateProactiveCorrections = async () => {
    if (!dashboardData) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch(buildApiUrl('/api/ai/proactive-quality-corrections'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentData: dashboardData,
          fluctuations: fluctuations,
          historicalTrends: historicalData.slice(-10)
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Handle the AI response - could update recommendations or show in a modal
        console.log('Proactive corrections:', result.data);
      }
    } catch (error) {
      console.error('Error generating proactive corrections:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: QualityFluctuation['severity']) => {
    switch (severity) {
      case 'critical': return '#F44336';
      case 'high': return '#FF9800';
      case 'medium': return '#FFC107';
      default: return '#4CAF50';
    }
  };

  const getTrendIcon = (trend: QualityFluctuation['trend']) => {
    switch (trend) {
      case 'increasing': return <TrendingUp sx={{ color: '#F44336' }} />;
      case 'decreasing': return <TrendingDown sx={{ color: '#2196F3' }} />;
      default: return <CheckCircle sx={{ color: '#4CAF50' }} />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ 
            color: '#00E5FF', 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Science sx={{ fontSize: 40, filter: 'drop-shadow(0 0 10px #00E5FF)' }} />
            Quality Consistency Monitor
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Real-time input fluctuation detection with proactive quality corrections
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant={isMonitoring ? "contained" : "outlined"}
            startIcon={isMonitoring ? <Stop /> : <PlayArrow />}
            onClick={() => setIsMonitoring(!isMonitoring)}
            sx={{
              backgroundColor: isMonitoring ? '#F44336' : '#4CAF50',
              color: '#FFF',
              '&:hover': {
                backgroundColor: isMonitoring ? '#D32F2F' : '#388E3C'
              }
            }}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
          
          <Button
            variant="contained"
            startIcon={<AutoFixHigh />}
            onClick={generateProactiveCorrections}
            disabled={isAnalyzing || fluctuations.length === 0}
            sx={{
              backgroundColor: '#FF6B35',
              color: '#000',
              '&:hover': { backgroundColor: '#FF8A65' }
            }}
          >
            {isAnalyzing ? 'Analyzing...' : 'Generate Corrections'}
          </Button>
        </Box>
      </Box>

      {/* Status Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3, mb: 4 }}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #1A1F2E, #242B3D)',
          border: `1px solid ${alertsCount.critical > 0 ? '#F44336' : '#4CAF50'}`
        }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Critical Alerts
            </Typography>
            <Typography variant="h3" sx={{ 
              color: alertsCount.critical > 0 ? '#F44336' : '#4CAF50',
              fontWeight: 700
            }}>
              {alertsCount.critical}
            </Typography>
            <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
              Immediate action required
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ 
          background: 'linear-gradient(135deg, #1A1F2E, #242B3D)',
          border: `1px solid ${alertsCount.high > 0 ? '#FF9800' : 'rgba(255, 152, 0, 0.3)'}`
        }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              High Priority
            </Typography>
            <Typography variant="h3" sx={{ 
              color: '#FF9800',
              fontWeight: 700
            }}>
              {alertsCount.high}
            </Typography>
            <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
              Adjustment recommended
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ 
          background: 'linear-gradient(135deg, #1A1F2E, #242B3D)',
          border: `1px solid ${alertsCount.medium > 0 ? '#FFC107' : 'rgba(255, 193, 7, 0.3)'}`
        }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Medium Priority
            </Typography>
            <Typography variant="h3" sx={{ 
              color: '#FFC107',
              fontWeight: 700
            }}>
              {alertsCount.medium}
            </Typography>
            <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
              Monitor closely
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ 
          background: 'linear-gradient(135deg, #1A1F2E, #242B3D)',
          border: '1px solid rgba(0, 229, 255, 0.3)'
        }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Monitoring Status
            </Typography>
            <Typography variant="h6" sx={{ 
              color: isMonitoring ? '#00E5FF' : '#666',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              {isMonitoring ? <CheckCircle /> : <Warning />}
              {isMonitoring ? 'ACTIVE' : 'PAUSED'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
              Real-time analysis
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Fluctuations List */}
      <Paper sx={{ 
        p: 3, 
        mb: 3,
        background: 'linear-gradient(135deg, #1A1F2E, #242B3D)',
        border: '1px solid rgba(255, 107, 53, 0.2)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" sx={{ color: '#FF6B35', fontWeight: 600 }}>
            🚨 Active Input Fluctuations
          </Typography>
          <IconButton onClick={() => setIsExpanded(!isExpanded)} sx={{ color: '#FF6B35' }}>
            <ExpandMore sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }} />
          </IconButton>
        </Box>
        
        <Collapse in={isExpanded}>
          {fluctuations.length === 0 ? (
            <Alert severity="success" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
              <AlertTitle>✅ All Parameters Stable</AlertTitle>
              No significant input fluctuations detected. Quality consistency is maintained.
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {fluctuations.map((fluctuation, index) => (
                <Alert
                  key={index}
                  severity={fluctuation.severity === 'critical' ? 'error' : fluctuation.severity === 'high' ? 'warning' : 'info'}
                  sx={{
                    backgroundColor: `${getSeverityColor(fluctuation.severity)}20`,
                    border: `1px solid ${getSeverityColor(fluctuation.severity)}50`,
                    '& .MuiAlert-icon': { color: getSeverityColor(fluctuation.severity) }
                  }}
                  action={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getTrendIcon(fluctuation.trend)}
                      <Chip 
                        label={`${fluctuation.deviation_percent.toFixed(1)}% deviation`}
                        size="small"
                        sx={{
                          backgroundColor: getSeverityColor(fluctuation.severity),
                          color: '#FFF',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  }
                >
                  <AlertTitle sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
                    {fluctuation.parameter.replace('_', ' ')} - {fluctuation.severity.toUpperCase()} FLUCTUATION
                  </AlertTitle>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Current:</strong> {fluctuation.current_value.toFixed(1)} | 
                    <strong> Target:</strong> {fluctuation.target_value.toFixed(1)} | 
                    <strong> Trend:</strong> {fluctuation.trend}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: '#E0E6ED' }}>
                    <strong>Recommendation:</strong> {fluctuation.recommendation}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#00E5FF', fontWeight: 600 }}>
                    <AutoFixHigh sx={{ fontSize: 16, mr: 0.5 }} />
                    <strong>Proactive Action:</strong> {fluctuation.correction_action}
                  </Typography>
                </Alert>
              ))}
            </Box>
          )}
        </Collapse>
      </Paper>

      {/* Historical Trend Chart */}
      <Paper sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #1A1F2E, #242B3D)',
        border: '1px solid rgba(0, 229, 255, 0.2)'
      }}>
        <Typography variant="h5" sx={{ color: '#00E5FF', fontWeight: 600, mb: 3 }}>
          📊 Input Parameter Trends & Quality Impact
        </Typography>
        
        {historicalData.length > 0 ? (
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData.slice(-20)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#A0AEC0"
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis stroke="#A0AEC0" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1F2E', 
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                />
                <Area
                  type="monotone"
                  dataKey={selectedParameter}
                  stroke="#00E5FF"
                  fill="rgba(0, 229, 255, 0.2)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="quality_score"
                  stroke="#FF6B35"
                  fill="rgba(255, 107, 53, 0.1)"
                  strokeWidth={2}
                />
                {qualityThresholds[selectedParameter as keyof typeof qualityThresholds] && (
                  <>
                    <ReferenceLine 
                      y={qualityThresholds[selectedParameter as keyof typeof qualityThresholds].optimal} 
                      stroke="#4CAF50" 
                      strokeDasharray="5 5"
                      label="Optimal"
                    />
                    <ReferenceLine 
                      y={qualityThresholds[selectedParameter as keyof typeof qualityThresholds].min} 
                      stroke="#F44336" 
                      strokeDasharray="5 5"
                      label="Min"
                    />
                    <ReferenceLine 
                      y={qualityThresholds[selectedParameter as keyof typeof qualityThresholds].max} 
                      stroke="#F44336" 
                      strokeDasharray="5 5"
                      label="Max"
                    />
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Collecting data... Please wait for trend analysis.
            </Typography>
          </Box>
        )}

        {/* Parameter Selection */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {Object.keys(qualityThresholds).map((param) => (
            <Chip
              key={param}
              label={param.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              onClick={() => setSelectedParameter(param)}
              variant={selectedParameter === param ? 'filled' : 'outlined'}
              sx={{
                backgroundColor: selectedParameter === param ? '#00E5FF' : 'transparent',
                color: selectedParameter === param ? '#000' : '#00E5FF',
                borderColor: '#00E5FF',
                '&:hover': {
                  backgroundColor: selectedParameter === param ? '#40C4FF' : 'rgba(0, 229, 255, 0.1)'
                }
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}