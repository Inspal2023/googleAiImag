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
    <div className="bg-slate-100/50 p-1 rounded-xl flex space-x-1 border border-slate-200 shadow-inner">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelectMode(mode.id)}
          disabled={disabled}
          className={`
            flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200
            ${selectedMode === mode.id
              ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {mode.name}
        </button>
      ))}
    </div>
  );
};