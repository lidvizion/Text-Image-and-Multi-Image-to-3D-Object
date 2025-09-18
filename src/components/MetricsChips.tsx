'use client';

import { GenerationMetrics } from '@/types';
import { BarChart3, Triangle, Palette, Image, Clock, HardDrive } from 'lucide-react';

interface MetricsChipsProps {
  metrics: GenerationMetrics;
  processingTime?: number;
  fileSize?: string;
  className?: string;
}

export default function MetricsChips({ metrics, processingTime, fileSize, className = '' }: MetricsChipsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const chips = [
    {
      icon: BarChart3,
      label: 'Vertices',
      value: formatNumber(metrics.verts),
      color: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200/50'
    },
    {
      icon: Triangle,
      label: 'Faces',
      value: formatNumber(metrics.faces),
      color: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200/50'
    }
  ];

  if (metrics.materials) {
    chips.push({
      icon: Palette,
      label: 'Materials',
      value: metrics.materials.toString(),
      color: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200/50'
    });
  }

  if (metrics.textures) {
    chips.push({
      icon: Image,
      label: 'Textures',
      value: metrics.textures.toString(),
      color: 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200/50'
    });
  }

  if (processingTime) {
    chips.push({
      icon: Clock,
      label: 'Processing',
      value: `${processingTime}s`,
      color: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200/50'
    });
  }

  if (fileSize) {
    chips.push({
      icon: HardDrive,
      label: 'File Size',
      value: fileSize,
      color: 'bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-800 border-indigo-200/50'
    });
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {chips.map((chip, index) => {
        const Icon = chip.icon;
        return (
          <div
            key={index}
            className={`inline-flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold ${chip.color} shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 border`}
          >
            <div className="p-1.5 bg-white/50 rounded-lg">
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium opacity-80 leading-none">{chip.label}</span>
              <span className="font-bold text-base leading-none mt-0.5">{chip.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
