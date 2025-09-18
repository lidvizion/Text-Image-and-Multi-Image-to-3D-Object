import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GenerationResponse } from '@/types';

// Validation schemas
const GenerateSchema = z.object({
  type: z.enum(['text', 'single_image', 'multi_image']),
  prompt: z.string().max(500).optional(),
  quality: z.enum(['low', 'medium', 'high']).optional(),
});

const FileSchema = z.object({
  name: z.string(),
  type: z.enum(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  size: z.number().max(10 * 1024 * 1024), // 10MB max
});

// Simulate processing time based on generation type
function getProcessingTime(type: string, imageCount: number = 0): number {
  switch (type) {
    case 'text':
      return Math.random() * 3 + 2; // 2-5 seconds
    case 'single_image':
      return Math.random() * 2 + 1.5; // 1.5-3.5 seconds
    case 'multi_image':
      return Math.random() * 2 + 3 + (imageCount * 0.5); // 3-5+ seconds based on image count
    default:
      return 2;
  }
}

// Generate realistic metrics based on prompt/image complexity
function generateMetrics(type: string, prompt?: string, imageCount: number = 0): GenerationResponse['metrics'] {
  let baseVerts, baseFaces;
  
  // Simulate different complexity levels
  if (type === 'text') {
    // Text-based generation tends to be more detailed
    const complexity = prompt?.length || 50;
    baseVerts = Math.floor(8000 + (complexity * 100) + Math.random() * 5000);
    baseFaces = Math.floor(baseVerts * 1.8 + Math.random() * 2000);
  } else if (type === 'multi_image') {
    // Multi-image reconstruction can be very detailed
    baseVerts = Math.floor(15000 + (imageCount * 2000) + Math.random() * 8000);
    baseFaces = Math.floor(baseVerts * 2.1 + Math.random() * 3000);
  } else {
    // Single image reconstruction
    baseVerts = Math.floor(6000 + Math.random() * 4000);
    baseFaces = Math.floor(baseVerts * 1.9 + Math.random() * 2000);
  }

  return {
    verts: baseVerts,
    faces: baseFaces,
    materials: Math.floor(Math.random() * 4) + 1,
    textures: Math.floor(Math.random() * 3) + 1,
  };
}

// Generate file size based on complexity
function generateFileSize(verts: number): string {
  const baseSizeKB = Math.floor((verts / 1000) * 120 + Math.random() * 200);
  if (baseSizeKB > 1024) {
    return `${(baseSizeKB / 1024).toFixed(1)} MB`;
  }
  return `${baseSizeKB} KB`;
}

export async function POST(request: NextRequest) {
  try {
    // Check for idempotency key
    const idempotencyKey = request.headers.get('Idempotency-Key') || crypto.randomUUID();
    
    const formData = await request.formData();
    const type = formData.get('type') as string;
    const prompt = formData.get('prompt') as string;
    const quality = formData.get('quality') as string || 'medium';
    
    // Validate basic request data
    const validatedData = GenerateSchema.parse({
      type,
      prompt: prompt || undefined,
      quality,
    });

    // Get and validate image files
    const images: File[] = [];
    let imageIndex = 0;
    while (formData.get(`image_${imageIndex}`)) {
      const image = formData.get(`image_${imageIndex}`) as File;
      
      // Validate file type and size
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(image.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${image.type}. Only JPEG, PNG, and WebP are allowed.` },
          { status: 400 }
        );
      }
      
      if (image.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File too large: ${image.name}. Maximum size is 10MB.` },
          { status: 400 }
        );
      }
      
      images.push(image);
      imageIndex++;
    }

    // Validate business logic
    if (validatedData.type === 'text' && !validatedData.prompt) {
      return NextResponse.json(
        { error: 'Prompt is required for text generation' },
        { status: 400 }
      );
    }
    
    if ((validatedData.type === 'single_image' || validatedData.type === 'multi_image') && images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required for image generation' },
        { status: 400 }
      );
    }

    if (images.length > 8) {
      return NextResponse.json(
        { error: 'Maximum 8 images allowed' },
        { status: 400 }
      );
    }

    // Simulate processing time
    const processingTime = getProcessingTime(validatedData.type, images.length);
    await new Promise(resolve => setTimeout(resolve, processingTime * 1000));

    // Generate mock response
    const metrics = generateMetrics(validatedData.type, validatedData.prompt, images.length);
    const fileSize = generateFileSize(metrics.verts);

    const response: GenerationResponse = {
      artifact: 'sample_model.glb',
      metrics,
      thumbnail: '/mock/thumbnail.jpg',
      processing_time: processingTime,
      quality: validatedData.quality as 'low' | 'medium' | 'high',
      file_size: fileSize,
    };

    return NextResponse.json(response);
  } catch (error) {
    // Structured error logging
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: error.issues.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      );
    }
    
    // Log error for monitoring (in production, use proper logger)
    console.error('Generation error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: '3D Generation API',
    endpoints: {
      POST: '/api/generate - Generate 3D model from text or images'
    },
    supported_types: ['text', 'single_image', 'multi_image'],
    supported_formats: ['jpg', 'jpeg', 'png', 'webp'],
    max_images: 8
  });
}
