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
        <div className="bg-slate-50 p-4 rounded-lg border-2 border-slate-200 space-y-4">
            {/* Mode Selection */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">视图模式</label>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setMode('three-view')}
                        disabled={disabled}
                        className={`flex-1 px-4 py-2 text-sm font-bold rounded-md border-2 transition-all ${
                            mode === 'three-view'
                                ? 'bg-amber-100 border-slate-800 text-slate-800 shadow-[2px_2px_0px_#475569] -translate-y-[1px]'
                                : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400'
                        }`}
                    >
                        标准三视图
                    </button>
                    <button
                        onClick={() => setMode('free-perspective')}
                        disabled={disabled}
                        className={`flex-1 px-4 py-2 text-sm font-bold rounded-md border-2 transition-all ${
                            mode === 'free-perspective'
                                ? 'bg-amber-100 border-slate-800 text-slate-800 shadow-[2px_2px_0px_#475569] -translate-y-[1px]'
                                : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400'
                        }`}
                    >
                        自由视角
                    </button>
                </div>
            </div>

            {/* Free Perspective Options */}
            {mode === 'free-perspective' && (
                <div className="animate-fade-in space-y-4 pt-2 border-t border-slate-200">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                            垂直角度 (俯视程度)
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {pitchOptions.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPitch(p)}
                                    disabled={disabled}
                                    title={getPitchLabel(p)}
                                    className={`flex items-center justify-center py-2 text-xs font-bold rounded border-2 transition-all ${
                                        pitch === p
                                            ? 'bg-sky-100 border-sky-600 text-sky-700 z-10 scale-110'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    {p}°
                                </button>
                            ))}
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-slate-400 px-1">
                            <span>顶视 (-90°)</span>
                            <span>平视 (0°)</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                            水平旋转 (顺时针)
                        </label>
                        <div className="grid grid-cols-4 gap-1">
                            {yawOptions.map((y) => (
                                <button
                                    key={y}
                                    onClick={() => setYaw(y)}
                                    disabled={disabled}
                                    title={getYawLabel(y)}
                                    className={`flex items-center justify-center py-2 text-xs font-bold rounded border-2 transition-all ${
                                        yaw === y
                                            ? 'bg-sky-100 border-sky-600 text-sky-700 z-10 scale-110'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    {y}°
                                </button>
                            ))}
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-slate-400 px-1">
                            <span>正面</span>
                            <span>侧面</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};