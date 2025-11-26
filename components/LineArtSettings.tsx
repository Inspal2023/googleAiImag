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
        { id: 'engineering', name: '工程线稿图' },
        { id: 'concept', name: '概念线稿图' }
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
        <div className="mb-4 last:mb-0">
            <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onChange(opt.id)}
                        disabled={disabled}
                        className={`flex-1 min-w-[80px] px-3 py-2 text-sm font-semibold rounded-md border-2 transition-all duration-150 ${
                            currentValue === opt.id
                                ? 'bg-amber-100 border-slate-800 text-slate-800 shadow-[2px_2px_0px_#475569] -translate-y-[1px]'
                                : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0`}
                    >
                        {opt.name}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
            {renderOptionGroup('类型', typeOptions, lineArtType, setLineArtType)}
            {renderOptionGroup('细节程度', detailOptions, detailLevel, setDetailLevel)}
            {renderOptionGroup('风格', styleOptions, lineStyle, setLineStyle)}
        </div>
    );
};