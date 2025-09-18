'use client';

import { useState } from 'react';
import { Type, Sparkles } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  disabled?: boolean;
}

export default function PromptInput({ value, onChange, onGenerate, disabled }: PromptInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onGenerate();
    }
  };

  return (
    <div className="card group">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="relative p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
            <Type className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Text to 3D Generation</h2>
          <p className="text-sm text-gray-600">Describe your vision in natural language</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group/textarea">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe the 3D object you want to create... (e.g., 'A modern wooden chair with metal legs and blue cushions' or 'A fantasy dragon with spread wings and detailed scales')"
            className={`w-full px-6 py-4 border-2 rounded-2xl resize-none transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium ${
              isFocused 
                ? 'border-blue-500 ring-4 ring-blue-100/50 shadow-lg transform scale-[1.01]' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} focus:outline-none`}
            rows={5}
            disabled={disabled}
            maxLength={500}
          />
          <div className={`absolute bottom-4 right-6 text-xs font-medium transition-colors duration-200 ${
            value.length > 450 ? 'text-amber-600' : 
            value.length > 400 ? 'text-blue-600' : 'text-gray-400'
          }`}>
            {value.length}/500
          </div>
          
          {/* Floating label effect */}
          {isFocused && (
            <div className="absolute -top-2 left-4 bg-white px-2 text-xs font-semibold text-blue-600 animate-fade-in">
              ✨ Describe your 3D vision
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-600 bg-blue-50/50 px-4 py-2 rounded-xl border border-blue-100">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="font-medium">💡 Be specific about materials, colors, and style for better results</span>
          </div>
          
          <button
            type="submit"
            disabled={!value.trim() || disabled}
            className="btn-primary flex items-center gap-3 min-w-fit"
          >
            <div className={`transition-transform duration-200 ${disabled || !value.trim() ? '' : 'group-hover:rotate-12'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold">Generate 3D Model</span>
          </button>
        </div>
      </form>
    </div>
  );
}
