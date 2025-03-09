
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Invalid credentials",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate login for demo purposes
    setTimeout(() => {
      // For demo purposes, we'll just navigate to the repo selection page
      // In a real app, you would validate credentials before navigating
      setIsLoading(false);
      navigate('/repos');
    }, 1500);
  };

  const handleGithubLogin = () => {
    setIsLoading(true);
    
    // Simulate GitHub OAuth login
    setTimeout(() => {
      setIsLoading(false);
      navigate('/repos');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div 
        className="w-full max-w-md space-y-8 animate-fade-in"
      >
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Github className="h-10 w-10" />
          </div>
          <h1 className="mt-4 text-3xl font-bold">Welcome to Repo Chat</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to start chatting with your repositories
          </p>
        </div>
        
        <div className="mt-8 glass-card rounded-xl p-8">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a 
                  href="#" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="mt-4 w-full flex items-center justify-center gap-2"
              onClick={handleGithubLogin}
              disabled={isLoading}
            >
              <Github className="h-4 w-4" />
              GitHub
            </Button>
          </div>
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{' '}
          <a href="#" className="text-primary hover:text-primary/80 transition-colors">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
