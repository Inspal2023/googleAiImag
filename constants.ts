// FIX: Import React to enable JSX syntax for component definitions.
import React from 'react';
import type { Feature, FeatureConfig } from './types';

// FIX: Replaced JSX with React.createElement to be valid in a .ts file.
const LineArtIcon = () => React.createElement(
    'svg',
    { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" })
);

// FIX: Replaced JSX with React.createElement to be valid in a .ts file.
const MultiViewIcon = () => React.createElement(
    'svg',
    { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" })
);

// FIX: Replaced JSX with React.createElement to be valid in a .ts file.
const BackgroundIcon = () => React.createElement(
    'svg',
    { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" })
);

export const BACKGROUND_PROMPTS = {
    prompt: '将图片中的产品真实地放置到一个新场景中。新背景应为：{{PROMPT}}。产品本身必须保持不变，但其光照和阴影应进行调整，以完美匹配新环境。不要添加任何文本或水印。',
    image: '你的任务是替换背景。第一张图片是主体产品，第二张图片是新的背景。请将主体产品无缝地放置到新背景中。必须保持产品本身不变，只调整光照和阴影以匹配新环境。',
    hybrid: '你的任务是替换背景。第一张图片是主体产品，第二张图片是新的背景。请将主体产品无缝地放置到新背景中。此外，请根据以下描述调整最终效果：{{PROMPT}}。必须保持产品本身不变，只调整光照和阴影以匹配新环境。'
};

export const FEATURE_CONFIG: Record<Feature, Omit<FeatureConfig, 'id'>> = {
  lineArt: {
    name: '线稿图',
    description: '将产品照片转换为简洁的线稿图。',
    prompt: '将此产品图片转换为简洁的黑白线稿图。输出应适用于涂色书或技术插图，重点关注主要轮廓和基本细节。背景必须是纯白色。',
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(LineArtIcon),
  },
  multiView: {
    name: '多角度视图',
    description: '从单张图片生成三视图示意图。',
    prompt: '根据这张产品图片，生成产品的标准三视图（正视图、侧视图和顶视图）。将这些视图清晰地排列在一张图片上，背景为干净、中性的浅灰色。',
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(MultiViewIcon),
  },
  backgroundChange: {
    name: '更换背景',
    description: '通过文字、图片或混合模式更换背景。',
    prompt: BACKGROUND_PROMPTS.prompt, // Default prompt
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    icon: React.createElement(BackgroundIcon),
  },
};