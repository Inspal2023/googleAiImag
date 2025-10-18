import React from 'react';
import type { BackgroundMode } from '../types';

interface BackgroundModeSelectorProps {
  selectedMode: BackgroundMode;
  onSelectMode: (mode: BackgroundMode) => void;
  disabled: boolean;
}

const modes: { id: BackgroundMode; name: string }[] = [
  { id: 'prompt', name: '文字描述' },
  { id: 'image', name: '上传背景' },
  { id: 'hybrid', name: '混合模式' },
];

export const BackgroundModeSelector: React.FC<BackgroundModeSelectorProps> = ({ selectedMode, onSelectMode, disabled }) => {
  return (
    <div className="flex items-center justify-center space-x-2 rounded-lg bg-slate-200 border-2 border-slate-800 p-1 mb-4">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelectMode(mode.id)}
          disabled={disabled}
          className={`w-full px-3 py-2 text-sm font-semibold rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-200 focus:ring-sky-500 ${
            selectedMode === mode.id
              ? 'bg-white text-sky-600 shadow-[2px_2px_0px_#475569] border-0'
              : 'text-slate-600 hover:bg-slate-300'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {mode.name}
        </button>
      ))}
    </div>
  );
};