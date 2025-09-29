
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { PromptControls } from './components/PromptControls';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { Header } from './components/Header';
import { editImage } from './services/geminiService';
import type { EditImageResult, UploadedImage } from './types';

export default function App() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (image: UploadedImage) => {
    setUploadedImage(image);
    setEditedImage(null);
    setResponseText(null);
    setError(null);
  };

  const handleEditRequest = useCallback(async (prompt: string) => {
    if (!uploadedImage || !prompt) {
      setError('Please upload an image and provide a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);
    setResponseText(null);

    try {
      const result: EditImageResult = await editImage(
        uploadedImage.base64,
        uploadedImage.mimeType,
        prompt
      );
      
      if (result.imageData) {
        setEditedImage(`data:${result.mimeType};base64,${result.imageData}`);
      }
      
      if(result.text) {
        setResponseText(result.text);
      }

      if (!result.imageData && !result.text) {
        setError('The AI did not return an image or text. Try a different prompt.');
      }

    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage]);
  
  const handleStartOver = () => {
    setUploadedImage(null);
    setEditedImage(null);
    setResponseText(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="container mx-auto px-4 py-8">
        <Header />
        
        {!uploadedImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="flex flex-col gap-8">
            <ImageDisplay
              originalSrc={uploadedImage.dataUrl}
              editedSrc={editedImage}
            />

            {error && <ErrorMessage message={error} />}

            {isLoading && (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-blue-300">Editing your image...</p>
                <p className="mt-2 text-sm text-gray-400">This may take a moment.</p>
              </div>
            )}
            
            {responseText && !isLoading && (
               <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-gray-300">{responseText}</p>
              </div>
            )}

            <PromptControls 
              isLoading={isLoading} 
              onSubmit={handleEditRequest} 
              onStartOver={handleStartOver}
            />
          </div>
        )}
        
      </main>
    </div>
  );
}
