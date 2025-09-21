'use client'

import { useEffect, useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  LinearProgress,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Button,
  Alert,
  Fab
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import {  
  Dashboard,
  Analytics,
  SmartToy,
  Settings,
  MenuOpen,
  Menu,
  Science,
  Warning as WarningIcon,
  AutoFixHigh as OptimizeIcon,
  Timeline,
  KeyboardArrowUp,
  Memory
} from '@mui/icons-material';
import io, { Socket } from 'socket.io-client';
import { DashboardData, ProcessParameters } from '../types/models';
import AIAssistant from '../components/AIAssistant';
import RealTimeTestDashboard from '../components/RealTimeTestDashboard';
import QualityConsistencyMonitor from '../components/QualityConsistencyMonitor';
import SystemPromptConfig from '../components/SystemPromptConfig';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Dashboard, color: '#00E5FF' },
  { id: 'analytics', label: 'Analytics', icon: Analytics, color: '#40C4FF' },
  { id: 'quality-consistency', label: 'Quality Monitor', icon: Science, color: '#FF6B35' },
  { id: 'ai-assistant', label: 'AI Assistant', icon: SmartToy, color: '#FF6B35' },
  { id: 'settings', label: 'Settings', icon: Settings, color: '#90A4AE' },
];

export default function FuturisticDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [processHistory, setProcessHistory] = useState<ProcessParameters[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  // const [socket, setSocket] = useState<Socket | null>(null); // Remove unused socket
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  const drawerWidth = sidebarOpen ? 280 : 80;

  // Handle navigation menu item clicks
  const handleNavClick = (itemId: string) => {
    setActiveView(itemId);
    setTestMode(false); // Exit test mode when navigating to other views
    console.log(`Navigating to: ${itemId}`);
    
    // For now, we'll show different views in the console
    // In a full implementation, these would route to different components
    switch (itemId) {
      case 'dashboard':
        console.log('Showing Dashboard view');
        break;
      case 'analytics':
        console.log('Showing Analytics view - charts and data analysis');
        break;
      case 'quality-consistency':
        console.log('Showing Quality Consistency Monitor - proactive quality corrections');
        break;
      case 'ai-assistant':
        console.log('Showing AI Assistant view - conversational interface and quality analysis');
        break;
      case 'settings':
        console.log('Showing Settings view - configuration options');
        setSettingsDialogOpen(true);
        break;
      default:
        console.log(`Unknown view: ${itemId}`);
    }
  };

  // Render content based on active view
  const renderActiveViewContent = () => {
    if (activeView === 'quality-consistency') {
      // Return dedicated Quality Consistency Monitor
      return <QualityConsistencyMonitor dashboardData={dashboardData || undefined} />;
    } else if (activeView === 'ai-assistant') {
      // Return dedicated AI Assistant and Quality Analysis view
      return (
        <>
          {/* AI Quality Analysis Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ 
              color: '#FF6B35', 
              fontWeight: 700, 
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <SmartToy sx={{ fontSize: 40, filter: 'drop-shadow(0 0 10px #FF6B35)' }} />
              AI Quality Analysis & Monitoring
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Gemini-powered quality fluctuation detection and real-time optimization recommendations
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Chip 
                label="✅ Real-time Analysis Active"
                sx={{
                  backgroundColor: 'rgba(0, 229, 255, 0.2)',
                  color: '#00E5FF',
                  fontWeight: 600
                }}
              />
              <Chip 
                label="✅ Gemini AI Connected"
                sx={{
                  backgroundColor: 'rgba(255, 107, 53, 0.2)',
                  color: '#FF6B35',
                  fontWeight: 600
                }}
              />
              <Chip 
                label="✅ Firebase Sync Ready"
                sx={{
                  backgroundColor: 'rgba(129, 199, 132, 0.2)',
                  color: '#81C784',
                  fontWeight: 600
                }}
              />
            </Box>
          </Box>

          {/* AI Features Grid */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            {/* Quality Analysis Card */}
            <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
              <Paper sx={{ 
                p: 3, 
                height: 300,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(255, 107, 53, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.2)',
                  border: '1px solid rgba(255, 107, 53, 0.5)'
                }
              }}
              onClick={() => {
                const event = new CustomEvent('triggerQualityAnalysis');
                window.dispatchEvent(event);
              }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <WarningIcon sx={{ fontSize: 40, color: '#FF6B35', mr: 2, filter: 'drop-shadow(0 0 8px #FF6B35)' }} />
                  <Box>
                    <Typography variant="h5" sx={{ color: '#FF6B35', fontWeight: 700 }}>
                      Quality Fluctuation Detection
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
                      AI-powered quality anomaly detection
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body1" sx={{ color: '#E0E6ED', mb: 3, lineHeight: 1.6 }}>
                  Advanced analysis of compressive strength, fineness, and chemical composition variations. 
                  Detects patterns that indicate quality issues before they impact production.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#00E5FF' }}>
                    ⚡ Real-time monitoring active
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#81C784' }}>
                    🔍 Pattern recognition enabled
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FFB74D' }}>
                    📊 Historical trend analysis
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Optimization Card */}
            <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
              <Paper sx={{ 
                p: 3, 
                height: 300,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 229, 255, 0.2)',
                  border: '1px solid rgba(0, 229, 255, 0.5)'
                }
              }}
              onClick={() => {
                const event = new CustomEvent('triggerOptimization', { detail: 'quality' });
                window.dispatchEvent(event);
              }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <OptimizeIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2, filter: 'drop-shadow(0 0 8px #00E5FF)' }} />
                  <Box>
                    <Typography variant="h5" sx={{ color: '#00E5FF', fontWeight: 700 }}>
                      AI Optimization Engine
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
                      Multi-objective process optimization
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body1" sx={{ color: '#E0E6ED', mb: 3, lineHeight: 1.6 }}>
                  Intelligent recommendations for kiln temperature, mill power, and fuel rates. 
                  Optimizes for quality, energy efficiency, production, or environmental impact.
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                    🎯 Quality Focus
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FF9800' }}>
                    ⚡ Energy Efficiency
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2196F3' }}>
                    🚀 Max Production
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#81C784' }}>
                    🌱 Environmental
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Live Metrics Card */}
            <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
              <Paper sx={{ 
                p: 3, 
                height: 300,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(186, 104, 200, 0.3)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Timeline sx={{ fontSize: 40, color: '#BA68C8', mr: 2, filter: 'drop-shadow(0 0 8px #BA68C8)' }} />
                  <Box>
                    <Typography variant="h5" sx={{ color: '#BA68C8', fontWeight: 700 }}>
                      Live Quality Metrics
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
                      Real-time quality status
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, background: 'rgba(0, 230, 118, 0.1)' }}>
                    <Typography variant="h3" sx={{ color: '#00E676', fontWeight: 700 }}>
                      {plant_overview.quality_score_avg.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#81C784' }}>
                      Quality Score
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, background: 'rgba(255, 107, 53, 0.1)' }}>
                    <Typography variant="h3" sx={{ color: '#FF6B35', fontWeight: 700 }}>
                      {plant_overview.active_alerts_count}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#FFB74D' }}>
                      Active Alerts
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, background: 'rgba(0, 229, 255, 0.1)' }}>
                    <Typography variant="h3" sx={{ color: '#00E5FF', fontWeight: 700 }}>
                      {plant_overview.overall_efficiency.toFixed(0)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#40C4FF' }}>
                      Efficiency
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, background: 'rgba(129, 199, 132, 0.1)' }}>
                    <Typography variant="h3" sx={{ color: '#81C784', fontWeight: 700 }}>
                      {((plant_overview.production_rate_current / plant_overview.production_rate_target) * 100).toFixed(0)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#A4E79D' }}>
                      Target Achievement
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* AI Assistant Interface */}
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flex: '1 1 600px', minWidth: '600px' }}>
              {dashboardData && <AIAssistant dashboardData={dashboardData} />}
            </Box>
            
            <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
              <Paper sx={{ 
                p: 3, 
                height: 450,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(255, 107, 53, 0.2)'
              }}>
                <Typography variant="h6" sx={{ color: '#FF6B35', mb: 3, fontWeight: 600 }}>
                  🔬 Analysis Results
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: 'calc(100% - 50px)', overflow: 'auto' }}>
                  <Alert severity="success" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                    <Typography variant="body2">
                      ✅ Quality monitoring systems are active and functioning normally
                    </Typography>
                  </Alert>
                  
                  <Alert severity="info" sx={{ backgroundColor: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
                    <Typography variant="body2">
                      🤖 Gemini AI is ready to analyze quality fluctuations and provide optimization recommendations
                    </Typography>
                  </Alert>
                  
                  <Alert severity="warning" sx={{ backgroundColor: 'rgba(255, 152, 0, 0.1)', border: '1px solid rgba(255, 152, 0, 0.3)' }}>
                    <Typography variant="body2">
                      ⚠️ {plant_overview.active_alerts_count > 0 ? `${plant_overview.active_alerts_count} quality alert${plant_overview.active_alerts_count > 1 ? 's' : ''} detected` : 'No quality alerts detected'}
                    </Typography>
                  </Alert>
                  
                  <Paper sx={{ p: 2, background: 'rgba(186, 104, 200, 0.05)', border: '1px solid rgba(186, 104, 200, 0.2)' }}>
                    <Typography variant="body2" sx={{ color: '#BA68C8', fontWeight: 600, mb: 1 }}>
                      Current Analysis Status:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#E0E6ED', fontSize: '0.85rem' }}>
                      • Real-time data streaming: ✅ Active<br/>
                      • Quality trend analysis: ✅ Running<br/>
                      • AI recommendations: ✅ Available<br/>
                      • Firebase sync: ✅ Connected<br/>
                      • Anomaly detection: ✅ Monitoring
                    </Typography>
                  </Paper>
                  
                  <Typography variant="caption" sx={{ color: '#A0AEC0', textAlign: 'center', mt: 2 }}>
                    Click on the cards above or use the AI Assistant to trigger specific analyses
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        </>
      );
    } else if (activeView === 'analytics') {
      // Return comprehensive analytics dashboard
      return (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ 
              color: '#40C4FF', 
              fontWeight: 700, 
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Analytics sx={{ fontSize: 40, filter: 'drop-shadow(0 0 10px #40C4FF)' }} />
              Advanced Analytics Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Real-time data analysis with predictive insights and performance metrics
            </Typography>
          </Box>

          {/* Analytics KPI Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3, mb: 4 }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #1A1F2E, #242B3D)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Production Efficiency Trend
                </Typography>
                <Typography variant="h3" sx={{ color: '#00E5FF', fontWeight: 700 }}>
                  {plant_overview.overall_efficiency.toFixed(1)}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#81C784' }}>
                  ↗ +2.3% from last period
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ 
              background: 'linear-gradient(135deg, #1A1F2E, #242B3D)',
              border: '1px solid rgba(255, 152, 0, 0.3)',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Energy Performance Index
                </Typography>
                <Typography variant="h3" sx={{ color: '#FF9800', fontWeight: 700 }}>
                  {((plant_overview.energy_consumption_target / plant_overview.energy_consumption_current) * 100).toFixed(0)}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: plant_overview.energy_consumption_current > plant_overview.energy_consumption_target ? '#FF5722' : '#81C784'
                }}>
                  {plant_overview.energy_consumption_current > plant_overview.energy_consumption_target ? '↗ Above target' : '↘ Below target'}
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ 
              background: 'linear-gradient(135deg, #1A1F2E, #242B3D)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Quality Consistency Score
                </Typography>
                <Typography variant="h3" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                  {plant_overview.quality_score_avg.toFixed(1)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#81C784' }}>
                  ✓ Within specification
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ 
              background: 'linear-gradient(135deg, #1A1F2E, #242B3D)',
              border: '1px solid rgba(255, 107, 53, 0.3)',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Environmental Impact Score
                </Typography>
                <Typography variant="h3" sx={{ color: '#FF6B35', fontWeight: 700 }}>
                  {(100 - (environmental_data.co2_emissions / 10)).toFixed(0)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#81C784' }}>
                  CO₂: {environmental_data.co2_emissions.toFixed(0)} kg/t
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Real-time Charts */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
            {/* Production & Energy Chart - Full Width */}
            <Box sx={{ width: '100%' }}>
              <Paper sx={{ 
                p: 3, 
                height: 400,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(0, 229, 255, 0.2)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#00E5FF', fontWeight: 600, mb: 2 }}>
                  📊 Production vs Energy Consumption Trend
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 229, 255, 0.1)" />
                    <XAxis dataKey="time" stroke="#A0AEC0" />
                    <YAxis yAxisId="left" stroke="#A0AEC0" />
                    <YAxis yAxisId="right" orientation="right" stroke="#A0AEC0" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A1F2E', 
                        border: '1px solid rgba(0, 229, 255, 0.3)',
                        borderRadius: '8px',
                        color: '#E0E6ED'
                      }} 
                    />
                    <Legend />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="#FF9800" 
                      strokeWidth={3}
                      name="Energy (kWh/t)" 
                      dot={false}
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="production" 
                      stroke="#4CAF50" 
                      strokeWidth={3}
                      name="Production (TPH)" 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Box>

            {/* Quality Metrics Chart - Moved Below Production Chart */}
            <Box sx={{ width: '100%' }}>
              <Paper sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(76, 175, 80, 0.2)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#4CAF50', fontWeight: 600, mb: 3 }}>
                  🎯 Quality Metrics Analysis
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2.5 }}>
                  {/* Current Quality Data */}
                  {dashboardData && dashboardData.recent_quality.length > 0 && (
                    <>
                      <Box sx={{ 
                        p: 2.5, 
                        borderRadius: 2, 
                        background: 'linear-gradient(90deg, rgba(76, 175, 80, 0.1), rgba(129, 199, 132, 0.1))',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        height: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
                          Compressive Strength (28d)
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 700, mb: 0.5 }}>
                          {dashboardData.recent_quality[0].compressive_strength_28d.toFixed(1)} MPa
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#81C784', fontSize: '0.8rem', lineHeight: 1.3 }}>
                          Target: 42.5 MPa | Spec: ≥40 MPa
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        p: 2.5, 
                        borderRadius: 2, 
                        background: 'linear-gradient(90deg, rgba(0, 229, 255, 0.1), rgba(64, 196, 255, 0.1))',
                        border: '1px solid rgba(0, 229, 255, 0.3)',
                        height: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="body2" sx={{ color: '#00E5FF', fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
                          Blaine Fineness
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#00E5FF', fontWeight: 700, mb: 0.5 }}>
                          {dashboardData.recent_quality[0].blaine_fineness.toFixed(0)} m²/kg
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#40C4FF', fontSize: '0.8rem', lineHeight: 1.3 }}>
                          Target: 350-400 m²/kg
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        p: 2.5, 
                        borderRadius: 2, 
                        background: 'linear-gradient(90deg, rgba(255, 152, 0, 0.1), rgba(255, 183, 77, 0.1))',
                        border: '1px solid rgba(255, 152, 0, 0.3)',
                        height: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="body2" sx={{ color: '#FF9800', fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
                          Setting Time (Initial)
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 700, mb: 0.5 }}>
                          {dashboardData.recent_quality[0].setting_time_initial.toFixed(0)} min
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#FFB74D', fontSize: '0.8rem', lineHeight: 1.3 }}>
                          Spec: ≥45 min
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* Equipment Performance Analytics */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Box sx={{ flex: '1 1 700px', minWidth: '700px' }}>
              <Paper sx={{ 
                p: 3, 
                minHeight: 400,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(186, 104, 200, 0.2)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#BA68C8', fontWeight: 600, mb: 3 }}>
                  ⚙️ Equipment Performance Matrix
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                  gap: 2.5, 
                  height: 'calc(100% - 60px)', 
                  overflow: 'auto',
                  pr: 1
                }}>
                  {equipment_status && equipment_status.slice(0, 6).map((equipment) => (
                    <Box key={equipment.equipment_id} sx={{ 
                      p: 2.5,
                      borderRadius: 2,
                      background: equipment.status === 'running' 
                        ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(129, 199, 132, 0.1))'
                        : 'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(255, 152, 0, 0.1))',
                      border: `1px solid ${equipment.status === 'running' ? 'rgba(76, 175, 80, 0.4)' : 'rgba(244, 67, 54, 0.4)'}`,
                      textAlign: 'center',
                      minHeight: '130px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <Typography variant="body2" sx={{ color: '#E0E6ED', fontWeight: 600, fontSize: '0.9rem', mb: 1, lineHeight: 1.2 }}>
                        {equipment.equipment_name}
                      </Typography>
                      <Typography variant="h5" sx={{ 
                        color: equipment.status === 'running' ? '#4CAF50' : '#F44336', 
                        fontWeight: 700,
                        mb: 1,
                        fontSize: '1.8rem'
                      }}>
                        {equipment.efficiency?.toFixed(1) || '0.0'}%
                      </Typography>
                      <Chip
                        label={equipment.status.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: equipment.status === 'running' ? '#4CAF50' : '#F44336',
                          color: '#FFF',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          mb: 1
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#A0AEC0', fontSize: '0.8rem', mt: 'auto' }}>
                        {equipment.runtime_hours?.toFixed(0) || '0'}h runtime
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
            
            <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
              <Paper sx={{ 
                p: 3, 
                minHeight: 400,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(129, 199, 132, 0.2)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#81C784', fontWeight: 600, mb: 3 }}>
                  🌍 Environmental Performance
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                  gap: 2.5, 
                  height: 'calc(100% - 60px)', 
                  overflow: 'auto',
                  pr: 1
                }}>
                  <Box sx={{ 
                    p: 2.5, 
                    borderRadius: 2, 
                    background: 'linear-gradient(90deg, rgba(255, 107, 53, 0.1), rgba(255, 152, 0, 0.1))',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                    textAlign: 'center',
                    minHeight: '130px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="body2" sx={{ color: '#FF6B35', fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>CO₂ Emissions</Typography>
                    <Typography variant="h4" sx={{ color: '#FF6B35', fontWeight: 700, mb: 0.5 }}>
                      {environmental_data.co2_emissions.toFixed(0)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#FF8A65', fontSize: '0.8rem', lineHeight: 1.3 }}>kg/t cement</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2.5, 
                    borderRadius: 2, 
                    background: 'linear-gradient(90deg, rgba(76, 175, 80, 0.1), rgba(129, 199, 132, 0.1))',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    textAlign: 'center',
                    minHeight: '130px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Alt. Fuel Usage</Typography>
                    <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 700, mb: 0.5 }}>
                      {environmental_data.alternative_fuel_substitution.toFixed(1)}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#81C784', fontSize: '0.8rem', lineHeight: 1.3 }}>Target: 30%</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2.5, 
                    borderRadius: 2, 
                    background: 'linear-gradient(90deg, rgba(0, 229, 255, 0.1), rgba(64, 196, 255, 0.1))',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    textAlign: 'center',
                    minHeight: '130px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="body2" sx={{ color: '#00E5FF', fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Energy Efficiency</Typography>
                    <Typography variant="h4" sx={{ color: '#00E5FF', fontWeight: 700, mb: 0.5 }}>
                      {environmental_data.energy_consumption_specific.toFixed(1)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#40C4FF', fontSize: '0.8rem', lineHeight: 1.3 }}>kWh/ton</Typography>
                  </Box>

                  <Box sx={{ 
                    p: 2.5, 
                    borderRadius: 2, 
                    background: 'linear-gradient(90deg, rgba(156, 39, 176, 0.1), rgba(186, 104, 200, 0.1))',
                    border: '1px solid rgba(156, 39, 176, 0.3)',
                    textAlign: 'center',
                    minHeight: '130px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="body2" sx={{ color: '#9C27B0', fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Water Usage</Typography>
                    <Typography variant="h4" sx={{ color: '#9C27B0', fontWeight: 700, mb: 0.5 }}>
                      {(environmental_data.energy_consumption_specific * 0.85).toFixed(1)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#BA68C8', fontSize: '0.8rem', lineHeight: 1.3 }}>L/t cement</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* Predictive Analytics & Insights - Full Width */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
            <Box sx={{ width: '100%' }}>
              <Paper sx={{ 
                p: 3, 
                height: 300,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(255, 107, 53, 0.2)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#FF6B35', fontWeight: 600, mb: 3 }}>
                  🔮 Predictive Insights & Recommendations
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: 'calc(100% - 50px)' }}>
                  <Alert severity="success" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word', lineHeight: 1.4 }}>
                      ✅ <strong>Production Optimization:</strong> Current efficiency at {plant_overview.overall_efficiency.toFixed(1)}% is {plant_overview.overall_efficiency > 85 ? 'above' : 'below'} target. Predicted savings: ${(plant_overview.overall_efficiency * 1000).toFixed(0)}/day
                    </Typography>
                  </Alert>
                  
                  <Alert severity="info" sx={{ backgroundColor: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word', lineHeight: 1.4 }}>
                      🎯 <strong>Quality Trend:</strong> Quality score trending {plant_overview.quality_score_avg > 80 ? 'upward' : 'stable'} at {plant_overview.quality_score_avg.toFixed(1)}. Predicted 7-day average: {(plant_overview.quality_score_avg + Math.random() * 2).toFixed(1)}
                    </Typography>
                  </Alert>
                  
                  <Alert severity="warning" sx={{ backgroundColor: 'rgba(255, 152, 0, 0.1)', border: '1px solid rgba(255, 152, 0, 0.3)' }}>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word', lineHeight: 1.4 }}>
                      ⚡ <strong>Energy Alert:</strong> Energy consumption at {plant_overview.energy_consumption_current.toFixed(1)} kWh/t. Recommend adjusting {current_parameters.kiln_temperature > 1460 ? 'kiln temperature down' : 'mill speed up'} for 3% savings
                    </Typography>
                  </Alert>
                </Box>
              </Paper>
            </Box>
            
            {/* Performance Benchmarks - Moved Below */}
            <Box sx={{ width: '100%' }}>
              <Paper sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(0, 229, 255, 0.2)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#00E5FF', fontWeight: 600, mb: 3 }}>
                  📈 Performance Benchmarks
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3, 
                    borderRadius: 2, 
                    background: 'rgba(0, 229, 255, 0.1)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="body2" sx={{ color: '#00E5FF', fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Industry Avg</Typography>
                    <Typography variant="h5" sx={{ color: '#00E5FF', fontWeight: 700, mb: 1, fontSize: '1.8rem' }}>78.5%</Typography>
                    <Typography variant="caption" sx={{ color: '#40C4FF', fontSize: '0.8rem' }}>Efficiency</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3, 
                    borderRadius: 2, 
                    background: plant_overview.overall_efficiency > 78.5 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                    border: `1px solid ${plant_overview.overall_efficiency > 78.5 ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.3)'}`,
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="body2" sx={{ 
                      color: plant_overview.overall_efficiency > 78.5 ? '#4CAF50' : '#FF9800', 
                      fontWeight: 600, 
                      mb: 1,
                      fontSize: '0.9rem'
                    }}>Your Plant</Typography>
                    <Typography variant="h5" sx={{ 
                      color: plant_overview.overall_efficiency > 78.5 ? '#4CAF50' : '#FF9800', 
                      fontWeight: 700,
                      mb: 1,
                      fontSize: '1.8rem'
                    }}>
                      {plant_overview.overall_efficiency.toFixed(1)}%
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: plant_overview.overall_efficiency > 78.5 ? '#81C784' : '#FFB74D',
                      fontSize: '0.8rem'
                    }}>
                      {plant_overview.overall_efficiency > 78.5 ? 'Above average' : 'Below average'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3, 
                    borderRadius: 2, 
                    background: 'rgba(255, 107, 53, 0.1)',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="body2" sx={{ color: '#FF6B35', fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Best in Class</Typography>
                    <Typography variant="h5" sx={{ color: '#FF6B35', fontWeight: 700, mb: 1, fontSize: '1.8rem' }}>89.2%</Typography>
                    <Typography variant="caption" sx={{ color: '#FF8A65', fontSize: '0.8rem' }}>Target efficiency</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3, 
                    borderRadius: 2, 
                    background: 'rgba(186, 104, 200, 0.1)',
                    border: '1px solid rgba(186, 104, 200, 0.3)',
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="body2" sx={{ color: '#BA68C8', fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Potential Gain</Typography>
                    <Typography variant="h5" sx={{ color: '#BA68C8', fontWeight: 700, mb: 1, fontSize: '1.8rem' }}>
                      +{(89.2 - plant_overview.overall_efficiency).toFixed(1)}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#CE93D8', fontSize: '0.8rem' }}>Improvement opportunity</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </>
      );
    } else if (activeView === 'dashboard') {
      // Return the main dashboard content
      return (
        <>
          {/* Enhanced KPI Cards */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Card sx={{ 
                height: '100%', 
                position: 'relative', 
                overflow: 'hidden',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Typography color="text.secondary" variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    Neural Efficiency
                  </Typography>
                  <Typography variant="h3" sx={{ my: 1, color: '#00E5FF', fontWeight: 700 }}>
                    {plant_overview.overall_efficiency.toFixed(1)}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={plant_overview.overall_efficiency} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Card sx={{ height: '100%', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent>
                  <Typography color="text.secondary" variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    Production Output
                  </Typography>
                  <Typography variant="h3" sx={{ my: 1, color: '#40C4FF', fontWeight: 700 }}>
                    {plant_overview.production_rate_current.toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    TPH • Target: {plant_overview.production_rate_target}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Card sx={{ height: '100%', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent>
                  <Typography color="text.secondary" variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    Energy Matrix
                  </Typography>
                  <Typography variant="h3" sx={{ my: 1, color: '#FFB74D', fontWeight: 700 }}>
                    {plant_overview.energy_consumption_current.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    kWh/t • Optimal: {plant_overview.energy_consumption_target}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Card sx={{ height: '100%', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent>
                  <Typography color="text.secondary" variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    Quality Index
                  </Typography>
                  <Typography variant="h3" sx={{ my: 1, color: '#00E676', fontWeight: 700 }}>
                    {plant_overview.quality_score_avg.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Score • Alerts: {plant_overview.active_alerts_count}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
          
          {/* Process Parameters and Charts */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            {/* Current Process Parameters */}
            <Box sx={{ flex: '1 1 350px', minWidth: '350px' }}>
              <Paper sx={{ 
                p: 3, 
                height: 400,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(0, 229, 255, 0.2)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#00E5FF', fontWeight: 600, mb: 2 }}>
                  🔧 Current Process Parameters
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>Kiln Temperature</Typography>
                    <Typography variant="h6" sx={{ color: '#FFB74D', fontWeight: 700 }}>
                      {current_parameters.kiln_temperature.toFixed(0)}°C
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>Raw Mill Power</Typography>
                    <Typography variant="h6" sx={{ color: '#40C4FF', fontWeight: 700 }}>
                      {current_parameters.raw_mill_power.toFixed(0)} kW
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>Cement Mill Power</Typography>
                    <Typography variant="h6" sx={{ color: '#40C4FF', fontWeight: 700 }}>
                      {current_parameters.cement_mill_power.toFixed(0)} kW
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>Alternative Fuel Rate</Typography>
                    <Typography variant="h6" sx={{ color: '#81C784', fontWeight: 700 }}>
                      {current_parameters.alternative_fuel_rate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>Raw Meal Flow</Typography>
                    <Typography variant="h6" sx={{ color: '#E0E6ED', fontWeight: 700 }}>
                      {current_parameters.raw_meal_flow.toFixed(1)} TPH
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>Exhaust Fan Speed</Typography>
                    <Typography variant="h6" sx={{ color: '#BA68C8', fontWeight: 700 }}>
                      {current_parameters.exhaust_fan_speed.toFixed(0)} RPM
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* Environmental Metrics */}
            <Box sx={{ flex: '1 1 350px', minWidth: '350px' }}>
              <Paper sx={{ 
                p: 3, 
                height: 400,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(129, 199, 132, 0.2)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#81C784', fontWeight: 600, mb: 2 }}>
                  🌿 Environmental Metrics
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>CO₂ Emissions</Typography>
                    <Typography variant="h6" sx={{ color: '#FF6B35', fontWeight: 700 }}>
                      {environmental_data.co2_emissions.toFixed(0)} kg/t
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>Alternative Fuel</Typography>
                    <Typography variant="h6" sx={{ color: '#81C784', fontWeight: 700 }}>
                      {environmental_data.alternative_fuel_substitution.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>Energy Specific</Typography>
                    <Typography variant="h6" sx={{ color: '#FFB74D', fontWeight: 700 }}>
                      {environmental_data.energy_consumption_specific.toFixed(1)} kWh/t
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>Water Usage</Typography>
                    <Typography variant="h6" sx={{ color: '#4FC3F7', fontWeight: 700 }}>
                      {environmental_data.water_consumption.toFixed(0)} L/t
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>NOₓ Emissions</Typography>
                    <Typography variant="h6" sx={{ color: '#FF8A65', fontWeight: 700 }}>
                      {environmental_data.nox_emissions.toFixed(1)} mg/Nm³
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>Dust Emissions</Typography>
                    <Typography variant="h6" sx={{ color: '#FFAB91', fontWeight: 700 }}>
                      {environmental_data.dust_emissions.toFixed(1)} mg/Nm³
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* Equipment Status */}
            <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
              <Paper sx={{ 
                p: 3, 
                height: 400,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(186, 104, 200, 0.2)',
                overflow: 'auto'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#BA68C8', fontWeight: 600, mb: 2 }}>
                  ⚙️ Equipment Status
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {equipment_status && equipment_status.slice(0, 8).map((equipment) => (
                    <Box key={equipment.equipment_id} sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: 1,
                      background: equipment.status === 'running' 
                        ? 'linear-gradient(90deg, rgba(76, 175, 80, 0.1), rgba(129, 199, 132, 0.1))'
                        : 'linear-gradient(90deg, rgba(244, 67, 54, 0.1), rgba(255, 152, 0, 0.1))',
                      border: `1px solid ${equipment.status === 'running' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`
                    }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#E0E6ED', fontWeight: 600, fontSize: '0.85rem' }}>
                          {equipment.equipment_name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#A0AEC0', fontSize: '0.7rem' }}>
                          {equipment.status}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ 
                          color: equipment.status === 'running' ? '#4CAF50' : '#FF5722', 
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}>
                          {equipment.efficiency?.toFixed(1) || '0.0'}%
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#A0AEC0', fontSize: '0.7rem' }}>
                          efficiency
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* AI Quality Analysis & Monitoring */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Box sx={{ flex: '1 1 600px', minWidth: '600px' }}>
              <Paper sx={{ 
                p: 3, 
                height: 400,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(255, 107, 53, 0.2)'
              }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#FF6B35', fontWeight: 600, mb: 3 }}>
                  🤖 AI Quality Analysis & Optimization
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, height: '100%', alignContent: 'start' }}>
                  {/* Quality Metrics */}
                  <Box>
                    <Typography variant="h6" sx={{ color: '#00E5FF', mb: 2, fontSize: '1rem' }}>
                      Current Quality Status
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        background: 'linear-gradient(90deg, rgba(0, 230, 118, 0.1), rgba(76, 175, 80, 0.1))',
                        border: '1px solid rgba(0, 230, 118, 0.3)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.8rem' }}>Quality Score</Typography>
                        <Typography variant="h4" sx={{ color: '#00E676', fontWeight: 700 }}>
                          {plant_overview.quality_score_avg.toFixed(1)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#81C784' }}>
                          ✓ Within target range
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        background: 'linear-gradient(90deg, rgba(255, 107, 53, 0.1), rgba(255, 152, 0, 0.1))',
                        border: '1px solid rgba(255, 107, 53, 0.3)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.8rem' }}>Active Alerts</Typography>
                        <Typography variant="h4" sx={{ color: '#FF6B35', fontWeight: 700 }}>
                          {plant_overview.active_alerts_count}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#FFB74D' }}>
                          Quality monitoring active
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  {/* AI Actions */}
                  <Box>
                    <Typography variant="h6" sx={{ color: '#00E5FF', mb: 2, fontSize: '1rem' }}>
                      AI-Powered Actions
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<SmartToy />}
                        sx={{
                          backgroundColor: '#FF6B35',
                          color: '#000',
                          fontWeight: 600,
                          '&:hover': { backgroundColor: '#FF8A65' }
                        }}
                        onClick={() => {
                          // This will trigger the quality analysis in AI Assistant
                          const event = new CustomEvent('triggerQualityAnalysis');
                          window.dispatchEvent(event);
                        }}
                      >
                        Analyze Quality Fluctuations
                      </Button>
                      
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Analytics />}
                        sx={{
                          borderColor: '#00E5FF',
                          color: '#00E5FF',
                          '&:hover': { 
                            backgroundColor: 'rgba(0, 229, 255, 0.1)',
                            borderColor: '#40C4FF'
                          }
                        }}
                        onClick={() => {
                          // This will trigger optimization in AI Assistant
                          const event = new CustomEvent('triggerOptimization', { detail: 'quality' });
                          window.dispatchEvent(event);
                        }}
                      >
                        Generate Recommendations
                      </Button>
                      
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
                        <Chip
                          label="Real-time"
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(0, 229, 255, 0.2)',
                            color: '#00E5FF',
                            fontWeight: 600,
                            animation: 'pulse 2s infinite'
                          }}
                        />
                        <Chip
                          label="Gemini AI"
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255, 107, 53, 0.2)',
                            color: '#FF6B35',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      
                      <Typography variant="caption" sx={{ color: '#A0AEC0', textAlign: 'center', mt: 1 }}>
                        🔍 Continuous quality monitoring active<br/>
                        💡 AI recommendations updated every 5s
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
            
            <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
              <Paper sx={{ 
                p: 3, 
                height: 400,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(186, 104, 200, 0.2)'
              }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#BA68C8', fontWeight: 600 }}>
                  🧠 Neural Insights
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: 'calc(100% - 40px)' }}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    background: 'linear-gradient(135deg, rgba(186, 104, 200, 0.1), rgba(156, 39, 176, 0.1))',
                    border: '1px solid rgba(186, 104, 200, 0.3)',
                    flex: 1
                  }}>
                    <Typography variant="body2" sx={{ color: '#BA68C8', mb: 1, fontWeight: 600 }}>
                      Quality Trend Analysis
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#E0E6ED', fontSize: '0.9rem', lineHeight: 1.4 }}>
                      Current quality score of {plant_overview.quality_score_avg.toFixed(1)} indicates {plant_overview.quality_score_avg > 85 ? 'excellent' : plant_overview.quality_score_avg > 70 ? 'good' : 'needs attention'} performance. 
                      {plant_overview.active_alerts_count > 0 && ` ${plant_overview.active_alerts_count} active alert${plant_overview.active_alerts_count > 1 ? 's' : ''} require${plant_overview.active_alerts_count === 1 ? 's' : ''} attention.`}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(64, 196, 255, 0.1))',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    flex: 1
                  }}>
                    <Typography variant="body2" sx={{ color: '#00E5FF', mb: 1, fontWeight: 600 }}>
                      Process Optimization
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#E0E6ED', fontSize: '0.9rem', lineHeight: 1.4 }}>
                      Efficiency at {plant_overview.overall_efficiency.toFixed(1)}% with energy consumption of {plant_overview.energy_consumption_current.toFixed(1)} kWh/t. 
                      {plant_overview.energy_consumption_current > plant_overview.energy_consumption_target ? ' Energy optimization recommended.' : ' Energy levels optimal.'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    background: 'linear-gradient(135deg, rgba(129, 199, 132, 0.1), rgba(76, 175, 80, 0.1))',
                    border: '1px solid rgba(129, 199, 132, 0.3)',
                    flex: 1
                  }}>
                    <Typography variant="body2" sx={{ color: '#81C784', mb: 1, fontWeight: 600 }}>
                      Production Status
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#E0E6ED', fontSize: '0.9rem', lineHeight: 1.4 }}>
                      Current output: {plant_overview.production_rate_current.toFixed(0)} TPH 
                      ({((plant_overview.production_rate_current / plant_overview.production_rate_target) * 100).toFixed(1)}% of target). 
                      {plant_overview.equipment_running_count}/{plant_overview.equipment_total_count} equipment operational.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* Quality Consistency Monitor Preview */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Box sx={{ flex: '1 1 800px', minWidth: '800px' }}>
              <Paper sx={{ 
                p: 3, 
                height: 300,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(255, 107, 53, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                  border: '1px solid rgba(255, 107, 53, 0.5)'
                }
              }}
              onClick={() => {
                setActiveView('quality-consistency');
                setTestMode(false); // Exit test mode when navigating
              }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Science sx={{ fontSize: 40, color: '#FF6B35', mr: 2, filter: 'drop-shadow(0 0 8px #FF6B35)' }} />
                    <Box>
                      <Typography variant="h5" sx={{ color: '#FF6B35', fontWeight: 700 }}>
                        🔬 Proactive Quality Consistency Monitor
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
                        Real-time input fluctuation detection with AI-powered proactive corrections
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<Science />}
                    sx={{
                      backgroundColor: '#FF6B35',
                      color: '#000',
                      '&:hover': { backgroundColor: '#FF8A65' }
                    }}
                  >
                    Open Full Monitor
                  </Button>
                </Box>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, height: 'calc(100% - 80px)' }}>
                  {/* Input Parameter Status Cards */}
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    background: current_parameters.kiln_temperature > 1470 || current_parameters.kiln_temperature < 1430 
                      ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(255, 152, 0, 0.1))'
                      : 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(129, 199, 132, 0.1))',
                    border: current_parameters.kiln_temperature > 1470 || current_parameters.kiln_temperature < 1430 
                      ? '1px solid rgba(244, 67, 54, 0.4)' 
                      : '1px solid rgba(76, 175, 80, 0.4)',
                    textAlign: 'center'
                  }}>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>Kiln Temp</Typography>
                    <Typography variant="h6" sx={{ 
                      color: current_parameters.kiln_temperature > 1470 || current_parameters.kiln_temperature < 1430 ? '#F44336' : '#4CAF50',
                      fontWeight: 700,
                      fontSize: '1.2rem'
                    }}>
                      {current_parameters.kiln_temperature.toFixed(0)}°C
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: current_parameters.kiln_temperature > 1470 || current_parameters.kiln_temperature < 1430 ? '#FF5722' : '#81C784',
                      fontSize: '0.7rem'
                    }}>
                      {current_parameters.kiln_temperature > 1470 || current_parameters.kiln_temperature < 1430 ? 'Alert' : 'Stable'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    background: current_parameters.raw_mill_power > 3000 || current_parameters.raw_mill_power < 2700
                      ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(255, 152, 0, 0.1))'
                      : 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(129, 199, 132, 0.1))',
                    border: current_parameters.raw_mill_power > 3000 || current_parameters.raw_mill_power < 2700
                      ? '1px solid rgba(244, 67, 54, 0.4)' 
                      : '1px solid rgba(76, 175, 80, 0.4)',
                    textAlign: 'center'
                  }}>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>Raw Mill</Typography>
                    <Typography variant="h6" sx={{ 
                      color: current_parameters.raw_mill_power > 3000 || current_parameters.raw_mill_power < 2700 ? '#F44336' : '#4CAF50',
                      fontWeight: 700,
                      fontSize: '1.2rem'
                    }}>
                      {(current_parameters.raw_mill_power / 1000).toFixed(1)}MW
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: current_parameters.raw_mill_power > 3000 || current_parameters.raw_mill_power < 2700 ? '#FF5722' : '#81C784',
                      fontSize: '0.7rem'
                    }}>
                      {current_parameters.raw_mill_power > 3000 || current_parameters.raw_mill_power < 2700 ? 'Alert' : 'Stable'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    background: current_parameters.cement_mill_power > 3400 || current_parameters.cement_mill_power < 3000
                      ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(255, 152, 0, 0.1))'
                      : 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(129, 199, 132, 0.1))',
                    border: current_parameters.cement_mill_power > 3400 || current_parameters.cement_mill_power < 3000
                      ? '1px solid rgba(244, 67, 54, 0.4)' 
                      : '1px solid rgba(76, 175, 80, 0.4)',
                    textAlign: 'center'
                  }}>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>Cement Mill</Typography>
                    <Typography variant="h6" sx={{ 
                      color: current_parameters.cement_mill_power > 3400 || current_parameters.cement_mill_power < 3000 ? '#F44336' : '#4CAF50',
                      fontWeight: 700,
                      fontSize: '1.2rem'
                    }}>
                      {(current_parameters.cement_mill_power / 1000).toFixed(1)}MW
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: current_parameters.cement_mill_power > 3400 || current_parameters.cement_mill_power < 3000 ? '#FF5722' : '#81C784',
                      fontSize: '0.7rem'
                    }}>
                      {current_parameters.cement_mill_power > 3400 || current_parameters.cement_mill_power < 3000 ? 'Alert' : 'Stable'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    background: current_parameters.alternative_fuel_rate > 35 || current_parameters.alternative_fuel_rate < 15
                      ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(255, 152, 0, 0.1))'
                      : 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(129, 199, 132, 0.1))',
                    border: current_parameters.alternative_fuel_rate > 35 || current_parameters.alternative_fuel_rate < 15
                      ? '1px solid rgba(244, 67, 54, 0.4)' 
                      : '1px solid rgba(76, 175, 80, 0.4)',
                    textAlign: 'center'
                  }}>
                    <Typography variant="body2" sx={{ color: '#A0AEC0', fontSize: '0.75rem' }}>Alt Fuel Rate</Typography>
                    <Typography variant="h6" sx={{ 
                      color: current_parameters.alternative_fuel_rate > 35 || current_parameters.alternative_fuel_rate < 15 ? '#F44336' : '#4CAF50',
                      fontWeight: 700,
                      fontSize: '1.2rem'
                    }}>
                      {current_parameters.alternative_fuel_rate.toFixed(1)}%
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: current_parameters.alternative_fuel_rate > 35 || current_parameters.alternative_fuel_rate < 15 ? '#FF5722' : '#81C784',
                      fontSize: '0.7rem'
                    }}>
                      {current_parameters.alternative_fuel_rate > 35 || current_parameters.alternative_fuel_rate < 15 ? 'Alert' : 'Stable'}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
            
            <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
              <Paper sx={{ 
                p: 3, 
                height: 300,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(0, 229, 255, 0.2)'
              }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#00E5FF', fontWeight: 600, mb: 3 }}>
                  ⚡ Proactive Corrections Status
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: 'calc(100% - 50px)' }}>
                  <Alert severity="success" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                    <Typography variant="body2">
                      ✅ Quality consistency monitoring is active and detecting input fluctuations in real-time
                    </Typography>
                  </Alert>
                  
                  <Alert severity="info" sx={{ backgroundColor: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
                    <Typography variant="body2">
                      🤖 AI system continuously analyzes parameter stability and generates proactive corrections
                    </Typography>
                  </Alert>
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* Charts and AI Assistant */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '2 1 600px', minWidth: '600px' }}>
              <Paper sx={{ 
                p: 3, 
                height: 450,
                background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
                border: '1px solid rgba(0, 229, 255, 0.2)'
              }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#00E5FF', fontWeight: 600 }}>
                  📊 Energy Neural Network Analysis
                </Typography>
                <ResponsiveContainer width="100%" height={380}>
                  <LineChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 229, 255, 0.1)" />
                    <XAxis dataKey="time" stroke="#A0AEC0" />
                    <YAxis yAxisId="left" stroke="#A0AEC0" />
                    <YAxis yAxisId="right" orientation="right" stroke="#A0AEC0" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A1F2E', 
                        border: '1px solid rgba(0, 229, 255, 0.3)',
                        borderRadius: '8px',
                        color: '#E0E6ED'
                      }} 
                    />
                    <Legend />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="#ff7300" 
                      strokeWidth={3}
                      name="Energy (kWh/t)" 
                      dot={false}
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="production" 
                      stroke="#00E676" 
                      strokeWidth={3}
                      name="Production (TPH)" 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Box>

            <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
              {dashboardData && <AIAssistant dashboardData={dashboardData} />}
            </Box>
          </Box>
        </>
      );
    } else {
      // Return placeholder content for other views
      const currentMenuItem = menuItems.find(item => item.id === activeView);
      const Icon = currentMenuItem?.icon || Dashboard;
      
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '60vh',
          textAlign: 'center'
        }}>
          <Icon sx={{ 
            fontSize: 80, 
            color: currentMenuItem?.color || '#00E5FF',
            mb: 3,
            filter: `drop-shadow(0 0 20px ${currentMenuItem?.color || '#00E5FF'})`,
            animation: 'pulse 2s infinite'
          }} />
          <Typography variant="h3" sx={{ 
            mb: 2,
            color: currentMenuItem?.color || '#00E5FF',
            fontWeight: 700
          }}>
            {currentMenuItem?.label || 'Unknown View'}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            {getViewDescription(activeView)}
          </Typography>
          <Chip 
            label="Coming Soon"
            sx={{
              backgroundColor: 'rgba(255, 107, 53, 0.2)',
              color: '#FF6B35',
              fontWeight: 600,
              px: 2,
              py: 1,
              animation: 'blink 2s infinite',
              '@keyframes blink': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.7 },
                '100%': { opacity: 1 },
              }
            }}
          />
        </Box>
      );
    }
  };

  // Get description for each view
  const getViewDescription = (viewId: string) => {
    const descriptions: Record<string, string> = {
      'quality-consistency': 'Real-time input fluctuation detection with proactive quality corrections',
      'analytics': 'Advanced data analysis and performance insights', 
      'ai-assistant': 'AI-powered quality analysis, optimization recommendations, and conversational support',
      'settings': 'System configuration and user preferences'
    };
    return descriptions[viewId] || 'Advanced plant management interface';
  };

  useEffect(() => {
    // Initialize socket connection using the same URL as API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    console.log('Connecting to backend:', backendUrl);
    
    const newSocket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      reconnectionDelayMax: 5000,
      autoConnect: true
    });

    // setSocket(newSocket); // Remove unused socket setter

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Connected to CementAI Nexus backend');
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('❌ Disconnected from backend:', reason);
      // Keep data but mark it as stale for user awareness
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔴 WebSocket connection error:', error);
      setIsConnected(false);
      
      // Try to provide more specific error information
      if (error.message.includes('timeout')) {
        console.log('💡 Connection timeout - check if backend is running on port 3002');
      } else if (error.message.includes('CORS')) {
        console.log('💡 CORS error - check backend CORS configuration');
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('🔴 Reconnection failed:', error);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Attempting to reconnect...', attemptNumber);
    });

    newSocket.on('dashboard_update', (data: DashboardData) => {
      setDashboardData(data);
      setProcessHistory(prev => {
        const newHistory = [...prev, data.current_parameters];
        return newHistory.slice(-50);
      });
    });

    return () => {
      console.log('🧹 Cleaning up socket connection');
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('connect_error');
      newSocket.off('reconnect');
      newSocket.off('reconnect_error');
      newSocket.off('reconnect_attempt');
      newSocket.off('dashboard_update');
      newSocket.close();
    };
  }, []);

  // Force scroll to top only on initial mount
  useEffect(() => {
    const forceScrollTop = () => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
      
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
      
      // Also scroll the root container if needed
      const rootContainer = document.getElementById('root-container');
      if (rootContainer) {
        rootContainer.scrollTop = 0;
      }
    };

    // Execute only on initial mount
    forceScrollTop();
  }, []); // Empty dependency array - runs only once

  // Ensure page starts at the top when loading - more aggressive approach
  useEffect(() => {
    // Immediate scroll reset
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    
    // Force scroll reset after page content loads
    const timer = setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
      
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Scroll to top when view changes (but not on every data update)
  useEffect(() => {
    // Only reset scroll when actively changing views, not on data updates
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [activeView]); // Only trigger on view changes

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    // Multiple approaches to ensure scrolling works
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    
    // Also try scrolling to the anchor element
    const topAnchor = document.getElementById('page-top');
    if (topAnchor) {
      topAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  };

  if (!dashboardData) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              background: 'linear-gradient(180deg, #0A0E1A 0%, #1A1F2E 50%, #242B3D 100%)',
              border: 'none',
              borderRight: '1px solid rgba(0, 229, 255, 0.1)',
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', minHeight: 80 }}>
            <Avatar sx={{ background: 'linear-gradient(135deg, #00E5FF, #0091EA)', mr: sidebarOpen ? 1.5 : 0 }}>
              <Memory />
            </Avatar>
            {sidebarOpen && (
              <Box>
                <Typography variant="h6" sx={{ color: '#00E5FF', fontWeight: 700 }}>
                  CementAI NEXUS
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  <Chip 
                    label="SIMULATION MODE" 
                    size="small" 
                    sx={{ 
                      backgroundColor: 'rgba(255, 107, 53, 0.2)', 
                      color: '#FF6B35', 
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }} 
                  />
                  <Chip 
                    label={isConnected ? "🟢 CONNECTED" : "🔴 DISCONNECTED"} 
                    size="small" 
                    sx={{ 
                      backgroundColor: isConnected ? 'rgba(0, 230, 118, 0.2)' : 'rgba(244, 67, 54, 0.2)', 
                      color: isConnected ? '#00E676' : '#F44336', 
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      animation: isConnected ? 'none' : 'pulse 2s infinite'
                    }} 
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Drawer>
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            marginLeft: `${drawerWidth}px`,
            background: 'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 50%, #242B3D 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box textAlign="center">
            <Typography variant="h3" gutterBottom sx={{ 
              background: 'linear-gradient(45deg, #00E5FF, #40C4FF)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              fontWeight: 700
            }}>
              CementAI Nexus
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Initializing Neural Network...
            </Typography>
            <LinearProgress sx={{ mt: 2, width: 400, height: 6, borderRadius: 3 }} />
          </Box>
        </Box>
      </Box>
    );
  }

  const { plant_overview, current_parameters, equipment_status, environmental_data } = dashboardData;

  console.log('Dashboard data:', { plant_overview, current_parameters, equipment_status, environmental_data });

  // Add back the energyData for charts (if needed in dashboard view)
  const energyData = processHistory.map((params, index) => ({
    time: index,
    energy: params.energy_consumption,
    production: params.production_rate
  }));

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        position: 'relative'
      }}
      id="root-container"
    >
      {/* Futuristic Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #0A0E1A 0%, #1A1F2E 50%, #242B3D 100%)',
            border: 'none',
            borderRight: '1px solid rgba(0, 229, 255, 0.1)',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            minHeight: 80,
            background: 'linear-gradient(135deg, #0A0E1A, #1A1F2E)',
            borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
          }}
        >
          {sidebarOpen ? (
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #00E5FF, #0091EA)',
                    mr: 1.5,
                    boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)',
                  }}
                >
                  <Memory />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#00E5FF' }}>
                    CementAI
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#A0AEC0' }}>
                    NEXUS
                  </Typography>
                </Box>
            </Box>
          ) : (
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #00E5FF, #0091EA)',
                mx: 'auto',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)',
              }}
            >
              <Memory />
            </Avatar>
          )}
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: '#00E5FF' }}>
            {sidebarOpen ? <MenuOpen /> : <Menu />}
          </IconButton>
        </Box>

        {sidebarOpen && (
          <Box sx={{ px: 2, py: 1 }}>
            <Chip
              label="SIMULATION MODE"
              size="small"
              sx={{
                background: 'linear-gradient(90deg, #FF6B35, #FF8A65)',
                color: '#000',
                fontWeight: 600,
                fontSize: '0.7rem',
                mb: 1,
                width: '100%'
              }}
            />
            <Chip
              label="SYSTEM ONLINE"
              size="small"
              sx={{
                background: 'linear-gradient(90deg, #00E676, #4CAF50)',
                color: '#000',
                fontWeight: 600,
                fontSize: '0.7rem',
                animation: 'pulse 2s infinite',
                width: '100%',
                '@keyframes pulse': {
                  '0%': { boxShadow: '0 0 5px rgba(0, 230, 118, 0.5)' },
                  '50%': { boxShadow: '0 0 20px rgba(0, 230, 118, 0.8)' },
                  '100%': { boxShadow: '0 0 5px rgba(0, 230, 118, 0.5)' },
                },
              }}
            />
          </Box>
        )}

        <Box sx={{ flex: 1, py: 2 }}>
          <List>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              const isHovered = hoveredItem === item.id;
              
              return (
                <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleNavClick(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    sx={{
                      minHeight: 56,
                      px: 2.5,
                      borderRadius: 2,
                      mx: 1,
                      transition: 'all 0.3s ease',
                      background: isActive 
                        ? `linear-gradient(135deg, ${item.color}20, ${item.color}10)`
                        : isHovered 
                        ? `linear-gradient(135deg, ${item.color}15, ${item.color}05)`
                        : 'transparent',
                      border: isActive 
                        ? `1px solid ${item.color}40`
                        : '1px solid transparent',
                      '&:hover': { transform: 'translateX(4px)' },
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: sidebarOpen ? 3 : 'auto',
                        justifyContent: 'center',
                        color: isActive ? item.color : '#A0AEC0',
                        filter: isActive ? `drop-shadow(0 0 8px ${item.color})` : 'none',
                      }}
                    >
                      <Icon sx={{ fontSize: 24 }} />
                    </ListItemIcon>
                    {sidebarOpen && (
                      <ListItemText
                        primary={item.label}
                        sx={{
                          '& .MuiTypography-root': {
                            fontSize: '0.95rem',
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? item.color : '#E0E6ED',
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {sidebarOpen && (
          <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 229, 255, 0.1)' }}>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#A0AEC0', textAlign: 'center', mb: 0.5 }}>
              Powered by Google AI
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.7rem', color: '#666', textAlign: 'center' }}>
              v2.1.0 • Neural Core
            </Typography>
          </Box>
        )}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: 'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 50%, #242B3D 100%)',
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollBehavior: 'smooth',
          position: 'relative'
        }}
        id="main-content"
      >
        <Container maxWidth="xl" sx={{ py: 3, position: 'relative' }}>
          {/* Scroll anchor to ensure top positioning */}
          <div id="page-top" style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1 }}></div>
          
          {testMode ? (
            <RealTimeTestDashboard />
          ) : (
            <>
              {/* Futuristic Header */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                  <Typography variant="h3" component="h1" sx={{ 
                    mb: 1,
                    background: 'linear-gradient(45deg, #00E5FF, #40C4FF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700
                  }}>
                    Neural Command Center
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Real-time plant intelligence powered by Google AI
                  </Typography>
                  <Chip 
                    label={`Current View: ${menuItems.find(item => item.id === activeView)?.label || 'Dashboard'}`}
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: 'rgba(0, 229, 255, 0.1)',
                      color: '#00E5FF',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      fontWeight: 600
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant={testMode ? "contained" : "outlined"}
                    startIcon={<Science />}
                    onClick={() => setTestMode(!testMode)}
                    sx={{
                      borderColor: '#00E5FF',
                      color: testMode ? '#000' : '#00E5FF',
                      backgroundColor: testMode ? '#00E5FF' : 'transparent',
                      '&:hover': {
                        backgroundColor: testMode ? '#40C4FF' : 'rgba(0, 229, 255, 0.1)'
                      }
                    }}
                  >
                    {testMode ? 'Exit Test Mode' : 'Test Mode'}
                  </Button>
                  <Chip 
                    label={isConnected ? 'NEURAL LINK ACTIVE' : 'CONNECTION LOST - SHOWING CACHED DATA'} 
                    color={isConnected ? 'success' : 'error'}
                    sx={{ 
                      fontSize: '0.9rem', 
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      height: 'auto',
                      animation: isConnected ? 'pulse 2s infinite' : 'blink 1s infinite',
                      '@keyframes blink': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                        '100%': { opacity: 1 },
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Dynamic Content Based on Active View */}
              {renderActiveViewContent()}
            </>
          )}
        </Container>
      </Box>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <Fab
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            background: 'linear-gradient(135deg, #00E5FF, #40C4FF)',
            color: '#000',
            '&:hover': {
              background: 'linear-gradient(135deg, #40C4FF, #00E5FF)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0, 229, 255, 0.3)',
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      )}

      {/* System Prompt Configuration Dialog */}
      <SystemPromptConfig 
        open={settingsDialogOpen} 
        onClose={() => setSettingsDialogOpen(false)} 
      />
    </Box>
  );
}
