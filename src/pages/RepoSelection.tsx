
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, FileArchive, Upload, ClipboardPaste, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import { UploadCard } from '@/components/RepoCard';
import Loading from '@/components/Loading';

// Example data - in a real app, this would come from your API
const SAMPLE_REPOS = [
  { 
    id: '1', 
    name: 'react-app', 
    description: 'A modern React application with TypeScript', 
    lastUpdated: '2 days ago' 
  },
  { 
    id: '2', 
    name: 'node-backend', 
    description: 'Express.js API backend for e-commerce platform', 
    lastUpdated: '1 week ago' 
  },
  { 
    id: '3', 
    name: 'python-ml', 
    description: 'Machine learning experiments with scikit-learn and PyTorch', 
    lastUpdated: '3 days ago' 
  },
];

const RepoSelection = () => {
  const [activeTab, setActiveTab] = useState('existing');
  const [repoUrl, setRepoUrl] = useState('');
  const [repoName, setRepoName] = useState('');
  const [uploadRepoName, setUploadRepoName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExistingRepoSelect = (value: string) => {
    setSelectedRepo(value);
  };

  const handleExistingRepoSubmit = () => {
    if (!selectedRepo) {
      toast({
        title: "No repository selected",
        description: "Please select a repository from the dropdown",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    // Simulate loading repository
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/chat/${selectedRepo}`);
    }, 2000);
  };

  const handleGithubRepoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repoUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a GitHub repository URL",
        variant: "destructive"
      });
      return;
    }

    if (!repoName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your repository",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    // Simulate loading repository
    setTimeout(() => {
      setIsLoading(false);
      navigate('/chat/new');
    }, 3000);
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a repository ZIP file first",
        variant: "destructive"
      });
      return;
    }

    if (!uploadRepoName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your repository",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    // Simulate uploading and processing
    setTimeout(() => {
      setIsLoading(false);
      navigate('/chat/new');
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Auto-populate the name from the file name, removing .zip extension
      const fileName = e.target.files[0].name;
      const nameWithoutExtension = fileName.replace(/\.zip$/, '');
      setUploadRepoName(nameWithoutExtension);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      // Auto-populate the name from the file name, removing .zip extension
      const fileName = e.dataTransfer.files[0].name;
      const nameWithoutExtension = fileName.replace(/\.zip$/, '');
      setUploadRepoName(nameWithoutExtension);
    }
  };

  if (isLoading) {
    return <Loading message="Preparing your repository for chat" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Select Repository" showSettings />
      
      <main className="flex-1 container max-w-5xl py-8 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-2 animate-fade-in">Choose a Repository</h1>
        <p className="text-muted-foreground mb-8 animate-fade-in">
          Select an existing repository or add a new one to start chatting
        </p>
        
        <Tabs 
          defaultValue="existing" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="animate-fade-in"
        >
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="existing">Existing Repos</TabsTrigger>
            <TabsTrigger value="github">GitHub URL</TabsTrigger>
            <TabsTrigger value="upload">Upload ZIP</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing" className="space-y-6 animate-fade-in">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-medium mb-4">Select an existing repository</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="repo-select">Repository</Label>
                  <Select value={selectedRepo} onValueChange={handleExistingRepoSelect}>
                    <SelectTrigger className="w-full mt-1.5">
                      <SelectValue placeholder="Select a repository" />
                    </SelectTrigger>
                    <SelectContent>
                      {SAMPLE_REPOS.map((repo) => (
                        <SelectItem key={repo.id} value={repo.id}>
                          <div className="flex flex-col">
                            <span>{repo.name}</span>
                            <span className="text-xs text-muted-foreground">{repo.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleExistingRepoSubmit} 
                  className="w-full"
                  disabled={!selectedRepo}
                >
                  Continue with Selected Repository
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="github" className="animate-fade-in">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-medium mb-4 flex items-center">
                <Github className="mr-2 h-5 w-5" />
                Clone from GitHub
              </h2>
              <p className="text-muted-foreground mb-6">
                Enter the URL of a public GitHub repository to chat with it
              </p>
              
              <form onSubmit={handleGithubRepoSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="repo-url">Repository URL</Label>
                    <div className="mt-1.5 relative">
                      <ClipboardPaste className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="repo-url"
                        placeholder="https://github.com/username/repository"
                        className="pl-10"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="repo-name">Repository Name</Label>
                    <Input
                      id="repo-name"
                      placeholder="Enter a name for this repository"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full mt-6">
                  Connect Repository
                </Button>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="animate-fade-in">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-medium mb-4 flex items-center">
                <FileArchive className="mr-2 h-5 w-5" />
                Upload Repository ZIP
              </h2>
              <p className="text-muted-foreground mb-6">
                Upload a ZIP file of your repository to chat with it
              </p>
              
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-6"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
              >
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                
                <div className="mb-4">
                  <p className="font-medium">Drag and drop your ZIP file</p>
                  <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <Button 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                >
                  Choose File
                </Button>
                
                {selectedFile && (
                  <div className="mt-4 text-sm p-2 bg-accent rounded-md">
                    Selected: <span className="font-medium">{selectedFile.name}</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <Label htmlFor="upload-repo-name">Repository Name</Label>
                <Input
                  id="upload-repo-name"
                  placeholder="Enter a name for this repository"
                  value={uploadRepoName}
                  onChange={(e) => setUploadRepoName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              
              <Button 
                onClick={handleFileUpload} 
                className="w-full"
                disabled={!selectedFile || !uploadRepoName.trim()}
              >
                Upload and Process
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default RepoSelection;
