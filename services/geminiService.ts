import { GoogleGenAI, Modality, HarmCategory, HarmBlockThreshold } from "@google/genai";
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
            model: 'gemini-3-pro-preview',
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
            textPrompt = `Role: Technical Illustrator / Industrial Designer.
            Task: Create a standard Orthographic Projection Three-View Drawing (三视图) of the input product.
            
            Requirements:
            1. **Layout**: Arrange three distinct views on a clean white background:
               - Top View (Plan View)
               - Front View (Elevation)
               - Side View (Profile)
            2. **Perspective**: Use Parallel Projection (Orthographic). Do NOT use linear perspective. Lines should be parallel.
            3. **Consistency**: Ensure all three views represent the EXACT same object with consistent proportions and details.
            4. **Style**: Clean, technical presentation suitable for design documentation.`;
        } else {
            // Free Perspective Mode - Optimized for Natural Language Flow
            
            let angleDescription = "";
            let perspectiveRules = "";
            
            // 1. Define the Vertical Angle (Pitch) with visual consequences
            if (viewPitch === -90) {
                 angleDescription = "A direct top-down Plan View (Technical Flat Lay).";
                 perspectiveRules = "The image must be completely flat (2D). No vertical sides of the product should be visible. This is a technical layout view.";
            } else if (viewPitch === -60) {
                 angleDescription = "A high-angle Bird's-Eye View (looking down steeply).";
                 perspectiveRules = "The top surface of the product should dominate the composition. Vertical sides are visible but short due to strong foreshortening.";
            } else if (viewPitch === -30) {
                 angleDescription = "A standard commercial product photography angle (slightly above eye level).";
                 perspectiveRules = "This is the most natural viewing angle. Show a balanced view of both the top features and the front/side profile.";
            } else { // 0
                 angleDescription = "A strict Eye-Level View (Horizon Line shot).";
                 perspectiveRules = "The camera is parallel to the ground. The top surface of the product must be COMPLETELY HIDDEN (flattened to a line). Vertical lines should be perfectly vertical.";
            }

            // 2. Define the Horizontal Rotation (Yaw)
            let rotationDescription = "";
            switch (viewYaw) {
                case 0:
                    rotationDescription = "facing directly forward (Front View).";
                    break;
                case 30:
                    rotationDescription = "rotated slightly to reveal the right side (Front-Right 3/4 View).";
                    break;
                case 60:
                    rotationDescription = "rotated significantly to emphasize the side profile (Side-Dominant View).";
                    break;
                case 90:
                    rotationDescription = "facing directly to the right (Side Profile View).";
                    break;
                default:
                    rotationDescription = `rotated ${viewYaw} degrees clockwise.`;
            }

            textPrompt = `Role: Expert Product Photographer.
            Task: Re-photograph the input product from a specific new camera angle.
            
            Target Shot Description:
            "Capture the product from ${angleDescription} It should be ${rotationDescription}"
            
            Critical Rules:
            1. **Visual Geometry**: ${perspectiveRules}
            2. **Identity Consistency**: The generated object must differ ONLY in angle. Maintain the exact same design, materials, colors, and logo placement as the reference image.
            3. **Background**: Extend the background naturally to fit the new perspective, or keep it clean studio white if the original is simple.
            4. **Lighting**: Adjust reflections and shadows to match the new camera position.`;
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
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                ],
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
        
        // If no image parts, check for a finishReason (e.g. SAFETY, OTHER, IMAGE_OTHER)
        const finishReason = response.candidates?.[0]?.finishReason;
        if (finishReason) {
            let errorMsg = `生成失败 (原因: ${finishReason})`;
            // Convert to string to safely compare with possible enum values
            const reasonStr = String(finishReason);
            
            if (reasonStr === 'OTHER' || reasonStr === 'IMAGE_OTHER') {
                errorMsg = '生成失败：模型拒绝了请求 (IMAGE_OTHER)。这通常是因为内容触发了严格的过滤（如人像、版权或敏感内容）。请尝试更换图片（避免清晰人脸）或简化描述。';
            } else if (reasonStr === 'SAFETY') {
                errorMsg = '生成失败：内容触发了安全警告。请检查您的图片或提示词是否包含敏感内容。';
            }
            throw new Error(errorMsg);
        }

        throw new Error('响应中未生成任何图片。');
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        // Rethrow with a user-friendly message if possible, or pass the original error message
        throw new Error(error.message || '生成图片失败。请重试。');
    }
};