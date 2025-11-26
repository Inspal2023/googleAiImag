import React from 'react';
import type { LineArtType, DetailLevel, LineStyle } from '../types';

interface LineArtSettingsProps {
  lineArtType: LineArtType;
  setLineArtType: (type: LineArtType) => void;
  detailLevel: DetailLevel;
  setDetailLevel: (level: DetailLevel) => void;
  lineStyle: LineStyle;
  setLineStyle: (style: LineStyle) => void;
  disabled: boolean;
}

export const LineArtSettings: React.FC<LineArtSettingsProps> = ({
  lineArtType, setLineArtType,
  detailLevel, setDetailLevel,
  lineStyle, setLineStyle,
  disabled
}) => {
    
    const typeOptions: {id: LineArtType; name: string}[] = [
        { id: 'engineering', name: '工程制图' },
        { id: 'concept', name: '概念草图' }
    ];

    const detailOptions: {id: DetailLevel; name: string}[] = [
        { id: 'low', name: '低' },
        { id: 'medium', name: '中' },
        { id: 'high', name: '高' }
    ];
    
    const styleOptions: {id: LineStyle; name: string}[] = [
        { id: 'minimalist', name: '极简' },
        { id: 'technical', name: '技术' },
        { id: 'artistic', name: '艺术' }
    ];

    const renderOptionGroup = <T extends string>(
        label: string, 
        options: {id: T, name: string}[], 
        currentValue: T, 
        onChange: (val: T) => void
    ) => (
        <div className="mb-5 last:mb-0">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onChange(opt.id)}
                        disabled={disabled}
                        className={`
                            flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                            ${
                            currentValue === opt.id
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                            } 
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {opt.name}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-white/50 border border-white/60 p-5 rounded-2xl shadow-sm backdrop-blur-sm">
            {renderOptionGroup('类型', typeOptions, lineArtType, setLineArtType)}
            {renderOptionGroup('细节程度', detailOptions, detailLevel, setDetailLevel)}
            {renderOptionGroup('风格', styleOptions, lineStyle, setLineStyle)}
        </div>
    );
};