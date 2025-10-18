import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
  onOptimize: () => void;
  isOptimizing: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, isLoading, onOptimize, isOptimizing }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label htmlFor="prompt" className="block text-sm font-medium text-slate-700">
          描述新背景
        </label>
        <button
          onClick={onOptimize}
          disabled={isLoading || isOptimizing || !prompt.trim()}
          className="text-xs font-bold text-sky-600 hover:text-sky-500 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {isOptimizing ? (
            <>
              <svg className="animate-spin -ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              优化中...
            </>
          ) : (
            '✨ 优化背景描述'
          )}
        </button>
      </div>
      <textarea
        id="prompt"
        name="prompt"
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isLoading || isOptimizing}
        className="block w-full sm:text-sm border-2 border-slate-800 rounded-lg bg-white p-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-200 text-slate-900 placeholder:text-slate-400"
        placeholder="例如：在日落时的沙滩上"
      />
    </div>
  );
};