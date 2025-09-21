'use client'

import { useEffect, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
  Switch,
  FormControlLabel,
  TextField
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import {
  Refresh,
  DataUsage,
  Speed,
  NetworkCheck
} from '@mui/icons-material';
import io from 'socket.io-client';
import { DashboardData, SensorReading } from '../types/models';
import { buildApiUrl, buildWsUrl } from '../config/api';

const socket = io(buildWsUrl());

interface DataPoint {
  timestamp: string;
  value: number;
  sensor_id: string;
}

interface RealDataStatus {
  dataSource: string;
  recordCount: number;
  currentIndex: number;
  realDataEnabled: boolean;
}

export default function RealTimeTestDashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [liveData, setLiveData] = useState<DashboardData | null>(null);
  const [dataHistory, setDataHistory] = useState<DataPoint[]>([]);
  const [connectionTime, setConnectionTime] = useState<Date | null>(null);
  const [dataCount, setDataCount] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState('KILN_TEMP_01');
  const [updateInterval, setUpdateInterval] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [realDataEnabled, setRealDataEnabled] = useState(false);
  const [realDataStatus, setRealDataStatus] = useState<RealDataStatus | null>(null);

  // Calculate data rate
  const [dataRate, setDataRate] = useState(0);
  // Remove unused dataRateHistory variable

  useEffect(() => {
    // Connection events
    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionTime(new Date());
      console.log('✅ Real-time connection established');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setConnectionTime(null);
      console.log('❌ Real-time connection lost');
    });

    // Data stream
    socket.on('dashboard_update', (data: DashboardData) => {
      const now = new Date();
      setLiveData(data);
      setLastUpdate(now);
      setDataCount(prev => prev + 1);

      // Calculate data rate (updates per minute)
      if (updateInterval) {
        const rate = 60000 / updateInterval; // Convert to per minute
        setDataRate(rate);
        // Remove dataRateHistory update
      }

      // Record sensor data for visualization
      if (isRecording && data.recent_sensors) {
        const newDataPoints: DataPoint[] = data.recent_sensors.map(sensor => ({
          timestamp: now.toISOString(),
          value: sensor.value,
          sensor_id: sensor.sensor_id
        }));
        
        setDataHistory(prev => [...prev.slice(-100), ...newDataPoints]);
      }

      // Track update intervals
      if (lastUpdate) {
        const interval = now.getTime() - lastUpdate.getTime();
        setUpdateInterval(interval);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('dashboard_update');
    };
  }, [isRecording, lastUpdate, updateInterval]);

  const clearData = () => {
    setDataHistory([]);
    setDataCount(0);
    // Remove dataRateHistory clear
  };

  const requestManualUpdate = () => {
    socket.emit('request_sensor_data');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  // Real data management functions
  const loadRealData = async () => {
    try {
      const response = await fetch(buildApiUrl('/api/real-data/load'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataType: 'sample' })
      });
      const result = await response.json();
      if (result.success) {
        console.log('Real data loaded:', result);
        await checkRealDataStatus();
      }
    } catch (error) {
      console.error('Error loading real data:', error);
    }
  };

  const toggleRealData = async () => {
    try {
      const response = await fetch(buildApiUrl('/api/real-data/toggle'), {
        method: 'POST'
      });
      const result = await response.json();
      if (result.success) {
        setRealDataEnabled(result.realDataEnabled);
        console.log('Data mode toggled:', result.message);
      }
    } catch (error) {
      console.error('Error toggling data mode:', error);
    }
  };

  const checkRealDataStatus = async () => {
    try {
      const response = await fetch(buildApiUrl('/api/real-data/status'));
      const result = await response.json();
      if (result.success) {
        setRealDataStatus(result.data);
        setRealDataEnabled(result.data.realDataEnabled);
      }
    } catch (error) {
      console.error('Error checking real data status:', error);
    }
  };

  // Check real data status on component mount
  useEffect(() => {
    checkRealDataStatus();
  }, []);

  // Filter data for selected sensor
  const sensorData = dataHistory
    .filter(point => point.sensor_id === selectedSensor)
    .slice(-50)
    .map((point, index) => ({
      ...point,
      time: index,
      displayTime: new Date(point.timestamp).toLocaleTimeString()
    }));

  const connectionStatus = isConnected ? 'CONNECTED' : 'DISCONNECTED';
  const connectionColor = isConnected ? 'success' : 'error';

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        color: '#00E5FF', 
        fontWeight: 700,
        mb: 3
      }}>
        🔬 Real-Time Data Testing Lab
      </Typography>

      {/* Connection Status */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1A1F2E, #242B3D)' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" sx={{ color: '#00E5FF' }}>
            🔗 Connection Status & Diagnostics
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={connectionStatus}
              color={connectionColor}
              icon={<NetworkCheck />}
              sx={{ fontWeight: 600 }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                if (isConnected) {
                  socket.disconnect();
                } else {
                  socket.connect();
                }
              }}
              sx={{ 
                borderColor: isConnected ? '#F44336' : '#00E5FF',
                color: isConnected ? '#F44336' : '#00E5FF'
              }}
            >
              {isConnected ? 'Disconnect' : 'Reconnect'}
            </Button>
          </Box>
        </Box>
        
        <Box display="flex" gap={2} flexWrap="wrap">
          <Box flex={1} minWidth={250}>
            <Card sx={{ height: '100%', background: 'rgba(0, 229, 255, 0.05)' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Connection Time
                </Typography>
                <Typography variant="h6">
                  {connectionTime ? connectionTime.toLocaleTimeString() : 'Not connected'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box flex={1} minWidth={250}>
            <Card sx={{ height: '100%', background: 'rgba(0, 229, 255, 0.05)' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Data Updates Received
                </Typography>
                <Typography variant="h6">
                  {dataCount}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box flex={1} minWidth={250}>
            <Card sx={{ height: '100%', background: 'rgba(0, 229, 255, 0.05)' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Update Rate
                </Typography>
                <Typography variant="h6">
                  {dataRate > 0 ? `${dataRate.toFixed(1)}/min` : 'Calculating...'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box flex={1} minWidth={250}>
            <Card sx={{ height: '100%', background: 'rgba(0, 229, 255, 0.05)' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Last Update
                </Typography>
                <Typography variant="h6">
                  {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Paper>

      {/* Real Data Management */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1A1F2E, #242B3D)' }}>
        <Typography variant="h6" sx={{ color: '#00E5FF', mb: 2 }}>
          🏭 Real Cement Plant Data
        </Typography>
        
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" mb={2}>
          <Button 
            variant="contained" 
            startIcon={<DataUsage />}
            onClick={loadRealData}
            sx={{ backgroundColor: '#00E5FF', color: '#000' }}
          >
            Load Sample Real Data
          </Button>
          
          <Button 
            variant={realDataEnabled ? "contained" : "outlined"}
            startIcon={<Speed />}
            onClick={toggleRealData}
            color={realDataEnabled ? "success" : "primary"}
          >
            {realDataEnabled ? 'Using Real Data' : 'Using Simulated Data'}
          </Button>
          
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            onClick={checkRealDataStatus}
            size="small"
          >
            Refresh Status
          </Button>
        </Box>
        
        {realDataStatus && (
          <Box display="flex" gap={2} flexWrap="wrap">
            <Card sx={{ minWidth: 200, background: 'rgba(0, 229, 255, 0.05)' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Data Source
                </Typography>
                <Typography variant="h6" sx={{ color: realDataEnabled ? '#00E676' : '#FFB74D' }}>
                  {realDataStatus.dataSource}
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ minWidth: 200, background: 'rgba(0, 229, 255, 0.05)' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Records Available
                </Typography>
                <Typography variant="h6">
                  {realDataStatus.recordCount}
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ minWidth: 200, background: 'rgba(0, 229, 255, 0.05)' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Current Record Index
                </Typography>
                <Typography variant="h6">
                  {realDataStatus.currentIndex}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Paper>
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1A1F2E, #242B3D)' }}>
        <Typography variant="h6" sx={{ color: '#00E5FF', mb: 2 }}>
          Testing Controls
        </Typography>
        
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <FormControlLabel
            control={
              <Switch 
                checked={isRecording} 
                onChange={toggleRecording}
                color="primary"
              />
            }
            label="Recording Data"
          />
          
          <Button 
            variant="contained" 
            startIcon={<Refresh />}
            onClick={requestManualUpdate}
            disabled={!isConnected}
          >
            Manual Update
          </Button>
          
          <Button 
            variant="outlined" 
            startIcon={<DataUsage />}
            onClick={clearData}
            color="secondary"
          >
            Clear Data
          </Button>
          
          <TextField
            select
            size="small"
            label="Sensor to Monitor"
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
            SelectProps={{ native: true }}
            sx={{ minWidth: 200 }}
          >
            <option value="KILN_TEMP_01">Kiln Temperature</option>
            <option value="KILN_PRESSURE_01">Kiln Pressure</option>
            <option value="RAW_MILL_POWER_01">Raw Mill Power</option>
            <option value="CEMENT_MILL_POWER_01">Cement Mill Power</option>
            <option value="PRODUCTION_FLOW_01">Production Flow</option>
            <option value="FINENESS_01">Fineness</option>
          </TextField>
        </Box>
      </Paper>

      {/* Real-time Chart */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1A1F2E, #242B3D)' }}>
        <Typography variant="h6" sx={{ color: '#00E5FF', mb: 2 }}>
          Live Sensor Data: {selectedSensor}
        </Typography>
        
        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="time"
                stroke="#A0AEC0"
                fontSize={12}
              />
              <YAxis 
                stroke="#A0AEC0"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1F2E', 
                  border: '1px solid #00E5FF',
                  borderRadius: '8px'
                }}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(2)}`,
                  name
                ]}
                labelFormatter={(label: string) => `Sample ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#00E5FF" 
                strokeWidth={2}
                dot={false}
                name={selectedSensor}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Current Data Table */}
      {liveData && (
        <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1A1F2E, #242B3D)' }}>
          <Typography variant="h6" sx={{ color: '#00E5FF', mb: 2 }}>
            Current Sensor Readings
          </Typography>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#00E5FF', fontWeight: 600 }}>Sensor ID</TableCell>
                  <TableCell sx={{ color: '#00E5FF', fontWeight: 600 }}>Value</TableCell>
                  <TableCell sx={{ color: '#00E5FF', fontWeight: 600 }}>Unit</TableCell>
                  <TableCell sx={{ color: '#00E5FF', fontWeight: 600 }}>Location</TableCell>
                  <TableCell sx={{ color: '#00E5FF', fontWeight: 600 }}>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {liveData.recent_sensors.map((sensor: SensorReading) => (
                  <TableRow key={sensor.sensor_id}>
                    <TableCell sx={{ color: '#E0E6ED' }}>{sensor.sensor_id}</TableCell>
                    <TableCell sx={{ color: '#E0E6ED', fontWeight: 600 }}>
                      {sensor.value.toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ color: '#A0AEC0' }}>{sensor.unit}</TableCell>
                    <TableCell sx={{ color: '#A0AEC0' }}>{sensor.location}</TableCell>
                    <TableCell sx={{ color: '#A0AEC0' }}>{sensor.sensor_type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Data Flow Information */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Real-Time Data Testing Information</AlertTitle>
        <Typography variant="body2">
          • <strong>Backend URL:</strong> {process.env.NEXT_PUBLIC_BACKEND_URL || 'https://cement-line.onrender.com'}<br/>
          • <strong>WebSocket URL:</strong> {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}<br/>
          • <strong>Connection Status:</strong> {isConnected ? '🟢 Connected' : '🔴 Disconnected'}<br/>
          • <strong>Data Source:</strong> {realDataEnabled ? 'Real cement plant operational data' : 'Simulated cement plant sensors generating realistic values'}<br/>
          • <strong>Update Frequency:</strong> Every 5 seconds via WebSocket connection<br/>
          • <strong>Data Types:</strong> {realDataEnabled ? 'Historical plant records with real operational parameters' : 'Temperature, pressure, power, flow, and quality metrics'}<br/>
          • <strong>Recording:</strong> {isRecording ? 'Currently recording to history buffer' : 'Paused - toggle recording to capture data'}<br/>
          • <strong>Buffer Size:</strong> Last 100 data points per sensor<br/>
          • <strong>Transport:</strong> WebSocket with polling fallback<br/>
          {realDataEnabled && realDataStatus && (
            <>
              • <strong>Real Data Records:</strong> {realDataStatus.recordCount} available, currently at index {realDataStatus.currentIndex}<br/>
              • <strong>Data Characteristics:</strong> Kiln temp: 1448-1456°C, Mill power: 2820-2925kW, Production: 1820-1905 TPH
            </>
          )}
          {!isConnected && (
            <>
              <br/>
              • <strong>⚠️ Connection Troubleshooting:</strong> Check if backend is running on Render. Try refreshing the page or wait for reconnection attempts.
            </>
          )}
        </Typography>
      </Alert>
    </Box>
  );
}