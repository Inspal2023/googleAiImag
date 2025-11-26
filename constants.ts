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
    hybrid: '' // Dynamic prompt generation logic is now handled in geminiService.ts
};

export const LINE_ART_OPTS = {
    types: {
        engineering: '严格的工程制图风格，强调结构准确性、透视和比例。适用于技术手册或专利图。',
        concept: '概念设计草图风格，强调形式感、流畅的线条和设计意图。适用于设计作品集或创意展示。'
    },
    details: {
        low: '低细节：仅保留最主要的外轮廓，忽略微小纹理和装饰，画面简洁。',
        medium: '中等细节：平衡轮廓和主要内部特征，清晰表达产品结构。',
        high: '高细节：包含丰富的纹理、材质表现和复杂的内部结构，画面精致复杂。'
    },
    styles: {
        minimalist: '极简主义风格：线条干净利落，无多余装饰，使用单一线重，留白丰富。',
        technical: '技术风格：线条精确、克制，类似CAD绘图或蓝图，线条清晰明确。',
        artistic: '艺术风格：线条富有表现力，线重变化丰富（粗细变化），模拟手绘墨线质感。'
    }
};

export const MULTI_VIEW_OPTS = {
    pitch: {
        '-90': '顶视图 (Top View) - 垂直俯视',
        '-60': '高角度俯视 (High Angle) - 60度',
        '-30': '高角度俯视 (High Angle) - 30度',
        '0': '平视 (Eye Level) - 0度'
    },
    yaw: {
        '0': '正面 (Front View) - 0度',
        '30': '右前侧 (Front-Right) - 30度',
        '60': '右前侧 (Front-Right) - 60度',
        '90': '右侧面 (Right Profile) - 90度'
    }
};

export const FEATURE_CONFIG: Record<Feature, Omit<FeatureConfig, 'id'>> = {
  lineArt: {
    name: '线稿图',
    description: '将产品照片转换为线稿图，支持工程/概念模式及多维度自定义。',
    prompt: '将此产品图片转换为简洁的黑白线稿图。输出应适用于涂色书或技术插图，重点关注主要轮廓和基本细节。背景必须是纯白色。',
    icon: React.createElement(LineArtIcon),
  },
  multiView: {
    name: '多角度视图',
    description: '生成标准三视图或自定义自由视角的透视变换。',
    prompt: '生成该产品的标准工业设计三视图 (Three-View Drawing)。\n要求：\n1. 必须包含三个独立视角：俯视图 (Top View)、侧视图 (Side View) 和正视图 (Front View)。\n2. 俯视图必须展示产品顶部的所有细节。\n3. 使用正交投影 (Orthographic Projection)，无透视变形。\n4. 三个视图应在同一张画布上整齐排列，比例一致，背景为纯白或浅灰。',
    icon: React.createElement(MultiViewIcon),
  },
  backgroundChange: {
    name: '场景融合',
    description: '场景合成或特征融合。使用混合模式将不同产品的结构、材质进行创意融合。',
    prompt: BACKGROUND_PROMPTS.prompt, // Default prompt
    icon: React.createElement(BackgroundIcon),
  },
};