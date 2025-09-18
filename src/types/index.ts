export interface GenerationMetrics {
  verts: number;
  faces: number;
  materials?: number;
  textures?: number;
}

export interface GenerationResponse {
  artifact: string;
  metrics: GenerationMetrics;
  thumbnail?: string;
  processing_time?: number;
  quality?: 'low' | 'medium' | 'high';
  file_size?: string;
}

export interface GenerationRequest {
  type: 'text' | 'single_image' | 'multi_image';
  prompt?: string;
  images?: File[];
  quality?: 'low' | 'medium' | 'high';
}

export interface AppManifest {
  name: string;
  slug: string;
  task: string;
  inputs: string[];
  outputs: string[];
}
