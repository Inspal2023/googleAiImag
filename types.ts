import type React from 'react';

export type Feature = 'lineArt' | 'multiView' | 'backgroundChange';

export type BackgroundMode = 'prompt' | 'image' | 'hybrid';

export interface FeatureConfig {
  id: Feature;
  name: string;
  description: string;
  prompt: string;
  // FIX: Changed type from JSX.Element to React.ReactElement to fix "Cannot find namespace 'JSX'" error.
  icon: React.ReactElement;
}
