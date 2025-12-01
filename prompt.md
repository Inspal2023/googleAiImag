# 香蕉AI图片工作室 - 提示词模版 (Prompt Templates)

本文档记录了应用中各个核心功能模块所使用的 Prompt 模版。部分模版包含动态参数（以 `{{Parameter}}` 标识），这些参数会根据用户在前端的设置在代码中动态替换。

---

## 1. 智能线稿生成 (Line Art Generation)

**模式:** 所有线稿模式
**文件来源:** `services/geminiService.ts`

```text
将此产品图片转换为专业线稿图。
任务要求：
1. 类型：{{LineArtType_Description}}
2. 细节程度：{{DetailLevel_Description}}
3. 风格：{{LineStyle_Description}}
4. 通用要求：背景必须是纯白色。线条清晰。保持产品原有透视。
```

**参数字典 (`constants.ts`):**

*   **{{LineArtType_Description}}**:
    *   `engineering`: 严格的工程制图风格，强调结构准确性、透视和比例。适用于技术手册或专利图。
    *   `concept`: 概念设计草图风格，强调形式感、流畅的线条和设计意图。适用于设计作品集或创意展示。
*   **{{DetailLevel_Description}}**:
    *   `low`: 低细节：仅保留最主要的外轮廓，忽略微小纹理和装饰，画面简洁。
    *   `medium`: 中等细节：平衡轮廓和主要内部特征，清晰表达产品结构。
    *   `high`: 高细节：包含丰富的纹理、材质表现和复杂的内部结构，画面精致复杂。
*   **{{LineStyle_Description}}**:
    *   `minimalist`: 极简主义风格：线条干净利落，无多余装饰，使用单一线重，留白丰富。
    *   `technical`: 技术风格：线条精确、克制，类似CAD绘图或蓝图，线条清晰明确。
    *   `artistic`: 艺术风格：线条富有表现力，线重变化丰富（粗细变化），模拟手绘墨线质感。

---

## 2. 多角度视图 (Multi-View Synthesis)

### 2.1 标准三视图 (Standard Three-View)

**模式:** `three-view`
**文件来源:** `services/geminiService.ts`

```text
Role: Technical Illustrator / Industrial Designer.
Task: Create a standard Orthographic Projection Three-View Drawing (三视图) of the input product.

Requirements:
1. **Layout**: Arrange three distinct views on a clean white background:
   - Top View (Plan View)
   - Front View (Elevation)
   - Side View (Profile)
2. **Perspective**: Use Parallel Projection (Orthographic). Do NOT use linear perspective. Lines should be parallel.
3. **Consistency**: Ensure all three views represent the EXACT same object with consistent proportions and details.
4. **Style**: Clean, technical presentation suitable for design documentation.
```

### 2.2 自由视角 (Free Perspective)

**模式:** `free-perspective`
**文件来源:** `services/geminiService.ts`

```text
Role: Expert Product Photographer.
Task: Re-photograph the input product from a specific new camera angle.

Target Shot Description:
"Capture the product from {{AngleDescription}} It should be {{RotationDescription}}"

Critical Rules:
1. **Visual Geometry**: {{PerspectiveRules}}
2. **Identity Consistency**: The generated object must differ ONLY in angle. Maintain the exact same design, materials, colors, and logo placement as the reference image.
3. **Background**: Extend the background naturally to fit the new perspective, or keep it clean studio white if the original is simple.
4. **Lighting**: Adjust reflections and shadows to match the new camera position.
```

**动态逻辑:**

*   **{{AngleDescription}}** (基于垂直角度 `viewPitch`):
    *   `-90`: "A direct top-down Plan View (Technical Flat Lay)."
    *   `-60`: "A high-angle Bird's-Eye View (looking down steeply)."
    *   `-30`: "A standard commercial product photography angle (slightly above eye level)."
    *   `0`: "A strict Eye-Level View (Horizon Line shot)."
