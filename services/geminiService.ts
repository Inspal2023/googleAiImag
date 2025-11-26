import { GoogleGenAI, Modality } from "@google/genai";
import type { Feature, BackgroundMode, LineArtType, DetailLevel, LineStyle, MultiViewMode, ViewPitch, ViewYaw, FusionParams } from '../types';
import { FEATURE_CONFIG, BACKGROUND_PROMPTS, LINE_ART_OPTS, MULTI_VIEW_OPTS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to convert a File object to a GoogleGenerativeAI.Part
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // The result includes the Base64 prefix, so we need to remove it.
      const base64Data = (reader.result as string).split(',')[1];
      resolve(base64Data);
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

export const optimizePrompt = async (prompt: string): Promise<string> => {
    if (!prompt.trim()) {
        return prompt;
    }
    try {
        const systemInstruction = `你是一个富有创意的AI助手，专门为AI绘画工具优化用户输入的背景描述。你的任务是：
1.  理解用户的核心意图。
2.  将简单、模糊的描述变得更具体、生动、富有画面感。
3.  添加能提升图片质量的细节，如光线、氛围、材质、构图等。
4.  保持描述简洁、清晰，适合AI模型理解。
5.  仅返回优化后的描述文本，不要包含任何额外的解释或前缀，如“优化后的描述：”。

用户输入：${prompt}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: systemInstruction,
        });

        const optimizedText = response.text || '';
        return optimizedText.trim() || prompt;
    } catch (error) {
        console.error('Prompt Optimization Error:', error);
        // On failure, return the original prompt to avoid breaking the UI.
        return prompt;
    }
};


interface GenerateImageOptions {
    userPrompt?: string;
    backgroundImageFile?: File | null;
    backgroundMode?: BackgroundMode;
    lineArtType?: LineArtType;
    detailLevel?: DetailLevel;
    lineStyle?: LineStyle;
    multiViewMode?: MultiViewMode;
    viewPitch?: ViewPitch;
    viewYaw?: ViewYaw;
    fusionParams?: FusionParams;
}


export const generateImage = async (
    imageFile: File,
    feature: Feature,
    options: GenerateImageOptions = {}
): Promise<string> => {
    const { 
        userPrompt = '', 
        backgroundImageFile = null, 
        backgroundMode = 'prompt',
        lineArtType = 'engineering',
        detailLevel = 'medium',
        lineStyle = 'technical',
        multiViewMode = 'three-view',
        viewPitch = 0,
        viewYaw = 30,
        fusionParams = { structure: 0.5, color: 0.5, material: 0.5 }
    } = options;

    const sourceImagePart = await fileToGenerativePart(imageFile);
    const parts: any[] = [sourceImagePart];
    let textPrompt = '';

    if (feature === 'backgroundChange') {
        if (backgroundImageFile && (backgroundMode === 'image' || backgroundMode === 'hybrid')) {
            const backgroundImagePart = await fileToGenerativePart(backgroundImageFile);
            parts.push(backgroundImagePart);
        }

        switch (backgroundMode) {
            case 'image':
                textPrompt = BACKGROUND_PROMPTS.image;
                break;
            case 'hybrid':
                // New Product Fusion Logic
                textPrompt = `你是一位专业的高级工业设计师。
                任务：根据提供的两张图片，设计并生成一个新的产品图片。
                图片1：主体产品原型（提供基础形态）。
                图片2：参考特征对象（提供风格、结构或材质灵感）。
                
                请按照以下融合参数，将图片2的特征融合到图片1的产品中，生成一个全新的产品设计：
                
                融合参数 (0.0 - 1.0)：
                1. **结构/形态融合 (Structure Blending): ${fusionParams.structure}**
                   - 0.0: 完全保持图片1的形状。
                   - 1.0: 强烈改变图片1的形状，使其轮廓极其接近图片2。
                   - 当前权重 (${fusionParams.structure}): 请据此调整产品的整体几何造型。
                   
                2. **颜色/色调融合 (Color Blending): ${fusionParams.color}**
                   - 0.0: 保持图片1的原有配色。
                   - 1.0: 完全采用图片2的配色方案。
                   - 当前权重 (${fusionParams.color}): 请据此重新定义产品的色彩分布。
                   
                3. **材质/纹理融合 (Material Blending): ${fusionParams.material}**
                   - 0.0: 保持图片1的原有材质。
                   - 1.0: 完全应用图片2的表面材质和纹理处理。
                   - 当前权重 (${fusionParams.material}): 请据此渲染产品的表面质感。

                输出要求：
                - 生成一张高分辨率、真实感强的产品摄影图。
                - 背景保持干净或适应新产品的风格。
                - 确保新产品在物理逻辑上是可行的。`;
                break;
            case 'prompt':
            default:
                if (!userPrompt) throw new Error("更换背景功能需要提供描述。");
                textPrompt = BACKGROUND_PROMPTS.prompt.replace('{{PROMPT}}', userPrompt);
                break;
        }
    } else if (feature === 'lineArt') {
        const typePrompt = LINE_ART_OPTS.types[lineArtType];
        const detailPrompt = LINE_ART_OPTS.details[detailLevel];
        const stylePrompt = LINE_ART_OPTS.styles[lineStyle];
        
        textPrompt = `将此产品图片转换为专业线稿图。
        任务要求：
        1. 类型：${typePrompt}
        2. 细节程度：${detailPrompt}
        3. 风格：${stylePrompt}
        4. 通用要求：背景必须是纯白色。线条清晰。保持产品原有透视。`;
    } else if (feature === 'multiView') {
        if (multiViewMode === 'three-view') {
            textPrompt = FEATURE_CONFIG.multiView.prompt;
        } else {
            // Free Perspective Mode
            // Generate detailed camera position description to help the model understand 3D space.
            let cameraPositionDesc = "";
            
            // Logic: Re-calibrated for optical accuracy.
            
            if (viewPitch === -90) {
                 cameraPositionDesc = "Strict Top-Down View (90° Overhead / Plan View). The camera looks directly perpendicular to the ground. Render as a 2D technical layout. No side walls should be visible unless the object tapers outward. Zero vertical perspective distortion.";
            } else if (viewPitch === -60) {
                 cameraPositionDesc = "Steep High Angle (60° Elevation / Bird's Eye). Camera is positioned high above the subject. The Top Surface dominates the composition (occupying ~70% of visual area). Vertical sides are visible but strongly foreshortened (converging downwards).";
            } else if (viewPitch === -30) {
                 cameraPositionDesc = "Standard Product Photography Angle (30° Elevation). A natural commercial viewing angle. The Top Surface is visible but foreshortened compared to the front face. Good balance between showing the top features and the silhouette.";
            } else { // 0
                 cameraPositionDesc = "Eye-Level / Straight-On View (0° Elevation). The camera lens is parallel to the ground at the object's center height. The Horizon Line cuts through the middle of the product. The Top Surface MUST be hidden (represented as a flat line). Vertical lines should be parallel (2-Point Perspective).";
            }

            // Enhanced Yaw Logic with descriptive text for precision
            let rotationDesc = "";
            switch (viewYaw) {
                case 0:
                    rotationDesc = "Front View (0°). Directly facing the front. Symmetrical if the object is symmetrical.";
                    break;
                case 30:
                    rotationDesc = "Front-Right 3/4 View (30°). Mainly front face, revealing the right side depth.";
                    break;
                case 60:
                    rotationDesc = "Front-Right Side View (60°). Mainly right side, retaining the front edge features.";
                    break;
                case 90:
                    rotationDesc = "Right Profile View (90°). Directly facing the right side. Orthogonal to the front view.";
                    break;
                default:
                    rotationDesc = `Rotated ${viewYaw} degrees clockwise.`;
            }

            textPrompt = `根据提供的产品图片，重新渲染一张该产品的单视角图片。
            
            相机位置设定 (Camera & Geometric Setup):
            1. **垂直高度 (Pitch ${viewPitch}°)**: ${cameraPositionDesc}
            2. **水平角度 (Yaw ${viewYaw}°)**: ${rotationDesc}

            关键透视规则 (Critical Perspective Rules):
            1. **透视重构 (Perspective Reconstruction)**: 必须根据新的相机高度重新计算消点 (Vanishing Points) 和透视缩短 (Foreshortening)。
            2. **几何准确性 (Geometric Accuracy)**:
               - [-90° 顶视]: 必须是平面图效果。完全不展示高度信息。
               - [-60° 深俯视]: 顶部面积 >> 侧面面积。垂直线条有明显的向下收敛趋势。
               - [-30° 浅俯视]: 侧面轮廓清晰，顶部可见但压扁。符合人眼日常观察物体的角度。
               - [0° 平视]: 严禁展示顶部平面。所有垂直结构线必须垂直于地平线，无纵向透视收敛。
            3. **空间一致性**: 产品必须保持物理直立，只改变观察者的位置。
            4. **细节保持**: 严格保留原图的设计语言、材质反光特性和Logo位置（根据旋转调整Logo可见性）。
            5. **完整性补全**: 如果新视角展示了原图不可见的侧面/背面，请根据产品风格逻辑进行合理推演补全。
            6. **背景扩展**: 根据新的视平线高度，自然调整和扩展背景。`;
        }
    }

    parts.push({ text: textPrompt });
    
    const contents = { parts };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents,
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        // Safe check using optional chaining to avoid "Cannot read properties of undefined (reading 'parts')"
        const responseParts = response.candidates?.[0]?.content?.parts;

        if (responseParts) {
            for (const part of responseParts) {
                if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
                    const base64ImageBytes = part.inlineData.data;
                    return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                }
            }
        }
        
        // If no image parts, check for a finishReason (e.g. SAFETY, OTHER)
        const finishReason = response.candidates?.[0]?.finishReason;
        if (finishReason) {
            throw new Error(`生成失败，原因: ${finishReason} (模型拒绝了请求)`);
        }

        throw new Error('响应中未生成任何图片。');
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        // Rethrow with a user-friendly message if possible, or pass the original error message
        throw new Error(error.message || '生成图片失败。请重试。');
    }
};