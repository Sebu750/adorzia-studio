import React, { Component, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Bug, Copy, Check } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  copied: boolean;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, copied: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('EnhancedErrorBoundary caught an error:', error, errorInfo);
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Log to diagnostics if available
    try {
      const diagnosticsElement = document.getElementById('diagnostics-root');
      if (diagnosticsElement) {
        const event = new CustomEvent('diagnostic-error', {
          detail: {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack
          }
        });
        diagnosticsElement.dispatchEvent(event);
      }
    } catch (e) {
      console.error('Failed to log to diagnostics:', e);
    }
    
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  copyErrorDetails = async () => {
    const { error, errorInfo } = this.state;
    if (!error) return;
    
    const errorDetails = `
Error: ${error.message}
Stack: ${error.stack}
Component Stack: ${errorInfo?.componentStack}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
    `;
    
    try {
      await navigator.clipboard.writeText(errorDetails);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="border-destructive/20 bg-destructive/5 max-w-2xl w-full">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                We're sorry, but something unexpected happened. This error has been logged and we're working to fix it.
              </p>
              
              {this.state.error && (
                <div className="w-full max-w-lg mb-4">
                  <div className="bg-muted p-3 rounded-md text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">Error Details</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={this.copyErrorDetails}
                        className="h-6 px-2 text-xs"
                      >
                        {this.state.copied ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground overflow-auto max-h-32">
                      <div className="mb-2">
                        <strong className="text-foreground">Message:</strong> {this.state.error.message}
                      </div>
                      {this.state.error.stack && (
                        <div>
                          <strong className="text-foreground">Stack:</strong>
                          <pre className="mt-1 whitespace-pre-wrap">{this.state.error.stack}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
                <Button
                  variant="default"
                  onClick={this.handleRetry}
                  className="gap-2 flex-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="gap-2 flex-1"
                >
                  <Bug className="h-4 w-4" />
                  Reload Page
                </Button>
              </div>
              
              <div className="mt-4 text-xs text-muted-foreground">
                If this continues, please contact support with the error details above.
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}