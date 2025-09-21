'use client'

import { useState, useEffect } from 'react';
import { buildApiUrl } from '../config/api';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  SmartToy as AIIcon,
  Engineering as EngineeringIcon,
  Security as SecurityIcon,
  TrendingUp as OptimizeIcon,
  Support as SupportIcon
} from '@mui/icons-material';

interface SystemPromptConfigProps {
  open: boolean;
  onClose: () => void;
}

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
  prompt: string;
  category: 'technical' | 'operations' | 'safety' | 'support' | 'optimization';
}

const promptTemplates: PromptTemplate[] = [
  {
    id: 'default',
    name: 'Default Cement Plant Assistant',
    description: 'Comprehensive cement plant operations assistant with balanced expertise',
    icon: <AIIcon color="primary" />,
    category: 'technical',
    prompt: `You are CementAI Nexus Assistant, an expert AI system for cement plant operations. You have deep knowledge of:

1. Cement Manufacturing Process:
   - Raw material preparation and grinding
   - Pyroprocessing in rotary kilns
   - Clinker cooling and cement grinding
   - Quality control and testing

2. Equipment and Systems:
   - Rotary kilns, preheaters, and coolers
   - Raw mills and cement mills
   - Fans, separators, and conveyors
   - Control systems and instrumentation

3. Process Optimization:
   - Energy efficiency improvements
   - Alternative fuel utilization
   - Emissions reduction strategies
   - Quality optimization techniques

4. Operational Excellence:
   - Preventive maintenance
   - Safety procedures
   - Environmental compliance
   - Cost optimization

Always provide:
- Clear, actionable recommendations
- Specific technical explanations
- Safety considerations
- Environmental impact awareness
- Cost-benefit analysis when relevant

Keep responses concise but comprehensive, suitable for plant operators and engineers.`
  },
  {
    id: 'technical',
    name: 'Technical Expert',
    description: 'Focused on technical details, troubleshooting, and engineering solutions',
    icon: <EngineeringIcon color="primary" />,
    category: 'technical',
    prompt: `You are a technical expert AI assistant specialized in cement plant engineering and troubleshooting. Your expertise includes:

- Deep technical knowledge of cement manufacturing processes
- Equipment diagnostics and failure analysis
- Process parameter optimization and control
- Instrumentation and automation systems
- Chemical composition and material properties
- Heat and mass balance calculations

Always provide:
- Detailed technical explanations with engineering principles
- Step-by-step troubleshooting procedures
- Specific parameter ranges and tolerances
- Root cause analysis methodologies
- Technical documentation references
- Mathematical calculations when relevant

Focus on engineering accuracy and technical depth in all responses.`
  },
  {
    id: 'safety',
    name: 'Safety Specialist',
    description: 'Prioritizes safety protocols, risk assessment, and regulatory compliance',
    icon: <SecurityIcon color="primary" />,
    category: 'safety',
    prompt: `You are a safety-focused AI assistant for cement plant operations with expertise in:

- Industrial safety protocols and procedures
- Risk assessment and hazard identification
- Personal protective equipment (PPE) requirements
- Emergency response procedures
- Regulatory compliance (OSHA, EPA, local standards)
- Incident investigation and prevention
- Safety training and awareness programs

Always prioritize:
- Safety first in all recommendations
- Compliance with safety regulations
- Risk mitigation strategies
- Proper safety procedures
- Emergency preparedness
- Worker protection measures

Never compromise safety for productivity or cost savings.`
  },
  {
    id: 'operations',
    name: 'Operations Manager',
    description: 'Focuses on operational efficiency, production planning, and management',
    icon: <OptimizeIcon color="primary" />,
    category: 'operations',
    prompt: `You are an operations management AI assistant for cement plants with expertise in:

- Production planning and scheduling
- Operational efficiency optimization
- Resource allocation and management
- Cost control and profitability analysis
- Key Performance Indicators (KPIs) monitoring
- Supply chain coordination
- Quality assurance programs
- Team leadership and workforce management

Provide guidance on:
- Production optimization strategies
- Operational cost reduction
- Performance improvement initiatives
- Management best practices
- Strategic planning approaches
- Continuous improvement methodologies

Focus on business outcomes while maintaining technical excellence.`
  },
  {
    id: 'support',
    name: 'Friendly Support Assistant',
    description: 'Conversational and supportive, great for training and general assistance',
    icon: <SupportIcon color="primary" />,
    category: 'support',
    prompt: `You are a friendly and supportive AI assistant for cement plant operations. Your role is to:

- Provide helpful explanations in easy-to-understand language
- Support learning and training initiatives
- Offer encouragement and positive guidance
- Break down complex topics into simple concepts
- Be patient and understanding with all skill levels
- Provide step-by-step guidance for new operators

Communication style:
- Use clear, simple language
- Be patient and encouraging
- Provide examples and analogies
- Ask clarifying questions when needed
- Offer additional resources for learning
- Maintain a positive, helpful tone

Remember that learning is a journey, and everyone starts somewhere.`
  }
];

