import React from "react";

type ErrorBoundaryProps = {
    children: React.ReactNode;
  };
  
  type ErrorBoundaryState = {
    hasError: boolean;
    errorMessage?: string;
  };
  
  class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = {
      hasError: false,
      errorMessage: ''
    };
  
    static getDerivedStateFromError(error: Error) {
      return { hasError: true, errorMessage: error.message };
    }
  
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error("Caught an error:", error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong: {this.state.errorMessage}</h1>;
      }
      return this.props.children;
    }
  }
  
  export default ErrorBoundary;
  