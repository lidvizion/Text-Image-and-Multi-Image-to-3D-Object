# 🧠 Text, Image, and Multi-Image to 3D Object Generator

A cutting-edge web application that generates 3D models from text descriptions, single images, or multi-view images using advanced AI techniques. Built with Next.js, React Three Fiber, and modern web technologies.

![3D Generation Demo](https://img.shields.io/badge/Demo-Live-green)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![React Three Fiber](https://img.shields.io/badge/R3F-8.15-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)

## ✨ Features

### 🎯 Core Capabilities
- **Text to 3D**: Generate 3D models from detailed text descriptions
- **Single Image to 3D**: Reconstruct 3D objects from a single photograph
- **Multi-Image to 3D**: Create detailed models from multiple viewing angles
- **GLB Export**: Download production-ready 3D files
- **Real-time Preview**: Interactive 3D viewer with orbit controls

### 🎨 UI Highlights
- Modern, responsive design with Tailwind CSS
- Drag-and-drop image upload with preview
- Interactive 3D viewer with wireframe toggle
- Real-time generation progress tracking
- Detailed metrics display (vertices, faces, materials)
- Smooth animations and transitions

### 🔧 Technical Features
- React Three Fiber 3D rendering
- Orbit controls and camera manipulation
- Grid overlay and lighting controls
- File size and processing time metrics
- Error handling and validation
- TypeScript for type safety

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser with WebGL support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Text-Image-and-Multi-Image-to-3D-Object.git
   cd Text-Image-and-Multi-Image-to-3D-Object
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_LV_API_URL=https://api.example.com
   NEXT_PUBLIC_LV_API_KEY=your_api_key_here
   NEXT_PUBLIC_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_REGION=us-east-1
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 💡 Usage

### Text to 3D Generation
1. Select the "Text to 3D" tab
2. Enter a detailed description of the object you want to create
3. Click "Generate 3D Model"
4. Wait for processing to complete
5. View the result in the 3D viewer
6. Download the GLB file

**Example prompts:**
- "A modern wooden chair with metal legs and blue cushions"
- "A fantasy dragon with spread wings and scales"
- "A vintage red sports car from the 1960s"

### Image to 3D Generation
1. Select the "Image to 3D" tab
2. Drag and drop images or click to upload
3. For best results, upload multiple angles of the same object
4. Click "Generate 3D Model"
5. Review the generated mesh in the viewer
6. Download the result

**Tips for better results:**
- Use clear, well-lit photos
- Include multiple viewing angles (front, side, back, top)
- Avoid cluttered backgrounds
- Keep the object centered in each image

## 🏗️ Architecture

### Project Structure
```
src/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   │   └── generate/      # 3D generation endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main application page
├── components/            # React components
│   ├── ImageDropzone.tsx  # Image upload component
│   ├── MetricsChips.tsx   # Metrics display
│   ├── Model3DViewer.tsx  # 3D viewer component
│   └── PromptInput.tsx    # Text input component
├── lib/                   # Utility libraries
│   └── api.ts            # API client functions
└── types/                 # TypeScript definitions
    └── index.ts          # Type definitions
```

### Key Technologies
- **Next.js 14**: React framework with app directory
- **React Three Fiber**: React renderer for Three.js
- **Three.js**: 3D graphics library
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Dropzone**: File upload handling
- **Lucide React**: Icon library

## 🔌 API Reference

### POST /api/generate
Generate a 3D model from text or images.

**Request:**
```typescript
FormData {
  type: 'text' | 'single_image' | multi_image'
  prompt?: string              // Required for text generation
  quality?: 'low' | 'medium' | 'high'
  image_0?: File              // Image files for image generation
  image_1?: File
  // ... up to image_7
}
```

**Response:**
```typescript
{
  artifact: string           // GLB filename
  metrics: {
    verts: number           // Vertex count
    faces: number           // Face count  
    materials?: number      // Material count
    textures?: number       // Texture count
  }
  thumbnail?: string        // Thumbnail URL
  processing_time?: number  // Processing time in seconds
  quality?: string         // Generation quality
  file_size?: string       // File size string
}
```

## 🎛️ Configuration

### Environment Variables
- `NEXT_PUBLIC_LV_API_URL`: API base URL for 3D generation service
- `NEXT_PUBLIC_LV_API_KEY`: API authentication key
- `NEXT_PUBLIC_STORAGE_BUCKET`: Cloud storage bucket for assets
- `NEXT_PUBLIC_REGION`: Cloud storage region

### Customization
The application can be customized by modifying:
- `tailwind.config.js`: Theme colors and styling
- `src/types/index.ts`: Type definitions
- `src/lib/api.ts`: API client configuration
- Component props and styling

## 🧪 Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Testing
```bash
# Run the application locally
npm run dev

# Test text generation
1. Enter a prompt like "A blue ceramic vase"
2. Click generate and verify the response
3. Check the 3D viewer loads correctly

# Test image generation  
1. Upload sample images from public/sample/
2. Verify multi-image handling
3. Test the download functionality
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) for 3D graphics
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for React integration
- [Next.js](https://nextjs.org/) for the application framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons

## 📞 Support

For support, email support@lidvizion.com or create an issue on GitHub.

---

**Built with ❤️ for the 3D generation community**
