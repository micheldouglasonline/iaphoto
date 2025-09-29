
import React from 'react';

interface ImageDisplayProps {
  originalSrc: string | null;
  editedSrc: string | null;
}

const ImageCard: React.FC<{ src: string | null; title: string; placeholder: boolean }> = ({ src, title, placeholder }) => {
  return (
    <div className="flex-1 flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-lg border border-gray-700 min-w-0">
      <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
      <div className="w-full aspect-square rounded-md bg-gray-900 flex items-center justify-center overflow-hidden">
        {src ? (
          <img src={src} alt={title} className="w-full h-full object-contain" />
        ) : placeholder ? (
            <div className="text-gray-500">Your edited image will appear here</div>
        ) : null}
      </div>
    </div>
  );
};


export const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalSrc, editedSrc }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
      <ImageCard src={originalSrc} title="Original" placeholder={false} />
      <ImageCard src={editedSrc} title="Edited" placeholder={true} />
    </div>
  );
};
