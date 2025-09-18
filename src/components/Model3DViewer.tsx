'use client';

import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { Eye, EyeOff, Grid3X3, Download } from 'lucide-react';

interface Model3DViewerProps {
  modelUrl?: string;
  className?: string;
  onDownload?: () => void;
}

// Placeholder 3D model component when no model is loaded
function PlaceholderModel() {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#3b82f6" 
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

// Placeholder GLB model component (for demo purposes)
function GLBModel({ url }: { url: string }) {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Placeholder model - in a real app, this would load the actual GLB */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1, 0.4, 16, 32]} />
        <meshStandardMaterial 
          color="#10b981" 
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

export default function Model3DViewer({ modelUrl, className = '', onDownload }: Model3DViewerProps) {
  const [wireframe, setWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  return (
    <div className={`card relative group ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">3D Preview</h2>
            <p className="text-sm text-gray-600">Interactive model viewer</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-3 rounded-xl transition-all duration-200 ${
              wireframe 
                ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-md' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-blue-600 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md'
            }`}
            title={wireframe ? 'Solid view' : 'Wireframe view'}
          >
            {wireframe ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-3 rounded-xl transition-all duration-200 ${
              showGrid 
                ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-md' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-purple-600 border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md'
            }`}
            title={showGrid ? 'Hide grid' : 'Show grid'}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>

          {onDownload && (
            <>
              <div className="h-6 w-px bg-gray-300 mx-1" />
              <button
                onClick={onDownload}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download GLB
              </button>
            </>
          )}
        </div>
      </div>

      <div className="relative w-full h-96 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-2xl overflow-hidden shadow-inner border border-gray-200/50">
        <Canvas 
          shadows
          camera={{ position: [5, 5, 5], fov: 50 }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />

          {showGrid && (
            <gridHelper args={[10, 10, '#9ca3af', '#e5e7eb']} position={[0, -2, 0]} />
          )}

          {modelUrl ? (
            <GLBModel url={modelUrl} />
          ) : (
            <PlaceholderModel />
          )}
        </Canvas>

        {!modelUrl && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-2 bg-white bg-opacity-90 p-6 rounded-lg">
              <div className="w-12 h-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No 3D model generated yet</p>
              <p className="text-sm text-gray-500">Enter a prompt or upload images to get started</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="font-medium">🖱️ Click and drag to rotate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="font-medium">🔍 Scroll to zoom</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 bg-white/60 px-3 py-1 rounded-full border border-gray-200">
          ⚡ Interactive 3D Viewer
        </div>
      </div>
    </div>
  );
}