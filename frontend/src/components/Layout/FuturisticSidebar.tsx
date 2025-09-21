'use client'

import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  Analytics,
  Visibility,
  Engineering,
  SmartToy,
  Speed,
  Memory,
  Settings,
  MenuOpen,
  Menu,
  Nature,
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Dashboard, color: '#00E5FF' },
  { id: 'analytics', label: 'Analytics', icon: Analytics, color: '#40C4FF' },
  { id: 'monitoring', label: 'Plant Monitor', icon: Visibility, color: '#00E676' },
  { id: 'process', label: 'Process Control', icon: Engineering, color: '#FFB74D' },
  { id: 'environment', label: 'Environment', icon: Nature, color: '#81C784' },
  { id: 'ai-assistant', label: 'AI Assistant', icon: SmartToy, color: '#FF6B35' },
  { id: 'optimization', label: 'Optimization', icon: Speed, color: '#BA68C8' },
  { id: 'memory', label: 'Data Memory', icon: Memory, color: '#4DB6AC' },
  { id: 'settings', label: 'Settings', icon: Settings, color: '#90A4AE' },
];

export default function FuturisticSidebar({ open, onToggle }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const drawerWidth = open ? 280 : 80;

  return (
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
        {open ? (
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
        <IconButton onClick={onToggle} sx={{ color: '#00E5FF' }}>
          {open ? <MenuOpen /> : <Menu />}
        </IconButton>
      </Box>

      {open && (
        <Box sx={{ px: 2, py: 1 }}>
          <Chip
            label="SYSTEM ONLINE"
            size="small"
            sx={{
              background: 'linear-gradient(90deg, #00E676, #4CAF50)',
              color: '#000',
              fontWeight: 600,
              fontSize: '0.7rem',
              animation: 'pulse 2s infinite',
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
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === 0; // Dashboard is active
            const isHovered = hoveredItem === item.id;
            
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
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
                    boxShadow: isActive 
                      ? `0 0 20px ${item.color}30`
                      : 'none',
                    '&:hover': {
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: isActive ? item.color : '#A0AEC0',
                      transition: 'all 0.3s ease',
                      filter: isActive || isHovered ? `drop-shadow(0 0 8px ${item.color})` : 'none',
                    }}
                  >
                    <Icon sx={{ fontSize: 24 }} />
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.label}
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: '0.95rem',
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? item.color : '#E0E6ED',
                          transition: 'all 0.3s ease',
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

      {open && (
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
  );
}