'use client'

import { useEffect } from 'react';
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';

interface ErrorHandlerProps {
  children: React.ReactNode;
}

export default function ErrorHandler({ children }: ErrorHandlerProps) {
  useEffect(() => {
    // Enhanced error handling for resource loading failures
    const handleResourceError = (event: ErrorEvent | Event) => {
      const target = event.target as HTMLElement | Window | null;
      
      if (target && target !== window) {
        const element = target as HTMLElement;
        const errorInfo = {
          type: element.tagName || 'Unknown',
          source: (element as any).src || (element as any).href || 'Unknown source',
          message: 'Resource failed to load',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        };
        
        console.error('🔴 Resource Load Error:', errorInfo);
        
        // Handle specific resource types
        if (element.tagName === 'LINK' && (element as HTMLLinkElement).rel === 'stylesheet') {
          console.warn('📎 CSS stylesheet failed to load - using fallback styles');
        } else if (element.tagName === 'SCRIPT') {
          console.warn('📜 Script failed to load - functionality may be limited');
        } else if (element.tagName === 'IMG') {
          console.warn('🖼️ Image failed to load - using placeholder');
        }
      }
    };

    // Handle fetch errors and network failures
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          console.error('🌐 Fetch Error:', {
            url: args[0],
            status: response.status,
            statusText: response.statusText,
            timestamp: new Date().toISOString()
          });
        }
        return response;
      } catch (error) {
        console.error('🚫 Fetch Failed:', {
          url: args[0],
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    };

    // Listen for resource loading errors
    window.addEventListener('error', handleResourceError, true);
    
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🔴 Unhandled Promise Rejection:', {
        reason: event.reason,
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
      
      // Prevent the default behavior (logging to console)
      event.preventDefault();
    };
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Network status monitoring
    const handleOnline = () => {
      console.log('✅ Network: Connection restored');
    };
    
    const handleOffline = () => {
      console.warn('⚠️ Network: Connection lost');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleResourceError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.fetch = originalFetch;
    };
  }, []);

  return <>{children}</>;
}