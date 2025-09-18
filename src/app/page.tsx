'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle, Sparkles, Zap, RotateCcw } from 'lucide-react';

import PromptInput from '@/components/PromptInput';
import ImageDropzone from '@/components/ImageDropzone';
import Model3DViewer from '@/components/Model3DViewer';
import MetricsChips from '@/components/MetricsChips';
import CustomLogo from '@/components/CustomLogo';

import { generateModel, downloadBlob, APIError } from '@/lib/api';
import { GenerationResponse } from '@/types';

type GenerationState = 'idle' | 'generating' | 'success' | 'error';

export default function Home() {
  // Input states
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  
  // Generation states
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const handleTextGeneration = async () => {
    if (!prompt.trim()) return;
    
    setGenerationState('generating');
    setError('');
    setProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 90));
    }, 200);

    try {
      const response = await generateModel({
        type: 'text',
        prompt: prompt.trim(),
        quality: 'high'
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setResult(response);
        setGenerationState('success');
      }, 500);
      
    } catch (err) {
      clearInterval(progressInterval);
      setGenerationState('error');
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleImageGeneration = async () => {
    if (images.length === 0) return;
    
    setGenerationState('generating');
    setError('');
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 12, 90));
    }, 300);

    try {
      const response = await generateModel({
        type: images.length === 1 ? 'single_image' : 'multi_image',
        images,
        quality: 'high'
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setResult(response);
        setGenerationState('success');
      }, 500);
      
    } catch (err) {
      clearInterval(progressInterval);
      setGenerationState('error');
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    
    try {
      // In a real app, this would download the actual GLB file
      // For now, we'll simulate downloading the mock response
      const mockGLBContent = JSON.stringify(result, null, 2);
      const blob = new Blob([mockGLBContent], { type: 'application/json' });
      downloadBlob(blob, `generated_model_${Date.now()}.json`);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const resetGeneration = () => {
    setGenerationState('idle');
    setResult(null);
    setError('');
    setProgress(0);
  };

  const isGenerating = generationState === 'generating';
  const hasResult = generationState === 'success' && result;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl floating-element"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl floating-element" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative inline-block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-violet-600 rounded-3xl blur-xl opacity-40 animate-pulse-glow"></div>
              <div className="relative">
                <CustomLogo size="xl" animate={true} />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-shadow"
            >
              <span className="gradient-text">AI-Powered</span>
              <br />
              <span className="text-gray-800">3D Generation</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium"
            >
              Transform your <span className="text-blue-600 font-semibold">text descriptions</span> and <span className="text-purple-600 font-semibold">images</span> into 
              stunning 3D models using cutting-edge AI technology
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Real-time Generation</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>GLB Export Ready</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Professional Quality</span>
              </div>
            </motion.div>
          </div>

          {/* Tab Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="glass-card p-2 backdrop-blur-xl">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'text'
                      ? 'tab-active text-white shadow-glow'
                      : 'tab-inactive'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeTab === 'text' ? 'bg-white/20' : 'bg-blue-100'}`}>
                      <Sparkles className={`w-5 h-5 ${activeTab === 'text' ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Text to 3D</div>
                      <div className={`text-xs ${activeTab === 'text' ? 'text-white/80' : 'text-gray-500'}`}>
                        Describe your vision
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('image')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'image'
                      ? 'tab-active text-white shadow-glow'
                      : 'tab-inactive'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeTab === 'image' ? 'bg-white/20' : 'bg-purple-100'}`}>
                      <Zap className={`w-5 h-5 ${activeTab === 'image' ? 'text-white' : 'text-purple-600'}`} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Image to 3D</div>
                      <div className={`text-xs ${activeTab === 'image' ? 'text-white/80' : 'text-gray-500'}`}>
                        Upload your photos
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* Left Column - Input */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="space-y-8"
            >
            <AnimatePresence mode="wait">
              {activeTab === 'text' ? (
                <motion.div
                  key="text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <PromptInput
                    value={prompt}
                    onChange={setPrompt}
                    onGenerate={handleTextGeneration}
                    disabled={isGenerating}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ImageDropzone
                    images={images}
                    onImagesChange={setImages}
                    onGenerate={handleImageGeneration}
                    disabled={isGenerating}
                  />
                </motion.div>
              )}
            </AnimatePresence>

              {/* Generation Status */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative overflow-hidden"
                  >
                    <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl"></div>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl animate-pulse-glow opacity-50"></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">Generating 3D Model</h3>
                          <p className="text-sm text-gray-600">AI is creating your masterpiece...</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-semibold text-gray-700">Progress</span>
                          <span className="font-bold text-blue-600">{Math.round(progress)}%</span>
                        </div>
                        
                        <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <p className="text-sm font-medium text-gray-700">
                            {progress < 30 && '🔍 Analyzing your input...'}
                            {progress >= 30 && progress < 60 && '⚙️ Processing geometry...'}
                            {progress >= 60 && progress < 90 && '🎨 Generating mesh...'}
                            {progress >= 90 && '✨ Finalizing your model...'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {generationState === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative overflow-hidden"
                  >
                    <div className="card bg-gradient-to-br from-red-50 to-rose-50 border-red-200/50">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-t-2xl"></div>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                          <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">Generation Failed</h3>
                          <p className="text-sm text-gray-600">Don't worry, let's try again!</p>
                        </div>
                      </div>
                      
                      <div className="bg-red-100/50 rounded-xl p-4 mb-6">
                        <p className="text-red-800 font-medium">{error}</p>
                      </div>
                      
                      <button
                        onClick={resetGeneration}
                        className="btn-secondary w-full"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <RotateCcw className="w-4 h-4" />
                          Try Again
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}

                {hasResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="relative overflow-hidden"
                  >
                    <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-2xl"></div>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">Generation Complete! 🎉</h3>
                          <p className="text-sm text-gray-600">Your 3D model is ready to download</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <MetricsChips 
                          metrics={result.metrics}
                          processingTime={result.processing_time}
                          fileSize={result.file_size}
                          className="gap-3"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-green-200/50">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-semibold text-gray-700">
                            Quality: <span className="text-green-600 capitalize">{result.quality}</span>
                          </span>
                        </div>
                        <button
                          onClick={resetGeneration}
                          className="btn-secondary text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Create Another
                          </div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.div>

            {/* Right Column - 3D Viewer */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <Model3DViewer 
                modelUrl={hasResult ? '/mock/sample_model.glb' : undefined}
                onDownload={hasResult ? handleDownload : undefined}
              />
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          >
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="card-hover text-center group"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Text to 3D</h3>
              <p className="text-gray-600 leading-relaxed">
                Transform detailed descriptions into stunning 3D models with AI-powered generation. 
                Just describe what you envision!
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="card-hover text-center group"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Image Reconstruction</h3>
              <p className="text-gray-600 leading-relaxed">
                Convert single images or multi-view photos into detailed 3D meshes. 
                Upload your photos and watch them come to life!
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="card-hover text-center group"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">GLB Export</h3>
              <p className="text-gray-600 leading-relaxed">
                Download production-ready GLB files compatible with all major 3D applications. 
                Ready for games, AR/VR, and more!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
