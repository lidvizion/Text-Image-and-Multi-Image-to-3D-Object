'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X, Camera } from 'lucide-react';

interface ImageDropzoneProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  onGenerate: () => void;
  disabled?: boolean;
  maxImages?: number;
}

export default function ImageDropzone({ 
  images, 
  onImagesChange, 
  onGenerate, 
  disabled, 
  maxImages = 8 
}: ImageDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = [...images, ...acceptedFiles].slice(0, maxImages);
    onImagesChange(newImages);
  }, [images, onImagesChange, maxImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    disabled,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const getGenerationTypeText = () => {
    if (images.length === 1) return 'Single Image to 3D';
    if (images.length > 1) return 'Multi-Image to 3D';
    return 'Image to 3D';
  };

  return (
    <div className="card group">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="relative p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{getGenerationTypeText()}</h2>
          <p className="text-sm text-gray-600">
            {images.length === 0 ? 'Upload photos to reconstruct in 3D' : 
             images.length === 1 ? 'Single-view reconstruction' : 
             `Multi-view reconstruction with ${images.length} angles`}
          </p>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 group/dropzone ${
          isDragActive || dragActive
            ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 scale-[1.02] shadow-lg'
            : images.length > 0
            ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-md'
            : 'border-gray-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 hover:scale-[1.01] hover:shadow-md'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        {images.length === 0 ? (
          <div className="space-y-6">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-lg opacity-20 group-hover/dropzone:opacity-40 transition-opacity duration-300"></div>
              <div className="relative w-full h-full bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover/dropzone:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-purple-600 group-hover/dropzone:animate-bounce" />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 mb-3">
                Drop images here or click to upload
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Upload 1 image for single-view reconstruction or multiple images for better quality reconstruction
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">JPG</span>
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-medium">PNG</span>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">WebP</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">Max {maxImages} images</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{images.length}</span>
                </div>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">{images.length} image{images.length > 1 ? 's' : ''} selected</p>
                <p className="text-sm text-gray-600">Ready for 3D reconstruction</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
              💡 Drop more images here or click to add more (up to {maxImages} total)
            </p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gradient-to-r from-purple-200 to-pink-200">
            <div className="flex items-center gap-3 text-sm text-gray-600 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-xl border border-purple-100">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="font-medium">
                {images.length === 1 
                  ? '💡 Single image reconstruction - add more angles for better results'
                  : `💡 Multi-view reconstruction with ${images.length} angles for enhanced quality`
                }
              </span>
            </div>
            <button
              onClick={onGenerate}
              disabled={disabled}
              className="btn-primary flex items-center gap-3 min-w-fit"
            >
              <div className={`transition-transform duration-200 ${disabled ? '' : 'group-hover:scale-110'}`}>
                <Camera className="w-5 h-5" />
              </div>
              <span className="font-bold">Generate 3D Model</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
