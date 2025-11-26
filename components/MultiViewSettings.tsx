import React from 'react';
import type { MultiViewMode, ViewPitch, ViewYaw } from '../types';

interface MultiViewSettingsProps {
  mode: MultiViewMode;
  setMode: (mode: MultiViewMode) => void;
  pitch: ViewPitch;
  setPitch: (pitch: ViewPitch) => void;
  yaw: ViewYaw;
  setYaw: (yaw: ViewYaw) => void;
  disabled: boolean;
}

export const MultiViewSettings: React.FC<MultiViewSettingsProps> = ({
  mode, setMode,
  pitch, setPitch,
  yaw, setYaw,
  disabled
}) => {

    const pitchOptions: ViewPitch[] = [-90, -60, -30, 0];
    const yawOptions: ViewYaw[] = [0, 30, 60, 90];

    const getPitchLabel = (val: ViewPitch) => {
        if (val === 0) return '0° 平视';
        if (val === -90) return '-90° 顶视';
        return `${val}° 俯视`;
    };

    const getYawLabel = (val: ViewYaw) => {
        if (val === 0) return '0° 正面';
        if (val === 90) return '90° 侧面';
        return `${val}°`;
    };

    return (
        <div className="bg-white/50 border border-white/60 p-5 rounded-2xl shadow-sm backdrop-blur-sm space-y-5">
            {/* Mode Selection */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">视图模式</label>
                <div className="flex space-x-2 bg-slate-100/50 p-1 rounded-xl border border-slate-200">
                    <button
                        onClick={() => setMode('three-view')}
                        disabled={disabled}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            mode === 'three-view'
                                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                                : 'text-slate-500 hover:bg-slate-200/50'
                        }`}
                    >
                        标准三视图
                    </button>
                    <button
                        onClick={() => setMode('free-perspective')}
                        disabled={disabled}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            mode === 'free-perspective'
                                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                                : 'text-slate-500 hover:bg-slate-200/50'
                        }`}
                    >
                        自由视角
                    </button>
                </div>
            </div>

            {/* Free Perspective Options */}
            {mode === 'free-perspective' && (
                <div className="animate-fade-in space-y-4 pt-4 border-t border-slate-200/60">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            垂直角度 (俯视)
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {pitchOptions.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPitch(p)}
                                    disabled={disabled}
                                    title={getPitchLabel(p)}
                                    className={`flex items-center justify-center py-2 text-xs font-bold rounded-lg border transition-all ${
                                        pitch === p
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600 ring-1 ring-indigo-200'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    {p}°
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            水平旋转 (顺时针)
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {yawOptions.map((y) => (
                                <button
                                    key={y}
                                    onClick={() => setYaw(y)}
                                    disabled={disabled}
                                    title={getYawLabel(y)}
                                    className={`flex items-center justify-center py-2 text-xs font-bold rounded-lg border transition-all ${
                                        yaw === y
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600 ring-1 ring-indigo-200'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    {y}°
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};