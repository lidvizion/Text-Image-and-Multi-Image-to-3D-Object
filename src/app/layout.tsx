import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 3D Generator - Text & Image to 3D Models',
  description: 'Transform text descriptions and images into stunning 3D models using advanced AI. Professional GLB export, real-time preview, and multi-view reconstruction.',
  keywords: ['3D generation', 'AI', 'NeRF', 'GLB', 'text to 3D', 'image to 3D', 'AI 3D models', 'mesh generation'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {children}
      </body>
    </html>
  )
}