export default function SystemPromptConfig({ open, onClose }: SystemPromptConfigProps) {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const loadCurrentPrompt = async () => {
    setLoading(true);
    try {
      const response = await fetch(buildApiUrl('/api/ai/system-prompt'));
      if (response.ok) {
        const data = await response.json();
        setCurrentPrompt(data.systemPrompt || '');
        setIsCustom(data.isCustom);
      }
    } catch (error) {
      console.error('Error loading current prompt:', error);
      showMessage('Failed to load current system prompt', 'error');
    }
    setLoading(false);
  };

  const saveSystemPrompt = async () => {
    if (!currentPrompt.trim()) {
      showMessage('System prompt cannot be empty', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(buildApiUrl('/api/ai/system-prompt'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemPrompt: currentPrompt.trim()
        }),
      });

      if (response.ok) {
        setIsCustom(true);
        showMessage('System prompt saved successfully!', 'success');
      } else {
        const errorData = await response.json();
        showMessage(errorData.error || 'Failed to save system prompt', 'error');
      }
    } catch (error) {
      console.error('Error saving system prompt:', error);
      showMessage('Failed to save system prompt', 'error');
    }
    setLoading(false);
  };

  const clearSystemPrompt = async () => {
    setLoading(true);
    try {
      const response = await fetch(buildApiUrl('/api/ai/system-prompt'), {
        method: 'DELETE'
      });

      if (response.ok) {
        setCurrentPrompt('');
        setIsCustom(false);
        showMessage('System prompt cleared, reverted to default', 'success');
      } else {
        showMessage('Failed to clear system prompt', 'error');
      }
    } catch (error) {
      console.error('Error clearing system prompt:', error);
      showMessage('Failed to clear system prompt', 'error');
    }
    setLoading(false);
  };

  const applyTemplate = (template: PromptTemplate) => {
    setCurrentPrompt(template.prompt);
    setSelectedTab(0); // Switch to custom tab
  };

  useEffect(() => {
    if (open) {
      loadCurrentPrompt();
    }
  }, [open]);

  const filteredTemplates = (category: string) => 
    promptTemplates.filter(template => template.category === category);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <SettingsIcon />
          <Typography variant="h6">AI System Prompt Configuration</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Alert severity="info">
            Configure how your AI Assistant behaves by customizing its system prompt. 
            You can use templates or create your own custom prompt.
          </Alert>
        </Box>

        {message && (
          <Alert severity={messageType} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={<Switch checked={isCustom} disabled />}
            label={isCustom ? "Using Custom System Prompt" : "Using Default System Prompt"}
          />
        </Box>

        <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)} sx={{ mb: 2 }}>
          <Tab label="Custom Prompt" />
          <Tab label="Templates" />
        </Tabs>

        {selectedTab === 0 && (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={15}
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              placeholder="Enter your custom system prompt here..."
              variant="outlined"
              sx={{ mb: 2 }}
              helperText={`${currentPrompt.length} characters. Minimum 10 characters required.`}
            />
            
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={saveSystemPrompt}
                disabled={loading || currentPrompt.trim().length < 10}
              >
                Save Custom Prompt
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadCurrentPrompt}
                disabled={loading}
              >
                Reload Current
              </Button>
              
              {isCustom && (
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<DeleteIcon />}
                  onClick={clearSystemPrompt}
                  disabled={loading}
                >
                  Clear & Use Default
                </Button>
              )}
            </Box>
          </Box>
        )}

        {selectedTab === 1 && (
          <Box>
            {['technical', 'operations', 'safety', 'support'].map((category) => (
              <Accordion key={category} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                    {category} Templates
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display="flex" flexDirection="column" gap={2}>
                    {filteredTemplates(category).map((template) => (
                      <Paper key={template.id} elevation={1} sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          {template.icon}
                          <Typography variant="subtitle1" fontWeight="bold">
                            {template.name}
                          </Typography>
                          <Chip 
                            label={template.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          {template.description}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => applyTemplate(template)}
                        >
                          Use This Template
                        </Button>
                      </Paper>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}