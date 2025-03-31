'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  placeholder?: 'blur' | 'empty';
  quality?: number;
}

export function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  priority = false,
  className = '',
  placeholder = 'blur',
  quality = 80
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        placeholder={placeholder}
        quality={quality}
        onLoadingComplete={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
