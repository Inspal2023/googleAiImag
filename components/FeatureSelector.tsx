import React from 'react';
import type { Feature } from '../types';
import { FEATURE_CONFIG } from '../constants';

interface FeatureSelectorProps {
  selectedFeature: Feature;
  onSelectFeature: (feature: Feature) => void;
}

export const FeatureSelector: React.FC<FeatureSelectorProps> = ({ selectedFeature, onSelectFeature }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(FEATURE_CONFIG).map(([key, config]) => {
        const featureKey = key as Feature;
        const isSelected = selectedFeature === featureKey;
        return (
          <button
            key={featureKey}
            onClick={() => onSelectFeature(featureKey)}
            className={`p-6 rounded-lg text-left transition-all duration-200 border-2 border-slate-800 transform hover:-translate-y-1 ${
              isSelected
                ? 'bg-yellow-400 text-slate-800 shadow-[6px_6px_0px_#1e293b]'
                : 'bg-white hover:bg-amber-100 shadow-[4px_4px_0px_#475569]'
            }`}
          >
            <div className="flex items-center mb-2">
              <div className={`p-2 rounded-full ${isSelected ? 'bg-white' : 'bg-sky-100'}`}>
                <div className={`text-sky-600`}>
                    {config.icon}
                </div>
              </div>
              <h3 className="ml-4 text-lg font-bold">{config.name}</h3>
            </div>
            <p className={`text-sm ${isSelected ? 'text-slate-700' : 'text-slate-600'}`}>
              {config.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};