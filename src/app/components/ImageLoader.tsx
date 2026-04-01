import React, { useState } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

interface ImageLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageClassName?: string;
  containerClassName?: string;
}

export function ImageLoader({
  src,
  alt,
  imageClassName,
  containerClassName,
  ...rest
}: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [didError, setDidError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setDidError(true);
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${containerClassName || ""}`}
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      )}

      {/* Error State */}
      {didError ? (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <img
            src={ERROR_IMG_SRC}
            alt="Error loading image"
            className="h-12 w-12 opacity-30"
            data-original-url={src}
          />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover ${imageClassName || ""}`}
          {...rest}
        />
      )}
    </div>
  );
}
