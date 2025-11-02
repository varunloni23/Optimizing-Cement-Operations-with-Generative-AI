'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  Avatar,
  Chip,
  Button,
  Collapse
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as AIIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  Lightbulb as LightbulbIcon,
  Analytics as AnalyticsIcon,
  AutoFixHigh as OptimizeIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { DashboardData } from '../types/models';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  recommendations?: string[];
}

interface AIAssistantProps {
  dashboardData?: DashboardData;
}

export default function AIAssistant({ dashboardData }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your CementAI Nexus Assistant. I can help you optimize plant operations, explain anomalies, and provide recommendations. What would you like to know?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://cement-line.onrender.com';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for custom events from the main dashboard
  useEffect(() => {
    const handleQualityAnalysisEvent = () => {
      handleQualityAnalysis();
    };

    const handleOptimizationEvent = (event: CustomEvent) => {
      const objective = event.detail || 'quality';
      handleOptimization(objective);
    };

    const handlePredefinedQuestion = async (event: CustomEvent) => {
      const question = event.detail?.question;
      console.log('Received predefined question:', question);
      if (question && !isLoading) {
        // Add user message
        const userMessage: Message = {
          id: Date.now().toString(),
          text: question,
          sender: 'user',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        // Send to AI
        try {
          const response = await fetch(`${backendUrl}/api/ai/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: question,
              context: dashboardData
            }),
          });

          const data = await response.json();
          
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: data.response || data.message || 'I apologize, but I encountered an issue processing your question.',
            sender: 'ai',
            timestamp: new Date(),
            recommendations: data.recommendations
          };

          setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          console.error('Error sending predefined question:', error);
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: 'I apologize, but I\'m having trouble connecting to the AI service. Please make sure the backend is running and try again.',
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    window.addEventListener('triggerQualityAnalysis', handleQualityAnalysisEvent);
    window.addEventListener('triggerOptimization', handleOptimizationEvent as EventListener);
    window.addEventListener('selectPredefinedQuestion', handlePredefinedQuestion as unknown as EventListener);

    return () => {
      window.removeEventListener('triggerQualityAnalysis', handleQualityAnalysisEvent);
      window.removeEventListener('triggerOptimization', handleOptimizationEvent as EventListener);
      window.removeEventListener('selectPredefinedQuestion', handlePredefinedQuestion as unknown as EventListener);
    };
  }, []); // Remove dependencies to avoid hoisting issues

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
          dashboardData: dashboardData
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: result.data.response,
          sender: 'ai',
          timestamp: new Date(),
          recommendations: result.data.recommendations
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble processing your request right now. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = async (question: string) => {
    setInputText(question);
    // Trigger send after setting the text
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleQualityAnalysis = useCallback(async () => {
    if (!dashboardData) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: 'No plant data available for quality analysis. Please ensure the simulation is running.',
        sender: 'ai',
        timestamp: new Date()
      }]);
      return;
    }

    setIsLoading(true);
    
    const analysisMessage: Message = {
      id: Date.now().toString(),
      text: 'Performing real-time quality fluctuation analysis...',
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, analysisMessage]);

    try {
      const response = await fetch(`${backendUrl}/api/ai/quality-fluctuations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentData: dashboardData,
          historicalData: []
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: result.data.response,
          sender: 'ai',
          timestamp: new Date(),
          recommendations: result.data.recommendations
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Quality analysis error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble accessing the quality analysis system. The analysis features require the Gemini API to be properly configured.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [dashboardData]); // Add dependency array

  const handleOptimization = useCallback(async (objective: 'quality' | 'energy' | 'production' | 'environment') => {
    if (!dashboardData) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: 'No plant data available for optimization. Please ensure the simulation is running.',
        sender: 'ai',
        timestamp: new Date()
      }]);
      return;
    }

    setIsLoading(true);
    
    const objectiveLabels = {
      quality: 'Quality-focused optimization',
      energy: 'Energy efficiency optimization', 
      production: 'Production throughput optimization',
      environment: 'Environmental impact optimization'
    };

    const analysisMessage: Message = {
      id: Date.now().toString(),
      text: `Generating ${objectiveLabels[objective]} recommendations...`,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, analysisMessage]);

    try {
      const response = await fetch(`${backendUrl}/api/ai/real-time-optimization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objective: objective
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: result.data.response,
          sender: 'ai',
          timestamp: new Date(),
          recommendations: result.data.recommendations
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Optimization error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble accessing the optimization system. The optimization features require the Gemini API to be properly configured.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [dashboardData]); // Add dependency array

  const quickQuestions = [
    "Why is energy consumption high today?",
    "How can we improve efficiency?",
    "What are the optimization opportunities?",
    "Explain the current kiln temperature",
    "How to reduce CO2 emissions?"
  ];

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Paper sx={{ 
      height: isExpanded ? 600 : 450, 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #1A1F2E 0%, #242B3D 100%)',
      border: '1px solid rgba(0, 229, 255, 0.2)',
      color: '#E0E6ED'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'rgba(0, 229, 255, 0.2)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: 'linear-gradient(90deg, rgba(0, 229, 255, 0.1), rgba(64, 196, 255, 0.1))'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AIIcon sx={{ color: '#00E5FF', mr: 1 }} />
          <Typography variant="h6" sx={{ color: '#00E5FF', fontWeight: 600 }}>AI Assistant</Typography>
        </Box>
        <IconButton onClick={() => setIsExpanded(!isExpanded)} sx={{ color: '#00E5FF' }}>
          <ExpandMoreIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }} />
        </IconButton>
      </Box>

      {/* Quick Questions */}
      <Collapse in={isExpanded}>
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'rgba(0, 229, 255, 0.2)',
          background: 'rgba(0, 229, 255, 0.05)'
        }}>
          <Typography variant="body2" sx={{ color: '#A0AEC0', mb: 1, fontWeight: 600 }}>
            Quick Questions:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {quickQuestions.map((question, index) => (
              <Chip
                key={index}
                label={question}
                size="small"
                onClick={() => handleQuickQuestion(question)}
                sx={{ 
                  cursor: 'pointer',
                  backgroundColor: 'rgba(0, 229, 255, 0.1)',
                  color: '#00E5FF',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 229, 255, 0.2)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Collapse>

      {/* Quality Monitoring Actions */}
      <Collapse in={isExpanded}>
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'rgba(255, 107, 53, 0.2)',
          background: 'rgba(255, 107, 53, 0.05)'
        }}>
          <Typography variant="body2" sx={{ color: '#FF6B35', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <AnalyticsIcon fontSize="small" sx={{ mr: 0.5 }} />
            Quality Monitoring & Optimization:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Quality Analysis Button */}
            <Button
              size="small"
              variant="outlined"
              startIcon={<WarningIcon />}
              onClick={handleQualityAnalysis}
              disabled={isLoading || !dashboardData}
              sx={{
                borderColor: '#FF6B35',
                color: '#FF6B35',
                justifyContent: 'flex-start',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  borderColor: '#FF6B35'
                }
              }}
            >
              Analyze Quality Fluctuations
            </Button>
            
            {/* Optimization Buttons */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {[
                { label: 'Quality Focus', objective: 'quality' as const, color: '#4CAF50' },
                { label: 'Energy Efficiency', objective: 'energy' as const, color: '#FF9800' },
                { label: 'Max Production', objective: 'production' as const, color: '#2196F3' },
                { label: 'Environmental', objective: 'environment' as const, color: '#81C784' }
              ].map((option) => (
                <Button
                  key={option.objective}
                  size="small"
                  variant="outlined"
                  startIcon={<OptimizeIcon />}
                  onClick={() => handleOptimization(option.objective)}
                  disabled={isLoading || !dashboardData}
                  sx={{
                    borderColor: option.color,
                    color: option.color,
                    fontSize: '0.7rem',
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: `${option.color}20`,
                      borderColor: option.color
                    }
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </Collapse>

      {/* Messages */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
        <List>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                display: 'flex',
                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                mb: 1
              }}
            >
              <Avatar
                sx={{
                  bgcolor: message.sender === 'ai' ? '#00E5FF' : '#FF6B35',
                  width: 32,
                  height: 32,
                  ml: message.sender === 'user' ? 1 : 0,
                  mr: message.sender === 'ai' ? 1 : 0,
                  boxShadow: message.sender === 'ai' 
                    ? '0 0 10px rgba(0, 229, 255, 0.4)' 
                    : '0 0 10px rgba(255, 107, 53, 0.4)'
                }}
              >
                {message.sender === 'ai' ? <AIIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
              </Avatar>
              <Box
                sx={{
                  maxWidth: '70%',
                  bgcolor: message.sender === 'user' 
                    ? 'linear-gradient(135deg, #FF6B35, #FF8A65)' 
                    : 'linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(64, 196, 255, 0.1))',
                  background: message.sender === 'user' 
                    ? 'linear-gradient(135deg, #FF6B35, #FF8A65)' 
                    : 'linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(64, 196, 255, 0.1))',
                  color: message.sender === 'user' ? '#FFFFFF !important' : '#E0E6ED',
                  border: message.sender === 'ai' ? '1px solid rgba(0, 229, 255, 0.3)' : 'none',
                  borderRadius: 2,
                  p: 1.5,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    color: message.sender === 'user' ? '#FFFFFF !important' : '#E0E6ED'
                  }}
                >
                  {message.text}
                </Typography>
                {message.recommendations && message.recommendations.length > 0 && (
                  <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(0, 229, 255, 0.3)' }}>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, color: '#00E5FF', fontWeight: 600 }}>
                      <LightbulbIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Recommendations:
                    </Typography>
                    {message.recommendations.map((rec, index) => (
                      <Typography key={index} variant="caption" display="block" sx={{ ml: 1, mb: 0.5, color: '#A0AEC0' }}>
                        • {rec}
                      </Typography>
                    ))}
                  </Box>
                )}
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#A0AEC0', fontSize: '0.7rem' }}>
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </Box>
            </ListItem>
          ))}
          {isLoading && (
            <ListItem>
              <Avatar sx={{ bgcolor: '#00E5FF', width: 32, height: 32, mr: 1, boxShadow: '0 0 10px rgba(0, 229, 255, 0.4)' }}>
                <AIIcon fontSize="small" />
              </Avatar>
              <Box sx={{ 
                bgcolor: 'linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(64, 196, 255, 0.1))',
                background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(64, 196, 255, 0.1))',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                borderRadius: 2, 
                p: 1.5,
                backdropFilter: 'blur(10px)'
              }}>
                <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
                  Analyzing plant data...
                </Typography>
              </Box>
            </ListItem>
          )}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ 
        p: 2, 
        borderTop: 1, 
        borderColor: 'rgba(0, 229, 255, 0.2)', 
        display: 'flex',
        background: 'linear-gradient(90deg, rgba(0, 229, 255, 0.05), rgba(64, 196, 255, 0.05))'
      }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ask about plant operations, optimization, or troubleshooting..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          multiline
          maxRows={3}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(0, 229, 255, 0.05)',
              color: '#FFFFFF',
              '& fieldset': {
                borderColor: 'rgba(0, 229, 255, 0.3)'
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 229, 255, 0.5)'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00E5FF'
              },
              '& input': {
                color: '#FFFFFF !important'
              },
              '& textarea': {
                color: '#FFFFFF !important'
              }
            },
            '& .MuiInputBase-input': {
              color: '#FFFFFF !important'
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#A0AEC0',
              opacity: 1
            }
          }}
        />
        <IconButton 
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
          aria-label="Send message"
          sx={{ 
            ml: 1,
            color: '#00E5FF',
            backgroundColor: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0, 229, 255, 0.2)',
              boxShadow: '0 0 10px rgba(0, 229, 255, 0.4)'
            },
            '&:disabled': {
              color: '#666',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}