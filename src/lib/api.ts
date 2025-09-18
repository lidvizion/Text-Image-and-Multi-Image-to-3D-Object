import { GenerationRequest, GenerationResponse } from '@/types';

export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

export async function generateModel(request: GenerationRequest): Promise<GenerationResponse> {
  const formData = new FormData();
  
  formData.append('type', request.type);
  
  if (request.prompt) {
    formData.append('prompt', request.prompt);
  }
  
  if (request.quality) {
    formData.append('quality', request.quality);
  }
  
  if (request.images) {
    request.images.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });
  }

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or other errors
    throw new APIError('Failed to connect to the generation service');
  }
}

export async function downloadModel(filename: string): Promise<Blob> {
  try {
    const response = await fetch(`/api/download/${filename}`);
    
    if (!response.ok) {
      throw new APIError(`Failed to download model: ${response.statusText}`, response.status);
    }
    
    return await response.blob();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError('Failed to download model');
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
