import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Upload, Type, Image, Images, FileVideo } from "lucide-react";
import { cn } from "./ui/utils";

interface InputRailProps {
  selectedMode: string;
  onModeChange: (mode: string) => void;
  onProcess: (data: any) => void;
  isProcessing: boolean;
}

export function InputRail({ selectedMode, onModeChange, onProcess, isProcessing }: InputRailProps) {
  const [textPrompt, setTextPrompt] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const modes = [
    {
      id: "text",
      title: "Text to 3D",
      description: "Generate 3D models from text descriptions",
      icon: Type,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "image", 
      title: "Image to 3D",
      description: "Convert single images to 3D objects",
      icon: Image,
      color: "from-green-500 to-green-600"
    },
    {
      id: "multi",
      title: "Multi-Image to 3D",
      description: "Create 3D from multiple images or video",
      icon: Images,
      color: "from-purple-500 to-purple-600"
    }
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(files);
    
    // Auto-select appropriate mode based on file count
    if (files.length === 1) {
      onModeChange("image");
    } else if (files.length > 1) {
      onModeChange("multi");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(files);
    
    if (files.length === 1) {
      onModeChange("image");
    } else if (files.length > 1) {
      onModeChange("multi");
    }
  };

  const handleProcess = () => {
    const data = {
      mode: selectedMode,
      prompt: textPrompt,
      files: uploadedFiles,
      timestamp: Date.now()
    };
    onProcess(data);
  };

  const canProcess = () => {
    if (selectedMode === "text") return textPrompt.trim().length > 0;
    if (selectedMode === "image") return uploadedFiles.length === 1;
    if (selectedMode === "multi") return uploadedFiles.length > 1;
    return false;
  };

  return (
    <div className="w-80 p-6 border-r bg-background">
      <div className="space-y-6">
        <div>
          <h2 className="mb-4">Select Conversion Type</h2>
          <div className="space-y-3">
            {modes.map((mode) => {
              const Icon = mode.icon;
              return (
                <motion.div
                  key={mode.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all border-2",
                      selectedMode === mode.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => onModeChange(mode.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg bg-gradient-to-br",
                          mode.color,
                          "text-white"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">{mode.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {mode.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {selectedMode === "text" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <Label htmlFor="prompt">Text Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the 3D object you want to create..."
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              className="min-h-24 resize-none"
            />
          </motion.div>
        )}

        {(selectedMode === "image" || selectedMode === "multi") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <Label>Upload Files</Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                dragActive ? "border-primary bg-primary/5" : "border-border",
                "hover:border-primary/50 hover:bg-primary/5"
              )}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
            >
              <input
                type="file"
                multiple={selectedMode === "multi"}
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="space-y-2">
                  {selectedMode === "image" ? (
                    <Image className="h-8 w-8 mx-auto text-muted-foreground" />
                  ) : selectedMode === "multi" ? (
                    <FileVideo className="h-8 w-8 mx-auto text-muted-foreground" />
                  ) : (
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  )}
                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      Drop files here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedMode === "image" 
                        ? "Single image (JPG, PNG, WebP)" 
                        : "Multiple images or video files"
                      }
                    </p>
                  </div>
                </div>
              </label>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {uploadedFiles.length} file(s) selected
                </p>
                <div className="max-h-20 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="text-xs p-2 bg-muted rounded text-muted-foreground">
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        <Button 
          onClick={handleProcess}
          disabled={!canProcess() || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? "Processing..." : "Generate 3D Model"}
        </Button>
      </div>
    </div>
  );
}