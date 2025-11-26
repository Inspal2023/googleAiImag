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
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-slate-700">{label}</label>
                <span className="text-xs font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded">
                    {(value * 100).toFixed(0)}%
                </span>
            </div>
            <div className="relative flex items-center">
                 <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-sky-300 to-sky-500" 
                        style={{ width: `${value * 100}%` }}
                    />
                 </div>
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
            <p className="text-xs text-slate-400 mt-1">
                融合参考图{label}特征的权重
            </p>
        </div>
    );

    return (
        <div className="bg-slate-50 p-4 rounded-lg border-2 border-slate-200 mt-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide border-b border-slate-200 pb-2">
                特征融合参数 (Feature Fusion)
            </h3>
            {renderSlider('结构 (Structure)', 'structure', params.structure)}
            {renderSlider('颜色 (Color)', 'color', params.color)}
            {renderSlider('材质 (Material)', 'material', params.material)}
        </div>
    );
};