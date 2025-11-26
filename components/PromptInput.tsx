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
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="prompt" className="block text-sm font-semibold text-slate-700">
          描述新背景
        </label>
        <button
          onClick={onOptimize}
          disabled={isLoading || isOptimizing || !prompt.trim()}
          className="text-xs font-bold text-indigo-500 hover:text-indigo-600 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors flex items-center bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 hover:bg-indigo-100"
        >
          {isOptimizing ? (
            <>
              <svg className="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              优化中...
            </>
          ) : (
            '✨ 智能优化'
          )}
        </button>
      </div>
      <div className="relative">
        <textarea
            id="prompt"
            name="prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading || isOptimizing}
            className="block w-full text-sm rounded-xl border-0 bg-slate-50 p-3 shadow-inner ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 disabled:bg-slate-100 transition-all resize-none"
            placeholder="例如：在日落时的沙滩上，光线温暖..."
        />
        <div className="absolute bottom-2 right-2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
        </div>
      </div>
    </div>
  );
};