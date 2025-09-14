import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  Upload, 
  Search, 
  Cpu, 
  Grid3x3, 
  Palette, 
  Zap, 
  CheckCircle, 
  Download,
  Clock,
  Play
} from "lucide-react";
import { cn } from "./ui/utils";

interface PipelineStage {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: "pending" | "running" | "completed" | "error";
  progress: number;
  duration?: number;
  details?: string;
}

interface PipelineTimelineProps {
  stages: PipelineStage[];
  currentStage: number;
  isDemo: boolean;
}

export function PipelineTimeline({ stages, currentStage, isDemo }: PipelineTimelineProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-500";
      case "running": return "text-blue-500";
      case "error": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string, icon: any) => {
    const Icon = icon;
    switch (status) {
      case "completed": return CheckCircle;
      case "running": return Play;
      case "error": return Clock;
      default: return Icon;
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2>Pipeline Timeline</h2>
          {isDemo && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
              Demo Mode
            </Badge>
          )}
        </div>

        <div className="grid gap-4">
          {stages.map((stage, index) => {
            const StatusIcon = getStatusIcon(stage.status, stage.icon);
            const isActive = index === currentStage;
            const isCompleted = stage.status === "completed";
            const isRunning = stage.status === "running";

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "transition-all border-2",
                  isActive && "border-primary bg-primary/5",
                  isCompleted && "border-green-500/50",
                  stage.status === "error" && "border-red-500/50"
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          isCompleted && "bg-green-500 text-white",
                          isRunning && "bg-blue-500 text-white animate-pulse",
                          stage.status === "error" && "bg-red-500 text-white",
                          stage.status === "pending" && "bg-muted text-muted-foreground"
                        )}>
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">{stage.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {stage.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {stage.duration && (
                          <Badge variant="secondary" className="text-xs">
                            {stage.duration}s
                          </Badge>
                        )}
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getStatusColor(stage.status))}
                        >
                          {stage.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {isRunning && (
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span>{stage.progress}%</span>
                        </div>
                        <Progress value={stage.progress} className="h-2" />
                        {stage.details && (
                          <p className="text-xs text-muted-foreground">
                            {stage.details}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  )}

                  {isCompleted && stage.details && (
                    <CardContent className="pt-0">
                      <p className="text-xs text-green-600">
                        ✓ {stage.details}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {stages.some(s => s.status === "completed") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">
                Pipeline processing completed successfully
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export const defaultStages: PipelineStage[] = [
  {
    id: "ingest",
    name: "Ingest",
    description: "Processing input data and validation",
    icon: Upload,
    status: "pending",
    progress: 0
  },
  {
    id: "preflight",
    name: "Preflight",
    description: "Analyzing and preparing for reconstruction",
    icon: Search,
    status: "pending", 
    progress: 0
  },
  {
    id: "reconstruct",
    name: "Reconstruct",
    description: "3D reconstruction and point cloud generation",
    icon: Cpu,
    status: "pending",
    progress: 0
  },
  {
    id: "mesh",
    name: "Mesh",
    description: "Generating polygonal mesh from point cloud",
    icon: Grid3x3,
    status: "pending",
    progress: 0
  },
  {
    id: "texture",
    name: "Texture",
    description: "UV mapping and texture generation",
    icon: Palette,
    status: "pending",
    progress: 0
  },
  {
    id: "optimize", 
    name: "Optimize",
    description: "Mesh optimization and compression",
    icon: Zap,
    status: "pending",
    progress: 0
  },
  {
    id: "evaluate",
    name: "Evaluate",
    description: "Quality assessment and metrics calculation",
    icon: CheckCircle,
    status: "pending",
    progress: 0
  },
  {
    id: "export",
    name: "Export",
    description: "Generating final output formats",
    icon: Download,
    status: "pending",
    progress: 0
  }
];