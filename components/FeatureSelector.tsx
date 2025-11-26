import React from 'react';
import type { Feature } from '../types';
import { FEATURE_CONFIG } from '../constants';

interface FeatureSelectorProps {
  selectedFeature: Feature;
  onSelectFeature: (feature: Feature) => void;
}

export const FeatureSelector: React.FC<FeatureSelectorProps> = ({ selectedFeature, onSelectFeature }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(FEATURE_CONFIG).map(([key, config]) => {
        const featureKey = key as Feature;
        const isSelected = selectedFeature === featureKey;
        return (
          <button
            key={featureKey}
            onClick={() => onSelectFeature(featureKey)}
            className={`
                relative p-6 rounded-3xl text-left transition-all duration-300 group
                border
                ${isSelected 
                    ? 'bg-white/80 border-indigo-200 shadow-[0_20px_40px_-12px_rgba(99,102,241,0.3)] ring-2 ring-indigo-400/50 scale-[1.02]' 
                    : 'bg-white/40 border-white/60 hover:bg-white/60 hover:shadow-lg hover:-translate-y-1'
                }
            `}
          >
            <div className={`
                absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl -mr-10 -mt-10 transition-opacity
                ${isSelected ? 'opacity-100' : 'opacity-0'}
            `} />
            
            <div className="flex items-center mb-3 relative z-10">
              <div className={`
                p-3 rounded-2xl shadow-sm transition-colors duration-300
                ${isSelected 
                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-300' 
                    : 'bg-white text-slate-400 group-hover:text-indigo-500'
                }
              `}>
                <div className="w-6 h-6">
                    {config.icon}
                </div>
              </div>
              <h3 className={`ml-4 text-lg font-bold transition-colors ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>
                {config.name}
              </h3>
            </div>
            <p className={`text-sm leading-relaxed relative z-10 ${isSelected ? 'text-slate-600' : 'text-slate-500'}`}>
              {config.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};