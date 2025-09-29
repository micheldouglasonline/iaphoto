
import React, { useState } from 'react';

interface PromptControlsProps {
  isLoading: boolean;
  onSubmit: (prompt: string) => void;
  onStartOver: () => void;
}

export const PromptControls: React.FC<PromptControlsProps> = ({ isLoading, onSubmit, onStartOver }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'add a birthday hat on the cat' or 'make the background a sunny beach'"
          className="w-full flex-grow p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
          rows={3}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      <button 
        onClick={onStartOver}
        disabled={isLoading}
        className="w-full sm:w-auto self-center px-6 py-2 font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors"
      >
        Start Over
      </button>
    </div>
  );
};
