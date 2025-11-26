import React from 'react';
import type { FusionParams } from '../types';

interface ProductFusionSettingsProps {
    params: FusionParams;
    setParams: (params: FusionParams) => void;
    disabled: boolean;
}

export const ProductFusionSettings: React.FC<ProductFusionSettingsProps> = ({ params, setParams, disabled }) => {
    
    const handleChange = (key: keyof FusionParams, value: number) => {
        setParams({ ...params, [key]: value });
    };

    const renderSlider = (label: string, key: keyof FusionParams, value: number) => (
        <div className="mb-5 last:mb-0 group">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-600">{label}</label>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {(value * 100).toFixed(0)}%
                </span>
            </div>
            <div className="relative flex items-center h-4">
                 <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div 
                        className="h-full bg-gradient-to-r from-indigo-300 to-indigo-500 transition-all duration-150" 
                        style={{ width: `${value * 100}%` }}
                    />
                 </div>
                 {/* Custom Thumb Style via absolute positioning element that tracks value */}
                 <div 
                    className="absolute h-5 w-5 bg-white border border-indigo-100 rounded-full shadow-md pointer-events-none transition-all duration-150"
                    style={{ left: `calc(${value * 100}% - 10px)` }}
                 />
                 
                 <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={value}
                    onChange={(e) => handleChange(key, parseFloat(e.target.value))}
                    disabled={disabled}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                />
            </div>
        </div>
    );

    return (
        <div className="bg-white/50 border border-white/60 p-5 rounded-2xl shadow-sm backdrop-blur-sm mt-6">
            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
                特征融合参数
            </h3>
            {renderSlider('结构 (Structure)', 'structure', params.structure)}
            {renderSlider('颜色 (Color)', 'color', params.color)}
            {renderSlider('材质 (Material)', 'material', params.material)}
        </div>
    );
};