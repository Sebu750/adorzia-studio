import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface DiagnosticData {
  timestamp: string;
  component: string;
  status: 'loading' | 'success' | 'error';
  message: string;
  details?: any;
}

interface DiagnosticOverlayProps {
  onClose: () => void;
}

export function DiagnosticOverlay({ onClose }: DiagnosticOverlayProps) {
  const [diagnostics, setDiagnostics] = useState<DiagnosticData[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Add diagnostic entry
  const addDiagnostic = useCallback((component: string, status: 'loading' | 'success' | 'error', message: string, details?: any) => {
    const entry: DiagnosticData = {
      timestamp: new Date().toLocaleTimeString(),
      component,
      status,
      message,
      details
    };
    
    setDiagnostics(prev => [...prev, entry]);
    console.log(`[Diagnostic] ${component}: ${message}`, details || '');
  }, []);

  // Global error capture
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      addDiagnostic('Global Error', 'error', event.error?.message || 'Unknown error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addDiagnostic('Unhandled Promise', 'error', event.reason?.message || 'Promise rejection', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Initial diagnostics
    addDiagnostic('App Bootstrap', 'loading', 'Application starting...');
    addDiagnostic('Environment', 'success', 'Environment variables loaded', {
      SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '✓ Configured' : '✗ Missing'
    });

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Application Diagnostics
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[60vh]">
          <div className="space-y-2">
            {diagnostics.map((diag, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded border">
                <div className="mt-1">
                  {diag.status === 'loading' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                  {diag.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {diag.status === 'error' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-muted-foreground">{diag.timestamp}</span>
                    <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                      {diag.component}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      diag.status === 'loading' ? 'bg-blue-100 text-blue-800' :
                      diag.status === 'success' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {diag.status}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{diag.message}</p>
                  {diag.details && (
                    <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto max-h-20">
                      {JSON.stringify(diag.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <Button onClick={onClose} className="flex-1">
              Close Diagnostics
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setDiagnostics([])}
            >
              Clear Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Create a global diagnostics event bus
const diagnosticListeners = new Set<(entry: DiagnosticData) => void>();

export function addDiagnosticListener(callback: (entry: DiagnosticData) => void) {
  diagnosticListeners.add(callback);
  return () => diagnosticListeners.delete(callback);
}

export function emitDiagnostic(component: string, status: 'loading' | 'success' | 'error', message: string, details?: any) {
  const entry: DiagnosticData = {
    timestamp: new Date().toLocaleTimeString(),
    component,
    status,
    message,
    details
  };
  
  diagnosticListeners.forEach(listener => {
    try {
      listener(entry);
    } catch (e) {
      // Ignore listener errors
    }
  });
  
  console.log(`[Diagnostic] ${component}: ${message}`, details || '');
}

// Hook to use diagnostics in components - safe to call anywhere
export function useDiagnostics() {
  const addDiagnostic = useCallback((component: string, status: 'loading' | 'success' | 'error', message: string, details?: any) => {
    emitDiagnostic(component, status, message, details);
  }, []);

  return { addDiagnostic };
}