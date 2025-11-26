import React from 'react';
import { Header } from './components/Header';
import { FeatureSelector } from './components/FeatureSelector';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { ResultDisplay } from './components/ResultDisplay';
import { generateImage, optimizePrompt } from './services/geminiService';
import type { Feature, BackgroundMode, LineArtType, DetailLevel, LineStyle, MultiViewMode, ViewPitch, ViewYaw, FusionParams } from './types';
import { BackgroundModeSelector } from './components/BackgroundModeSelector';
import { ImageModal } from './components/ImageModal';
import { LineArtSettings } from './components/LineArtSettings';
import { MultiViewSettings } from './components/MultiViewSettings';
import { ProductFusionSettings } from './components/ProductFusionSettings';

const App: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = React.useState<Feature>('lineArt');
  const [sourceImage, setSourceImage] = React.useState<File | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = React.useState<string | null>(null);
  const [prompt, setPrompt] = React.useState<string>('一个明亮、专业的摄影棚环境，光线柔和');
  const [resultImageUrl, setResultImageUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  
  // Background / Fusion State
  const [backgroundMode, setBackgroundMode] = React.useState<BackgroundMode>('prompt');
  const [backgroundImage, setBackgroundImage] = React.useState<File | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = React.useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = React.useState<boolean>(false);
  const [fusionParams, setFusionParams] = React.useState<FusionParams>({
      structure: 0.5,
      color: 0.5,
      material: 0.5
  });

  // Line Art State
  const [lineArtType, setLineArtType] = React.useState<LineArtType>('engineering');
  const [detailLevel, setDetailLevel] = React.useState<DetailLevel>('medium');
  const [lineStyle, setLineStyle] = React.useState<LineStyle>('technical');

  // Multi View State
  const [multiViewMode, setMultiViewMode] = React.useState<MultiViewMode>('three-view');
  const [viewPitch, setViewPitch] = React.useState<ViewPitch>(0);
  const [viewYaw, setViewYaw] = React.useState<ViewYaw>(30);


  const handleImageUpload = React.useCallback((file: File, dataUrl: string) => {
    setSourceImage(file);
    setSourceImageUrl(dataUrl);
    setResultImageUrl(null);
    setError(null);
  }, []);
  
  const handleBackgroundImageUpload = React.useCallback((file: File, dataUrl: string) => {
    setBackgroundImage(file);
    setBackgroundImageUrl(dataUrl);
    setError(null);
  }, []);

  const handleOptimizePrompt = async () => {
    setIsOptimizing(true);
    try {
        const optimized = await optimizePrompt(prompt);
        setPrompt(optimized);
    } catch (err) {
        console.error("Optimization failed on App level:", err);
    } finally {
        setIsOptimizing(false);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage) {
      setError('请先上传一张产品图片。');
      return;
    }

    if (selectedFeature === 'backgroundChange') {
        if (backgroundMode === 'prompt' && !prompt.trim()) {
            setError('请输入背景描述。');
            return;
        }
        if ((backgroundMode === 'image' || backgroundMode === 'hybrid') && !backgroundImage) {
            setError(backgroundMode === 'hybrid' ? '请上传参考产品图片。' : '请上传背景图片。');
            return;
        }
    }

    setIsLoading(true);
    setError(null);
    setResultImageUrl(null);

    try {
      const result = await generateImage(sourceImage, selectedFeature, {
          userPrompt: prompt,
          backgroundImageFile: backgroundImage,
          backgroundMode: backgroundMode,
          lineArtType,
          detailLevel,
          lineStyle,
          multiViewMode,
          viewPitch,
          viewYaw,
          fusionParams
      });
      setResultImageUrl(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '发生未知错误。');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenModal = () => {
    if (resultImageUrl) {
        setIsModalOpen(true);
    }
  };
  const handleCloseModal = () => setIsModalOpen(false);

  const isGenerateDisabled = () => {
    if (isLoading || isOptimizing || !sourceImage) return true;
    if (selectedFeature === 'backgroundChange') {
        if (backgroundMode === 'prompt' && !prompt.trim()) return true;
        if (backgroundMode === 'image' && !backgroundImage) return true;
        if (backgroundMode === 'hybrid' && !backgroundImage) return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen text-slate-700 pb-20">
      <Header />
      <main className="container mx-auto px-4 py-8">
         <div className="max-w-6xl mx-auto">
            
            <FeatureSelector selectedFeature={selectedFeature} onSelectFeature={setSelectedFeature} />

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Left Panel: Inputs */}
              <div className="glass-panel rounded-3xl p-8 space-y-8 animate-fade-in-up">
                <div>
                    <h2 className="text-lg font-bold mb-4 text-slate-800 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs mr-2">1</span>
                        上传主体图片
                    </h2>
                    <ImageUploader onImageUpload={handleImageUpload} sourceImageUrl={sourceImageUrl} id="product-image-upload" />
                </div>

                {selectedFeature === 'backgroundChange' && (
                  <div className="space-y-6 pt-6 border-t border-slate-200/50">
                      <h2 className="text-lg font-bold text-slate-800 flex items-center">
                         <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs mr-2">2</span>
                         融合模式设置
                      </h2>
                      <BackgroundModeSelector selectedMode={backgroundMode} onSelectMode={setBackgroundMode} disabled={isLoading || isOptimizing} />
                      
                      {/* Text Mode Options */}
                      {(backgroundMode === 'prompt') && (
                          <PromptInput 
                              prompt={prompt} 
                              setPrompt={setPrompt} 
                              isLoading={isLoading}
                              onOptimize={handleOptimizePrompt}
                              isOptimizing={isOptimizing}
                          />
                      )}
                      
                      {/* Image / Hybrid Reference Upload */}
                      {(backgroundMode === 'image' || backgroundMode === 'hybrid') && (
                          <div>
                              <label className="block text-sm font-medium text-slate-600 mb-2">
                                {backgroundMode === 'hybrid' ? '参考特征图片 (被融合对象)' : '参考背景图'}
                              </label>
                              <ImageUploader onImageUpload={handleBackgroundImageUpload} sourceImageUrl={backgroundImageUrl} id="background-image-upload" />
                          </div>
                      )}

                      {/* Hybrid Specific Options */}
                      {backgroundMode === 'hybrid' && (
                         <ProductFusionSettings 
                            params={fusionParams}
                            setParams={setFusionParams}
                            disabled={isLoading}
                         />
                      )}
                  </div>
                )}

                {selectedFeature === 'lineArt' && (
                   <div className="space-y-6 pt-6 border-t border-slate-200/50">
                      <h2 className="text-lg font-bold text-slate-800 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs mr-2">2</span>
                        线稿设置
                      </h2>
                      <LineArtSettings 
                        lineArtType={lineArtType} setLineArtType={setLineArtType}
                        detailLevel={detailLevel} setDetailLevel={setDetailLevel}
                        lineStyle={lineStyle} setLineStyle={setLineStyle}
                        disabled={isLoading}
                      />
                   </div>
                )}

                {selectedFeature === 'multiView' && (
                   <div className="space-y-6 pt-6 border-t border-slate-200/50">
                      <h2 className="text-lg font-bold text-slate-800 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs mr-2">2</span>
                        视角设置
                      </h2>
                      <MultiViewSettings 
                        mode={multiViewMode} setMode={setMultiViewMode}
                        pitch={viewPitch} setPitch={setViewPitch}
                        yaw={viewYaw} setYaw={setViewYaw}
                        disabled={isLoading}
                      />
                   </div>
                )}
                
                <div className="pt-4">
                    <button
                    onClick={handleGenerate}
                    disabled={isGenerateDisabled()}
                    className={`
                        w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 transform
                        flex items-center justify-center relative overflow-hidden group
                        ${isGenerateDisabled() 
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                            : 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white hover:shadow-sky-500/30 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]'
                        }
                    `}
                    >
                    <span className="relative z-10 flex items-center">
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 80 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                正在进行AI渲染...
                            </>
                        ) : (
                            <>
                            {selectedFeature === 'backgroundChange' && backgroundMode === 'hybrid' ? '开始融合生成' : '生成图片'}
                            {!isGenerateDisabled() && (
                                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            )}
                            </>
                        )}
                    </span>
                    {!isGenerateDisabled() && (
                        <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 ease-in-out -skew-x-12 -translate-x-full" />
                    )}
                    </button>
                </div>
              </div>
              
              {/* Right Panel: Result */}
              <div className="lg:sticky lg:top-24">
                <ResultDisplay resultImageUrl={resultImageUrl} isLoading={isLoading} error={error} onImageClick={handleOpenModal} />
              </div>

            </div>
          </div>
      </main>

      {isModalOpen && resultImageUrl && (
          <ImageModal imageUrl={resultImageUrl} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;