*   **{{PerspectiveRules}}** (基于垂直角度 `viewPitch`):
    *   `-90`: "The image must be completely flat (2D). No vertical sides of the product should be visible. This is a technical layout view."
    *   `-60`: "The top surface of the product should dominate the composition. Vertical sides are visible but short due to strong foreshortening."
    *   `-30`: "This is the most natural viewing angle. Show a balanced view of both the top features and the front/side profile."
    *   `0`: "The camera is parallel to the ground. The top surface of the product must be COMPLETELY HIDDEN (flattened to a line). Vertical lines should be perfectly vertical."
*   **{{RotationDescription}}** (基于水平角度 `viewYaw`):
    *   `0`: "facing directly forward (Front View)."
    *   `30`: "rotated slightly to reveal the right side (Front-Right 3/4 View)."
    *   `60`: "rotated significantly to emphasize the side profile (Side-Dominant View)."
    *   `90`: "facing directly to the right (Side Profile View)."

---

## 3. 场景与特征融合 (Scene Fusion)

### 3.1 文字描述模式 (Prompt Mode)

**模式:** `prompt`
**文件来源:** `constants.ts` -> `BACKGROUND_PROMPTS.prompt`

```text
将图片中的产品真实地放置到一个新场景中。新背景应为：{{UserPrompt}}。产品本身必须保持不变，但其光照和阴影应进行调整，以完美匹配新环境。不要添加任何文本或水印。
```

### 3.2 上传背景模式 (Image Mode)

**模式:** `image`
**文件来源:** `constants.ts` -> `BACKGROUND_PROMPTS.image`

```text
你的任务是替换背景。第一张图片是主体产品，第二张图片是新的背景。请将主体产品无缝地放置到新背景中。必须保持产品本身不变，只调整光照和阴影以匹配新环境。
```

### 3.3 混合模式 (Hybrid Mode)

**模式:** `hybrid`
**文件来源:** `services/geminiService.ts`

```text
你是一位专业的高级工业设计师。
任务：根据提供的两张图片，设计并生成一个新的产品图片。
图片1：主体产品原型（提供基础形态）。
图片2：参考特征对象（提供风格、结构或材质灵感）。

请按照以下融合参数，将图片2的特征融合到图片1的产品中，生成一个全新的产品设计：

融合参数 (0.0 - 1.0)：
1. **结构/形态融合 (Structure Blending): {{StructureValue}}**
   - 0.0: 完全保持图片1的形状。
   - 1.0: 强烈改变图片1的形状，使其轮廓极其接近图片2。
   - 当前权重 ({{StructureValue}}): 请据此调整产品的整体几何造型。
   
2. **颜色/色调融合 (Color Blending): {{ColorValue}}**
   - 0.0: 保持图片1的原有配色。
   - 1.0: 完全采用图片2的配色方案。
   - 当前权重 ({{ColorValue}}): 请据此重新定义产品的色彩分布。
   
3. **材质/纹理融合 (Material Blending): {{MaterialValue}}**
   - 0.0: 保持图片1的原有材质。
   - 1.0: 完全应用图片2的表面材质和纹理处理。
   - 当前权重 ({{MaterialValue}}): 请据此渲染产品的表面质感。

输出要求：
- 生成一张高分辨率、真实感强的产品摄影图。
- 背景保持干净或适应新产品的风格。
- 确保新产品在物理逻辑上是可行的。
```

---

## 4. 辅助功能：提示词智能优化 (Smart Prompt Optimization)

**类型:** System Instruction
**文件来源:** `constants.ts` -> `PROMPT_OPTIMIZATION_INSTRUCTION`

```text
你是一个富有创意的AI助手，专门为AI绘画工具优化用户输入的背景描述。你的任务是：
1. 理解用户的核心意图。
2. 将简单、模糊的描述变得更具体、生动、富有画面感。
3. 添加能提升图片质量的细节，如光线、氛围、材质、构图等。
4. 保持描述简洁、清晰，适合AI模型理解。
5. 仅返回优化后的描述文本，不要包含任何额外的解释或前缀，如“优化后的描述：”。
```
