import { GoogleGenAI, Modality } from "@google/genai";
import type { Feature, BackgroundMode } from '../types';
import { FEATURE_CONFIG, BACKGROUND_PROMPTS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            resolve(''); // Or handle ArrayBuffer case if necessary
        }
    };
    reader.readAsDataURL(file);
  });
  const base64Data = await base64EncodedDataPromise;
  return {
    inlineData: { data: base64Data, mimeType: file.type },
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
        
        const optimizedText = response.text.trim();
        return optimizedText || prompt;
    } catch (error) {
        console.error('Prompt Optimization Error:', error);
        return prompt; 
    }
};

interface GenerateImageOptions {
    userPrompt?: string;
    backgroundImageFile?: File | null;
    backgroundMode?: BackgroundMode;
}

export const generateImage = async (
    imageFile: File,
    feature: Feature,
    options: GenerateImageOptions = {}
): Promise<string> => {
    const { userPrompt = '', backgroundImageFile = null, backgroundMode = 'prompt' } = options;

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
                if (!userPrompt) throw new Error("混合模式需要提供背景描述。");
                textPrompt = BACKGROUND_PROMPTS.hybrid.replace('{{PROMPT}}', userPrompt);
                break;
            case 'prompt':
            default:
                if (!userPrompt) throw new Error("更换背景功能需要提供描述。");
                textPrompt = BACKGROUND_PROMPTS.prompt.replace('{{PROMPT}}', userPrompt);
                break;
        }
    } else {
        textPrompt = FEATURE_CONFIG[feature].prompt;
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

        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                    const base64ImageBytes = part.inlineData.data;
                    return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                }
            }
        }
        throw new Error('响应中未生成任何图片。');
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('生成图片失败。模型可能拒绝了该请求。');
    }
};