import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { InputRail } from "./components/input-rail";
import { PipelineTimeline, defaultStages } from "./components/pipeline-timeline";
import { TechTrace } from "./components/tech-trace";
import { Viewer3D } from "./components/viewer-3d";
import { 
  generateMockLogs, 
  generateMockApiCalls, 
  simulateProcessing,
  type LogEntry,
  type ApiCall,
  type PipelineStage
} from "./components/demo-data";

// Check for environment variables to determine if we're in demo mode
// In browser environments, default to demo mode
const isDemo = (() => {
  try {
    // Try to access environment variables safely
    const apiKey = typeof window !== "undefined" ? undefined : process?.env?.LV_BAAS_API_KEY;
    const workflowId = typeof window !== "undefined" ? undefined : process?.env?.LV_BAAS_WORKFLOW_ID;
    return !apiKey || !workflowId;
  } catch {
    // Default to demo mode if environment variables are not accessible
    return true;
  }
})();

export default function App() {
  const [selectedMode, setSelectedMode] = useState("text");
  const [isProcessing, setIsProcessing] = useState(false);
  const [stages, setStages] = useState<PipelineStage[]>(defaultStages);
  const [currentStage, setCurrentStage] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);
  const [modelUrl, setModelUrl] = useState<string>();
  const [metrics, setMetrics] = useState<any>();
  const [showViewer, setShowViewer] = useState(false);

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    // Reset state when changing modes
    setStages(defaultStages.map(s => ({ ...s, status: "pending", progress: 0 })));
    setCurrentStage(0);
    setLogs([]);
    setApiCalls([]);
    setModelUrl(undefined);
    setMetrics(undefined);
    setShowViewer(false);
  };

  const handleProcess = async (data: any) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setShowViewer(false);
    
    // Generate mock data for demo mode
    const mockLogs = generateMockLogs(data.mode);
    const mockApiCalls = generateMockApiCalls(data.mode);
    
    setLogs([]);
    setApiCalls([]);
    
    // Add logs progressively
    mockLogs.forEach((log, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, index * 1000);
    });
    
    // Add API calls progressively  
    mockApiCalls.forEach((call, index) => {
      setTimeout(() => {
        setApiCalls(prev => [...prev, call]);
      }, index * 3000);
    });

    // Start pipeline simulation
    const processingInterval = simulateProcessing(
      stages,
      (updatedStages, currentStageIndex) => {
        setStages(updatedStages);
        setCurrentStage(currentStageIndex);
      },
      (artifacts) => {
        setModelUrl(artifacts.modelUrl);
        setMetrics(artifacts.metrics);
        setShowViewer(true);
        setIsProcessing(false);
        
        // Show success notification with confetti effect
        toast.success("3D model generated successfully!", {
          description: "Your model is ready for preview and export.",
          action: {
            label: "View Model",
            onClick: () => {
              document.getElementById("viewer")?.scrollIntoView({ behavior: "smooth" });
            }
          }
        });
        
        // Trigger confetti animation
        if (typeof window !== "undefined" && (window as any).confetti) {
          (window as any).confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    );

    // Show initial success message
    toast.info(`Starting ${data.mode} to 3D conversion...`, {
      description: isDemo 
        ? "Demo mode: Using sample data and mock processing"
        : "Processing your request with LV BaaS API"
    });
  };

  useEffect(() => {
    // Add confetti library for celebration effect
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js";
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Demo mode banner */}
      {isDemo && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-yellow-50 dark:bg-yellow-950 border-b border-yellow-200 dark:border-yellow-800 p-3"
        >
          <div className="container mx-auto">
            <p className="text-center text-sm text-yellow-800 dark:text-yellow-200">
              🚀 Demo Mode Active - Using sample data and mock processing. 
              Set <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">LV_BAAS_API_KEY</code> and{" "}
              <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">LV_BAAS_WORKFLOW_ID</code> for live mode.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main application layout */}
      <div className="flex h-screen">
        {/* Left sidebar - Input rail */}
        <InputRail
          selectedMode={selectedMode}
          onModeChange={handleModeChange}
          onProcess={handleProcess}
          isProcessing={isProcessing}
        />

        {/* Center - Pipeline timeline */}
        <PipelineTimeline
          stages={stages}
          currentStage={currentStage}
          isDemo={isDemo}
        />

        {/* Right sidebar - Tech trace */}
        <TechTrace
          logs={logs}
          apiCalls={apiCalls}
          isDemo={isDemo}
        />
      </div>

      {/* Bottom - 3D Viewer */}
      <div id="viewer">
        <Viewer3D
          modelUrl={modelUrl}
          isVisible={showViewer}
          metrics={metrics}
        />
      </div>

      {/* Toast notifications */}
      <Toaster 
        position="top-right"
        closeButton
        richColors
      />
    </div>
  );
}