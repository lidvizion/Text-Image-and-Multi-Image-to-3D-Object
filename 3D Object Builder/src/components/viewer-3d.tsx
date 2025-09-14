import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { 
  OrbitControls, 
  Environment, 
  Grid, 
  ContactShadows,
  Html,
  useProgress,
  PerspectiveCamera
} from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Eye, 
  Layers,
  Ruler,
  Camera,
  Settings
} from "lucide-react";
import * as THREE from "three";

interface Model3DProps {
  url: string;
  wireframe?: boolean;
  scale?: number;
}

function Model3D({ url, wireframe = false, scale = 1 }: Model3DProps) {
  const gltf = useLoader(GLTFLoader, url);
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={meshRef} scale={scale}>
      <primitive 
        object={gltf.scene.clone()} 
        dispose={null}
      />
      {wireframe && (
        <wireframe 
          attach="material"
          color="white"
          transparent
          opacity={0.3}
        />
      )}
    </group>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-white">
        <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm">Loading 3D model... {Math.round(progress)}%</p>
      </div>
    </Html>
  );
}

interface Viewer3DProps {
  modelUrl?: string;
  isVisible: boolean;
  metrics?: {
    vertices: number;
    triangles: number;
    size: string;
    format: string;
  };
}

export function Viewer3D({ modelUrl, isVisible, metrics }: Viewer3DProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [exposure, setExposure] = useState([1]);
  const [environment, setEnvironment] = useState("studio");
  const [scale, setScale] = useState([1]);

  const environments = [
    { id: "studio", name: "Studio" },
    { id: "sunset", name: "Sunset" },
    { id: "dawn", name: "Dawn" },
    { id: "night", name: "Night" },
    { id: "warehouse", name: "Warehouse" }
  ];

  const handleExport = (format: string) => {
    // Mock export functionality for demo
    const link = document.createElement("a");
    link.href = modelUrl || "";
    link.download = `model.${format}`;
    link.click();
  };

  if (!isVisible) return null;

  return (
    <div className="border-t bg-background">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>3D Viewer</h3>
          {metrics && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {metrics.vertices.toLocaleString()} vertices
              </Badge>
              <Badge variant="outline">
                {metrics.triangles.toLocaleString()} triangles
              </Badge>
              <Badge variant="outline">
                {metrics.size}
              </Badge>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-6 h-96">
          <div className="col-span-3">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <Canvas
                  camera={{ position: [0, 0, 5], fov: 50 }}
                  style={{ background: "linear-gradient(to bottom, #1a1a1a, #2a2a2a)" }}
                >
                  <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                  
                  <Suspense fallback={<Loader />}>
                    {modelUrl && (
                      <Model3D 
                        url={modelUrl} 
                        wireframe={wireframe}
                        scale={scale[0]}
                      />
                    )}
                    
                    <Environment preset={environment} />
                    
                    {showGrid && (
                      <>
                        <Grid 
                          args={[10, 10]} 
                          cellSize={1} 
                          cellThickness={0.5} 
                          cellColor="#6f6f6f" 
                          sectionSize={5} 
                          sectionThickness={1} 
                          sectionColor="#9d4b4b" 
                          fadeDistance={20} 
                          fadeStrength={1} 
                          followCamera={false} 
                          infiniteGrid={true}
                        />
                        <ContactShadows 
                          position={[0, -1.4, 0]} 
                          opacity={0.4} 
                          scale={10} 
                          blur={2.5} 
                          far={4.5} 
                        />
                      </>
                    )}
                    
                    <OrbitControls 
                      autoRotate={autoRotate}
                      autoRotateSpeed={1}
                      enablePan={true}
                      enableZoom={true}
                      enableRotate={true}
                    />
                  </Suspense>
                  
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                  <pointLight position={[-10, -10, -10]} />
                </Canvas>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-rotate" className="text-xs">Auto Rotate</Label>
                  <Switch
                    id="auto-rotate"
                    checked={autoRotate}
                    onCheckedChange={setAutoRotate}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="wireframe" className="text-xs">Wireframe</Label>
                  <Switch
                    id="wireframe"
                    checked={wireframe}
                    onCheckedChange={setWireframe}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="grid" className="text-xs">Grid</Label>
                  <Switch
                    id="grid"
                    checked={showGrid}
                    onCheckedChange={setShowGrid}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-xs">Scale: {scale[0].toFixed(1)}x</Label>
                  <Slider
                    value={scale}
                    onValueChange={setScale}
                    max={3}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Exposure: {exposure[0].toFixed(1)}</Label>
                  <Slider
                    value={exposure}
                    onValueChange={setExposure}
                    max={3}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {["glb", "usdz", "obj", "ply"].map((format) => (
                  <Button
                    key={format}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => handleExport(format)}
                  >
                    <Download className="h-3 w-3 mr-2" />
                    Export {format.toUpperCase()}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}