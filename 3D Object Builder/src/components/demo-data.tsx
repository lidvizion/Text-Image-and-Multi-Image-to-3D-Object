// Demo data and mock functionality for the 3D object generation app

export interface LogEntry {
  timestamp: string;
  level: "info" | "warning" | "error" | "success";
  message: string;
  details?: string;
}

export interface ApiCall {
  id: string;
  method: string;
  endpoint: string;
  status: number;
  duration: number;
  timestamp: string;
  request?: any;
  response?: any;
}

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: "pending" | "running" | "completed" | "error";
  progress: number;
  duration?: number;
  details?: string;
}

export const sampleGLBUrls = {
  text: "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb",
  image: "https://threejs.org/examples/models/gltf/Soldier.glb", 
  multi: "https://threejs.org/examples/models/gltf/Flamingo.glb"
};

export const generateMockLogs = (mode: string): LogEntry[] => {
  const baseTime = Date.now();
  const logs: LogEntry[] = [
    {
      timestamp: new Date(baseTime - 10000).toISOString(),
      level: "info",
      message: "Job started",
      details: `Mode: ${mode}, Request ID: ${Math.random().toString(36).substr(2, 9)}`
    },
    {
      timestamp: new Date(baseTime - 9000).toISOString(),
      level: "info", 
      message: "Input validation completed",
      details: "All input parameters validated successfully"
    },
    {
      timestamp: new Date(baseTime - 7000).toISOString(),
      level: "info",
      message: "Processing pipeline initialized",
      details: "8 stages configured for execution"
    }
  ];

  if (mode === "text") {
    logs.push(
      {
        timestamp: new Date(baseTime - 6000).toISOString(),
        level: "info",
        message: "Text prompt processed",
        details: "Prompt tokenized and embedded successfully"
      },
      {
        timestamp: new Date(baseTime - 4000).toISOString(),
        level: "info",
        message: "3D generation model loaded",
        details: "Using Text2Mesh v2.1 with guidance scale 7.5"
      }
    );
  } else if (mode === "image") {
    logs.push(
      {
        timestamp: new Date(baseTime - 6000).toISOString(),
        level: "info",
        message: "Image preprocessed",
        details: "Background removed, normalized to 512x512"
      },
      {
        timestamp: new Date(baseTime - 4000).toISOString(),
        level: "info",
        message: "Depth estimation completed",
        details: "MiDaS depth map generated with 0.92 confidence"
      }
    );
  } else {
    logs.push(
      {
        timestamp: new Date(baseTime - 6000).toISOString(),
        level: "info",
        message: "Multi-view images processed",
        details: "24 images aligned and calibrated"
      },
      {
        timestamp: new Date(baseTime - 4000).toISOString(),
        level: "info",
        message: "NeRF training initialized",
        details: "Training with 10k iterations, batch size 1024"
      }
    );
  }

  logs.push(
    {
      timestamp: new Date(baseTime - 2000).toISOString(),
      level: "success",
      message: "Mesh generation completed",
      details: "Generated mesh with 15,432 vertices and 28,764 triangles"
    },
    {
      timestamp: new Date(baseTime - 1000).toISOString(),
      level: "success",
      message: "Texture baking finished",
      details: "4K PBR textures generated (albedo, normal, roughness)"
    },
    {
      timestamp: new Date(baseTime).toISOString(),
      level: "success",
      message: "Export completed",
      details: "Model exported in GLB, USDZ, OBJ, and PLY formats"
    }
  );

  return logs;
};

export const generateMockApiCalls = (mode: string): ApiCall[] => {
  const baseTime = Date.now();
  
  return [
    {
      id: "1",
      method: "POST",
      endpoint: "/v1/workflows/demo_workflow_id/run",
      status: 201,
      duration: 1250,
      timestamp: new Date(baseTime - 10000).toISOString(),
      request: {
        mode,
        ...(mode === "text" && { prompt: "A futuristic spaceship", guidance: 7.5, seed: 42 }),
        ...(mode === "image" && { image_url: "uploaded_image.jpg", background_removal: true }),
        ...(mode === "multi" && { frame_urls: ["frame_001.jpg", "frame_002.jpg"], target_format: "glb" })
      },
      response: {
        job_id: "job_demo_12345",
        status: "queued",
        estimated_duration: "5-10 minutes"
      }
    },
    {
      id: "2", 
      method: "GET",
      endpoint: "/v1/jobs/job_demo_12345/status",
      status: 200,
      duration: 180,
      timestamp: new Date(baseTime - 5000).toISOString(),
      response: {
        job_id: "job_demo_12345",
        status: "processing",
        progress: 65,
        current_stage: "mesh_generation",
        artifacts: []
      }
    },
    {
      id: "3",
      method: "GET", 
      endpoint: "/v1/jobs/job_demo_12345/status",
      status: 200,
      duration: 195,
      timestamp: new Date(baseTime - 1000).toISOString(),
      response: {
        job_id: "job_demo_12345",
        status: "completed",
        progress: 100,
        current_stage: "export",
        artifacts: [
          {
            type: "model_glb",
            url: "https://assets.lidvizion.com/job_demo_12345/model.glb",
            size: "2.4 MB"
          },
          {
            type: "model_usdz", 
            url: "https://assets.lidvizion.com/job_demo_12345/model.usdz",
            size: "3.1 MB"
          },
          {
            type: "preview_image",
            url: "https://assets.lidvizion.com/job_demo_12345/preview.jpg",
            size: "256 KB"
          }
        ],
        metrics: {
          vertices: 15432,
          triangles: 28764,
          processing_time: 8.7,
          quality_score: 0.89
        }
      }
    }
  ];
};

export const simulateProcessing = (
  stages: PipelineStage[],
  onStageUpdate: (stages: PipelineStage[], currentStage: number) => void,
  onComplete: (artifacts: any) => void
) => {
  let currentStageIndex = 0;
  let progress = 0;
  
  const interval = setInterval(() => {
    if (currentStageIndex >= stages.length) {
      clearInterval(interval);
      onComplete({
        modelUrl: sampleGLBUrls.text,
        metrics: {
          vertices: 15432,
          triangles: 28764,
          size: "2.4 MB",
          format: "GLB"
        }
      });
      return;
    }

    const updatedStages = [...stages];
    const currentStage = updatedStages[currentStageIndex];
    
    if (currentStage.status === "pending") {
      currentStage.status = "running";
      currentStage.progress = 0;
      currentStage.details = `Processing ${currentStage.name.toLowerCase()}...`;
    } else if (currentStage.status === "running") {
      progress += Math.random() * 25 + 10;
      currentStage.progress = Math.min(progress, 100);
      
      if (currentStage.progress >= 100) {
        currentStage.status = "completed";
        currentStage.duration = Math.floor(Math.random() * 5 + 2);
        currentStage.details = `${currentStage.name} completed successfully`;
        currentStageIndex++;
        progress = 0;
      }
    }
    
    onStageUpdate(updatedStages, currentStageIndex);
  }, 1000);
  
  return interval;
};