import type React from 'react';

export type Feature = 'lineArt' | 'multiView' | 'backgroundChange';

export type BackgroundMode = 'prompt' | 'image' | 'hybrid';

// Line Art Types
export type LineArtType = 'engineering' | 'concept';
export type DetailLevel = 'low' | 'medium' | 'high';
export type LineStyle = 'minimalist' | 'technical' | 'artistic';

// New Multi-View Types
export type MultiViewMode = 'three-view' | 'free-perspective';
export type ViewPitch = -90 | -60 | -30 | 0; // Removed positive values (30, 60, 90)
export type ViewYaw = 0 | 30 | 60 | 90; // Limited to 90

// Scene Fusion / Product Fusion Types
export interface FusionParams {
  structure: number; // 0-1
  color: number;     // 0-1
  material: number;  // 0-1
}

export interface FeatureConfig {
  id: Feature;
  name: string;
  description: string;
  prompt: string;
  icon: React.ReactElement;
}