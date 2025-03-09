
import React, { useEffect, useState } from 'react';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = "Your repo is loading, please wait" 
}) => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background bg-opacity-80 backdrop-blur-md z-50 animate-fade-in">
      <div className="mb-8 relative">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
      <div className="glass-card px-8 py-6 rounded-2xl flex flex-col items-center max-w-md mx-auto text-center">
        <h3 className="text-xl font-medium mb-2">{message}</h3>
        <p className="text-muted-foreground mb-2">
          This may take a moment{dots}
        </p>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-4">
          <div className="h-full bg-primary rounded-full shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
