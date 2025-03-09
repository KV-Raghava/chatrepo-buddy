
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Github, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSettings?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBackButton = false,
  showSettings = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-border animate-fade-in">
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full transition-all hover:bg-secondary"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center">
          <Github className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-medium">
            {title || 'Repo Chat'}
          </h1>
        </div>
      </div>
      
      {showSettings && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full transition-all hover:bg-secondary"
          onClick={() => {/* Settings logic */}}
        >
          <Settings className="h-5 w-5" />
        </Button>
      )}
    </header>
  );
};

export default Header;
