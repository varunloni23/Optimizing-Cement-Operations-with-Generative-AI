'use client'

import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import FuturisticSidebar from './FuturisticSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <FuturisticSidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: 'margin-left 0.3s ease',
          marginLeft: sidebarOpen ? '280px' : '80px',
          background: 'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 50%, #242B3D 100%)',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}