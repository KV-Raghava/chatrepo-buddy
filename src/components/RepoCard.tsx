
import React from 'react';
import { FolderGit2, ArrowRight, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RepoCardProps {
  name: string;
  description?: string;
  lastUpdated?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const RepoCard: React.FC<RepoCardProps> = ({
  name,
  description,
  lastUpdated,
  icon,
  onClick,
  className
}) => {
  return (
    <div 
      className={cn(
        "glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-elevated group cursor-pointer animate-slide-up",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {icon || <FolderGit2 className="h-10 w-10 text-primary" />}
          <div className="ml-4">
            <h3 className="text-lg font-medium">{name}</h3>
            {description && (
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{description}</p>
            )}
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-2">Last updated: {lastUpdated}</p>
            )}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const UploadCard: React.FC<Omit<RepoCardProps, 'icon'>> = (props) => {
  return (
    <RepoCard
      {...props}
      icon={<File className="h-10 w-10 text-primary" />}
    />
  );
};

export default RepoCard;
