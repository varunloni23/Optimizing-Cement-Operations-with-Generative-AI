'use client'

import { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { DashboardData } from '../types/models';
import { API_BASE_URL } from '../config/api';

interface ReportGeneratorProps {
  dashboardData?: DashboardData;
}

type ReportType = 'summary' | 'quality' | 'production' | 'environmental' | 'equipment' | 'comprehensive';

interface ReportConfig {
  type: ReportType;
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
}

export default function ReportGenerator({ dashboardData }: ReportGeneratorProps) {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportContent, setReportContent] = useState<React.ReactElement | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const reportConfigs: Record<ReportType, ReportConfig> = {
    summary: {
      type: 'summary',
      title: 'Daily Summary Report',
      description: 'Key metrics and performance overview',
      icon: <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>📊</span>,
      color: '#00E5FF'
    },
    quality: {
      type: 'quality',
      title: 'Quality Analysis Report',
      description: 'Quality metrics and consistency analysis',
      icon: <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>📈</span>,
      color: '#00E676'
    },
    production: {
      type: 'production',
      title: 'Production Performance Report',
      description: 'Production rates and efficiency metrics',
      icon: <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>🏭</span>,
      color: '#FFB74D'
    },
    environmental: {
      type: 'environmental',
      title: 'Environmental Impact Report',
      description: 'Emissions and environmental compliance',
      icon: <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>🌱</span>,
      color: '#81C784'
    },
    equipment: {
      type: 'equipment',
      title: 'Equipment Status Report',
      description: 'Equipment health and maintenance status',
      icon: <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>⚙️</span>,
      color: '#FF8A65'
    },
    comprehensive: {
      type: 'comprehensive',
      title: 'Comprehensive Plant Report',
      description: 'Complete plant analysis with all metrics',
      icon: <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>📄</span>,
      color: '#CE93D8'
    }
  };

  // Generate insights and analytics
  const generateInsights = () => {
    if (!dashboardData) return [];
    
    const insights = [];
    const { plant_overview, current_parameters, equipment_status, environmental_data } = dashboardData;
    
    // Efficiency insights
    if (plant_overview.overall_efficiency < 75) {
      insights.push({
        type: 'warning',
        title: 'Efficiency Alert',
        message: `Plant efficiency is ${plant_overview.overall_efficiency.toFixed(1)}%, below optimal range (85%+)`,
        recommendation: 'Review equipment performance and process parameters'
      });
    }
    
    // Production insights
    const productionAchievement = (plant_overview.production_rate_current / plant_overview.production_rate_target) * 100;
    if (productionAchievement < 90) {
      insights.push({
        type: 'info',
        title: 'Production Gap',
        message: `Production is ${productionAchievement.toFixed(1)}% of target`,
        recommendation: 'Analyze bottlenecks in production line'
      });
    }
    
    // Energy insights
    if (current_parameters.energy_consumption > 100) {
      insights.push({
        type: 'warning',
        title: 'High Energy Consumption',
        message: `Energy consumption is ${current_parameters.energy_consumption.toFixed(1)} kWh/t`,
        recommendation: 'Optimize kiln and mill operations for energy efficiency'
      });
    }
    
    // Equipment insights
    const lowEfficiencyEquipment = equipment_status.filter(eq => eq.efficiency < 80);
    if (lowEfficiencyEquipment.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Equipment Performance',
        message: `${lowEfficiencyEquipment.length} equipment(s) operating below 80% efficiency`,
        recommendation: 'Schedule maintenance for underperforming equipment'
      });
    }
    
    return insights;
  };

  // Generate chart data
  const generateChartData = () => {
    if (!dashboardData) return {};
    
    const { plant_overview, current_parameters, equipment_status, environmental_data, recent_quality } = dashboardData;
    
    // Equipment efficiency data
    const equipmentData = equipment_status.map(eq => ({
      name: eq.equipment_name.replace(/[_-]/g, ' '),
      efficiency: eq.efficiency,
      temperature: eq.temperature,
      power: eq.power_consumption,
      status: eq.status
    }));
    
    // Process parameters trend (simulated)
    const processData = [
      { time: '00:00', kiln_temp: current_parameters.kiln_temperature - 15, production: plant_overview.production_rate_current - 20 },
      { time: '04:00', kiln_temp: current_parameters.kiln_temperature - 8, production: plant_overview.production_rate_current - 10 },
      { time: '08:00', kiln_temp: current_parameters.kiln_temperature - 3, production: plant_overview.production_rate_current - 5 },
      { time: '12:00', kiln_temp: current_parameters.kiln_temperature, production: plant_overview.production_rate_current },
      { time: '16:00', kiln_temp: current_parameters.kiln_temperature + 5, production: plant_overview.production_rate_current + 8 },
      { time: '20:00', kiln_temp: current_parameters.kiln_temperature - 2, production: plant_overview.production_rate_current + 3 }
    ];
    
    // Environmental data - Enhanced with dust metrics
    const envData = [
      { name: 'CO2', value: environmental_data.co2_emissions, unit: 'kg/t', limit: 800, status: environmental_data.co2_emissions < 800 ? 'Good' : 'High' },
      { name: 'NOx', value: environmental_data.nox_emissions, unit: 'mg/Nm³', limit: 500, status: environmental_data.nox_emissions < 500 ? 'Good' : 'High' },
      { name: 'SO2', value: environmental_data.so2_emissions, unit: 'mg/Nm³', limit: 50, status: environmental_data.so2_emissions < 50 ? 'Good' : 'High' },
      { name: 'Dust', value: environmental_data.dust_emissions, unit: 'mg/Nm³', limit: 20, status: environmental_data.dust_emissions < 20 ? 'Good' : 'High' },
      { name: 'PM10', value: environmental_data.dust_emissions * 0.8, unit: 'mg/Nm³', limit: 15, status: (environmental_data.dust_emissions * 0.8) < 15 ? 'Good' : 'High' },
      { name: 'PM2.5', value: environmental_data.dust_emissions * 0.3, unit: 'mg/Nm³', limit: 8, status: (environmental_data.dust_emissions * 0.3) < 8 ? 'Good' : 'High' }
    ];
    
    // Quality composition data
    const qualityData = recent_quality[0] ? [
      { name: 'C3S', value: recent_quality[0].chemical_composition.c3s },
      { name: 'C2S', value: recent_quality[0].chemical_composition.c2s },
      { name: 'C3A', value: recent_quality[0].chemical_composition.c3a },
      { name: 'C4AF', value: recent_quality[0].chemical_composition.c4af },
      { name: 'SO3', value: recent_quality[0].chemical_composition.so3 }
    ] : [];
    
    return { equipmentData, processData, envData, qualityData };
  };

  const generateVisualReport = (type: ReportType): React.ReactElement => {
    if (!dashboardData) {
      return <Typography>No data available for report generation.</Typography>;
    }

    const currentTime = new Date().toLocaleString();
    const { plant_overview, current_parameters, recent_quality, equipment_status, environmental_data, ai_recommendations } = dashboardData;
    const insights = generateInsights();
    const chartData = generateChartData();
    const colors = ['#00E5FF', '#00E676', '#FFB74D', '#FF8A65', '#CE93D8', '#81C784'];

    return (
      <Box sx={{ p: 3, color: '#FFFFFF' }}>
        {/* Report Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ color: '#00E5FF', fontWeight: 700, mb: 1 }}>
            CementAI Nexus - {reportConfigs[type].title}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Generated on: {currentTime}
          </Typography>
          <Chip 
            label={plant_overview.overall_efficiency > 85 ? 'Excellent Performance' : plant_overview.overall_efficiency > 70 ? 'Good Performance' : 'Needs Attention'} 
            color={plant_overview.overall_efficiency > 85 ? 'success' : plant_overview.overall_efficiency > 70 ? 'warning' : 'error'}
            sx={{ mt: 1, fontWeight: 600 }}
          />
        </Box>

        {/* Key Insights Section */}
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1A1F2E, #242B3D)' }}>
          <Typography variant="h5" sx={{ color: '#00E5FF', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>💡</span> Key Insights & Recommendations
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {insights.map((insight, index) => (
              <Box 
                key={index} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  border: '1px solid',
                  borderColor: insight.type === 'warning' ? '#ff9800' : insight.type === 'error' ? '#f44336' : '#2196f3',
                  backgroundColor: insight.type === 'warning' ? 'rgba(255, 152, 0, 0.1)' : insight.type === 'error' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(33, 150, 243, 0.1)',
                  '& .MuiAlert-message': { color: '#FFFFFF' }
                }}
              >
                <Typography variant="h6" sx={{ color: insight.type === 'warning' ? '#ff9800' : insight.type === 'error' ? '#f44336' : '#2196f3', mb: 1 }}>
                  {insight.type === 'warning' ? '⚠️' : insight.type === 'error' ? '❌' : 'ℹ️'} {insight.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">{insight.message}</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1, color: 'text.secondary' }}>
                  💡 Recommendation: {insight.recommendation}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {type === 'summary' && (
          <>
            {/* Executive Dashboard */}
            <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1A1F2E, #242B3D)' }}>
              <Typography variant="h5" sx={{ color: '#00E5FF', mb: 3 }}>Executive Dashboard</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Card sx={{ flex: 1, minWidth: 200, background: 'rgba(0, 229, 255, 0.1)' }}>
                  <CardContent>
                    <Typography color="text.secondary">Overall Efficiency</Typography>
                    <Typography variant="h3" sx={{ color: '#00E5FF' }}>
                      {plant_overview.overall_efficiency.toFixed(1)}%
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1, minWidth: 200, background: 'rgba(0, 230, 118, 0.1)' }}>
                  <CardContent>
                    <Typography color="text.secondary">Production Rate</Typography>
                    <Typography variant="h3" sx={{ color: '#00E676' }}>
                      {plant_overview.production_rate_current.toFixed(1)} TPH
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1, minWidth: 200, background: 'rgba(255, 183, 77, 0.1)' }}>
                  <CardContent>
                    <Typography color="text.secondary">Quality Score</Typography>
                    <Typography variant="h3" sx={{ color: '#FFB74D' }}>
                      {plant_overview.quality_score_avg.toFixed(1)}/100
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              
              {/* Process Trend Chart */}
              <Typography variant="h6" sx={{ color: '#00E5FF', mb: 2 }}>Process Trends (24h)</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.processData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#A0AEC0" />
                  <YAxis yAxisId="temp" orientation="left" stroke="#FF6B35" />
                  <YAxis yAxisId="prod" orientation="right" stroke="#00E676" />
                  <Tooltip 
                    contentStyle={{ background: '#1A1F2E', border: '1px solid #333', color: '#FFFFFF' }}
                  />
                  <Legend />
                  <Line yAxisId="temp" type="monotone" dataKey="kiln_temp" stroke="#FF6B35" strokeWidth={3} name="Kiln Temp (°C)" />
                  <Line yAxisId="prod" type="monotone" dataKey="production" stroke="#00E676" strokeWidth={3} name="Production (TPH)" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>

            {/* Equipment Performance */}
            <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1A1F2E, #242B3D)' }}>
              <Typography variant="h5" sx={{ color: '#00E5FF', mb: 3 }}>Equipment Performance</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.equipmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#A0AEC0" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#A0AEC0" />
                  <Tooltip 
                    contentStyle={{ background: '#1A1F2E', border: '1px solid #333', color: '#FFFFFF' }}
                  />
                  <Bar dataKey="efficiency" fill="#00E5FF" name="Efficiency %" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </>
        )}

        {type === 'quality' && (
          <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1A1F2E, #242B3D)' }}>
            <Typography variant="h5" sx={{ color: '#00E676', mb: 3 }}>Chemical Composition Analysis</Typography>
            {chartData.qualityData && chartData.qualityData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.qualityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${typeof value === 'number' ? value.toFixed(1) : value}%`}
                  >
                    {chartData.qualityData && chartData.qualityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        )}

        {type === 'environmental' && (
          <>
            <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1A1F2E, #242B3D)' }}>
              <Typography variant="h5" sx={{ color: '#81C784', mb: 3 }}>Environmental Impact Analysis</Typography>
              
              {/* Environmental KPIs */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
                {chartData.envData && chartData.envData.slice(0, 4).map((env, index) => (
                  <Card key={index} sx={{ 
                    background: env.status === 'Good' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                    border: env.status === 'Good' ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(244, 67, 54, 0.3)'
                  }}>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">{env.name} Emissions</Typography>
                      <Typography variant="h4" sx={{ color: env.status === 'Good' ? '#4CAF50' : '#F44336' }}>
                        {env.value.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {env.unit} • Limit: {env.limit} • {env.status}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
              
              {/* Environmental Charts */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.envData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#A0AEC0" />
                  <YAxis stroke="#A0AEC0" />
                  <Tooltip 
                    contentStyle={{ background: '#1A1F2E', border: '1px solid #333', color: '#FFFFFF' }}
                    formatter={(value, name) => [value, `${name} (${chartData.envData && chartData.envData.find(d => d.value === value)?.unit || ''})`]}
                  />
                  <Bar dataKey="value" fill="#81C784" name="Emission Level" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
            
            {/* Dust Analysis Section */}
            <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1A1F2E, #242B3D)' }}>
              <Typography variant="h5" sx={{ color: '#FFB74D', mb: 3 }}>Dust Emission Analysis</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                <Card sx={{ background: 'rgba(255, 183, 77, 0.1)', border: '1px solid rgba(255, 183, 77, 0.3)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#FFB74D', mb: 2 }}>Total Dust</Typography>
                    <Typography variant="h3" sx={{ color: '#FFB74D' }}>
                      {environmental_data.dust_emissions.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">mg/Nm³</Typography>
                    <Typography variant="caption" sx={{ 
                      color: environmental_data.dust_emissions < 20 ? '#4CAF50' : '#F44336' 
                    }}>
                      {environmental_data.dust_emissions < 20 ? 'Within Limits' : 'Above Limits'}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ background: 'rgba(255, 138, 101, 0.1)', border: '1px solid rgba(255, 138, 101, 0.3)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#FF8A65', mb: 2 }}>PM10 Particles</Typography>
                    <Typography variant="h3" sx={{ color: '#FF8A65' }}>
                      {(environmental_data.dust_emissions * 0.8).toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">mg/Nm³</Typography>
                    <Typography variant="caption" sx={{ 
                      color: (environmental_data.dust_emissions * 0.8) < 15 ? '#4CAF50' : '#F44336' 
                    }}>
                      {(environmental_data.dust_emissions * 0.8) < 15 ? 'Within Limits' : 'Above Limits'}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ background: 'rgba(244, 67, 54, 0.1)', border: '1px solid rgba(244, 67, 54, 0.3)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#F44336', mb: 2 }}>PM2.5 Particles</Typography>
                    <Typography variant="h3" sx={{ color: '#F44336' }}>
                      {(environmental_data.dust_emissions * 0.3).toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">mg/Nm³</Typography>
                    <Typography variant="caption" sx={{ 
                      color: (environmental_data.dust_emissions * 0.3) < 8 ? '#4CAF50' : '#F44336' 
                    }}>
                      {(environmental_data.dust_emissions * 0.3) < 8 ? 'Within Limits' : 'Above Limits'}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Paper>
          </>
        )}

        {/* AI Recommendations */}
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1A1F2E, #242B3D)' }}>
          <Typography variant="h5" sx={{ color: '#CE93D8', mb: 3 }}>AI-Powered Recommendations</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {ai_recommendations.slice(0, 5).map((rec, index) => (
              <Card key={index} sx={{ background: 'rgba(206, 147, 216, 0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#CE93D8' }}>
                    {rec.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {rec.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip size="small" label={`${rec.type.toUpperCase()}`} sx={{ background: '#CE93D8', color: '#000' }} />
                    <Chip size="small" label={`${(rec.confidence_score * 100).toFixed(0)}% Confidence`} variant="outlined" />
                    <Chip size="small" label={`${rec.implementation_difficulty} Implementation`} variant="outlined" />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>

        {/* Footer */}
        <Divider sx={{ my: 3, borderColor: '#333' }} />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Report generated by CementAI Nexus - AI-Powered Cement Plant Operations<br/>
          Backend: {API_BASE_URL}
        </Typography>
      </Box>
    );
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const report = generateVisualReport(selectedReportType);
      setReportContent(report);
      setPreviewOpen(true);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintReport = async () => {
    if (!reportContent || !reportRef.current) return;

    try {
      // Use native browser print with CSS optimizations for charts
      const printContent = reportRef.current.cloneNode(true) as HTMLElement;
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${reportConfigs[selectedReportType].title}</title>
              <style>
                @media print {
                  * { 
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  
                  body { 
                    font-family: Arial, sans-serif; 
                    margin: 0; 
                    padding: 15px;
                    background: white !important;
                    color: black !important;
                    font-size: 11px;
                    line-height: 1.3;
                  }
                  
                  /* Emoji and Unicode symbols - Enhanced */
                  span[style*="fontSize: '2rem'"],
                  span[style*="fontSize: '1.5rem'"],
                  span[style*="fontSize: '1.2rem'"] {
                    font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Segoe UI Symbol", sans-serif !important;
                    color: black !important;
                    display: inline-block !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  
                  /* Custom alert boxes */
                  [style*="border: 1px solid"] {
                    border: 1px solid #ddd !important;
                    background: #f5f5f5 !important;
                    color: black !important;
                  }
                  
                  /* Page layout and breaks */
                  .page-break { page-break-before: always; }
                  .avoid-break { page-break-inside: avoid; }
                  
                  /* Charts and SVGs - Better handling */
                  .recharts-wrapper { 
                    background: white !important;
                    border: 1px solid #ddd;
                    margin: 8px 0;
                    page-break-inside: avoid;
                    max-height: 200px;
                    overflow: hidden;
                  }
                  
                  .recharts-surface {
                    background: white !important;
                    max-width: 100% !important;
                  }
                  
                  svg { 
                    background: white !important;
                    max-width: 100% !important;
                    height: auto !important;
                    border: none !important;
                  }
                  
                  /* Material-UI components */
                  .MuiCard-root, .MuiPaper-root {
                    background: white !important;
                    border: 1px solid #ddd !important;
                    box-shadow: none !important;
                    margin: 3px 0 !important;
                    padding: 6px !important;
                    page-break-inside: avoid;
                  }
                  
                  .MuiCardContent-root {
                    padding: 4px !important;
                  }
                  
                  /* Typography for print */
                  h1, h2, h3, h4, h5, h6 {
                    color: #333 !important;
                    page-break-after: avoid;
                    margin: 8px 0 4px 0;
                  }
                  
                  h1 { font-size: 16px !important; }
                  h2 { font-size: 14px !important; }
                  h3 { font-size: 13px !important; }
                  h4 { font-size: 12px !important; }
                  h5 { font-size: 11px !important; }
                  h6 { font-size: 10px !important; }
                  
                  /* Text colors */
                  * {
                    color: #333 !important;
                  }
                  
                  /* Grid layouts - Convert to block */
                  .MuiBox-root {
                    display: block !important;
                  }
                  
                  /* Hide interactive elements */
                  .MuiDialogActions-root,
                  .no-print,
                  button {
                    display: none !important;
                  }
                  
                  /* Alerts and chips */
                  .MuiAlert-root {
                    background: #f5f5f5 !important;
                    border: 1px solid #ddd !important;
                    margin: 3px 0 !important;
                    padding: 4px !important;
                  }
                  
                  .MuiChip-root {
                    background: #f0f0f0 !important;
                    color: #333 !important;
                    border: 1px solid #ccc !important;
                    font-size: 10px !important;
                  }
                  
                  /* Compact grid layouts */
                  [style*="display: flex"] {
                    display: block !important;
                  }
                  
                  [style*="gap"] {
                    gap: 2px !important;
                  }
                }
                
                @media screen {
                  body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    background: #0A0E1A; 
                    color: white; 
                  }
                  h1, h2, h3 { color: #00E5FF; }
                  .chart-container { margin: 20px 0; }
                  .card { background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 8px; }
                }
              </style>
            </head>
            <body>
              <div id="printContent"></div>
            </body>
          </html>
        `);
        
        // Wait for document to be ready
        printWindow.document.close();
        
        // Insert the cloned content
        const printContentDiv = printWindow.document.getElementById('printContent');
        if (printContentDiv) {
          printContentDiv.appendChild(printContent);
        }
        
        // Wait a bit for charts to render, then print
        setTimeout(() => {
          printWindow.print();
          // Don't close the window immediately to allow user to see print preview
        }, 1000);
      }
    } catch (error) {
      console.error('Error printing report:', error);
      // Fallback to simple print
      window.print();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        color: '#00E5FF', 
        fontWeight: 700,
        mb: 3 
      }}>
        Report Generator
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Combined Report Selection and Generation */}
        <Box sx={{ flex: '1 1 600px', minWidth: '600px' }}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #1A1F2E, #242B3D)' }}>
            <Typography variant="h6" sx={{ color: '#00E5FF', mb: 3 }}>
              Select & Generate Report
            </Typography>
            
            {/* Report Type Cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              {Object.values(reportConfigs).map((config) => (
                <Card 
                  key={config.type}
                  sx={{ 
                    background: selectedReportType === config.type 
                      ? 'rgba(0, 229, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: selectedReportType === config.type ? '2px solid #00E5FF' : '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(0, 229, 255, 0.05)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => setSelectedReportType(config.type)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: config.color, fontSize: '2rem' }}>{config.icon}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: config.color, fontWeight: 600 }}>
                          {config.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {config.description}
                        </Typography>
                      </Box>
                      {selectedReportType === config.type && (
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          background: '#00E5FF',
                          boxShadow: '0 0 8px rgba(0, 229, 255, 0.6)'
                        }} />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Generate Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleGenerateReport}
              disabled={isGenerating || !dashboardData}
              startIcon={isGenerating ? <span style={{ fontSize: '1.2rem' }}>⏳</span> : <span style={{ fontSize: '1.2rem' }}>📊</span>}
              sx={{
                backgroundColor: '#00E5FF',
                color: '#000',
                fontWeight: 600,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { backgroundColor: '#00B2CC' }
              }}
            >
              {isGenerating ? 'Generating Report...' : 'Generate & Preview Report'}
            </Button>

            {!dashboardData && (
              <Box sx={{ 
                mt: 2, 
                p: 2, 
                borderRadius: 2, 
                border: '1px solid #ff9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <Typography variant="body2" sx={{ color: '#ff9800' }}>
                  No dashboard data available. Please ensure the simulation is running.
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Report Information */}
        <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #1A1F2E, #242B3D)' }}>
            <Typography variant="h6" sx={{ color: '#00E5FF', mb: 2 }}>
              Report Features
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(0, 229, 255, 0.1)' }}>
                <Typography variant="subtitle1" sx={{ color: '#00E5FF', fontWeight: 600, mb: 1 }}>
                  Visual Reports with Charts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Interactive charts, graphs, and visual analytics for comprehensive insights
                </Typography>
              </Box>
              
              <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(0, 230, 118, 0.1)' }}>
                <Typography variant="subtitle1" sx={{ color: '#00E676', fontWeight: 600, mb: 1 }}>
                  AI-Powered Insights
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Smart recommendations and performance analysis based on real-time data
                </Typography>
              </Box>
              
              <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255, 183, 77, 0.1)' }}>
                <Typography variant="subtitle1" sx={{ color: '#FFB74D', fontWeight: 600, mb: 1 }}>
                  Print-Optimized Output
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Professional layouts designed for high-quality printing and sharing
                </Typography>
              </Box>
              
              <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(129, 199, 132, 0.1)' }}>
                <Typography variant="subtitle1" sx={{ color: '#81C784', fontWeight: 600, mb: 1 }}>
                  Environmental Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive dust analysis, emissions tracking, and compliance monitoring
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Report Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ background: '#1A1F2E', color: '#00E5FF' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {reportConfigs[selectedReportType].icon}
            {reportConfigs[selectedReportType].title} - Preview
          </Box>
        </DialogTitle>
        <DialogContent sx={{ background: '#0A0E1A', color: '#FFFFFF' }}>
          <Box ref={reportRef} sx={{ mt: 2 }}>
            {reportContent}
          </Box>
        </DialogContent>
        <DialogActions sx={{ background: '#1A1F2E', gap: 1 }}>
          <Button
            onClick={handlePrintReport}
            startIcon={<span style={{ fontSize: '1.2rem' }}>🖨️</span>}
            variant="contained"
            sx={{ 
              backgroundColor: '#00E5FF',
              color: '#000',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#00B2CC' }
            }}
          >
            Print Report
          </Button>
          <Button
            onClick={() => setPreviewOpen(false)}
            sx={{ color: '#A0AEC0' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}