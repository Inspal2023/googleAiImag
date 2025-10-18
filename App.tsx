import React from 'react';
import { Header } from './components/Header';
import { FeatureSelector } from './components/FeatureSelector';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { ResultDisplay } from './components/ResultDisplay';
import { generateImage, optimizePrompt } from './services/geminiService';
import type { Feature, BackgroundMode } from './types';
import { BackgroundModeSelector } from './components/BackgroundModeSelector';
import { ImageModal } from './components/ImageModal';

const App: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = React.useState<Feature>('lineArt');
  const [sourceImage, setSourceImage] = React.useState<File | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = React.useState<string | null>(null);
  const [prompt, setPrompt] = React.useState<string>('一个明亮、专业的摄影棚环境，光线柔和');
  const [resultImageUrl, setResultImageUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  
  const [backgroundMode, setBackgroundMode] = React.useState<BackgroundMode>('prompt');
  const [backgroundImage, setBackgroundImage] = React.useState<File | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = React.useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = React.useState<boolean>(false);


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
        if ((backgroundMode === 'prompt' || backgroundMode === 'hybrid') && !prompt.trim()) {
            setError('请输入背景描述。');
            return;
        }
        if ((backgroundMode === 'image' || backgroundMode === 'hybrid') && !backgroundImage) {
            setError('请上传一张背景图片。');
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
          backgroundMode: backgroundMode
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
        if (backgroundMode === 'hybrid' && (!prompt.trim() || !backgroundImage)) return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen text-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
         <div className="max-w-6xl mx-auto">
            <p className="text-center text-lg text-slate-600 mb-8">
              选择一个功能，上传您的产品图片，让AI来施展魔法。
            </p>
            
            <FeatureSelector selectedFeature={selectedFeature} onSelectFeature={setSelectedFeature} />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="bg-white p-6 rounded-lg shadow-[6px_6px_0px_#475569] border-2 border-slate-800">
                <h2 className="text-xl font-bold mb-4 text-slate-700">1. 上传产品图片</h2>
                <ImageUploader onImageUpload={handleImageUpload} sourceImageUrl={sourceImageUrl} id="product-image-upload" />

                {selectedFeature === 'backgroundChange' && (
                  <div className="mt-6 space-y-6">
                      <h2 className="text-xl font-bold text-slate-700">2. 设置背景</h2>
                      <BackgroundModeSelector selectedMode={backgroundMode} onSelectMode={setBackgroundMode} disabled={isLoading || isOptimizing} />
                      
                      {(backgroundMode === 'prompt' || backgroundMode === 'hybrid') && (
                          <PromptInput 
                              prompt={prompt} 
                              setPrompt={setPrompt} 
                              isLoading={isLoading}
                              onOptimize={handleOptimizePrompt}
                              isOptimizing={isOptimizing}
                          />
                      )}
                      
                      {(backgroundMode === 'image' || backgroundMode === 'hybrid') && (
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                上传参考背景图
                              </label>
                              <ImageUploader onImageUpload={handleBackgroundImageUpload} sourceImageUrl={backgroundImageUrl} id="background-image-upload" />
                          </div>
                      )}
                  </div>
                )}
                
                <button
                  onClick={handleGenerate}
                  disabled={isGenerateDisabled()}
                  className="w-full mt-6 bg-sky-500 text-white font-bold py-3 px-4 rounded-lg border-2 border-slate-800 shadow-[4px_4px_0px_#0f172a] hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-150 active:shadow-none active:translate-y-1 active:translate-x-1 disabled:bg-slate-300 disabled:shadow-none disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                      <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 80 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          生成中...
                      </>
                  ) : '生成图片'}
                </button>
              </div>
              
              <ResultDisplay resultImageUrl={resultImageUrl} isLoading={isLoading} error={error} onImageClick={handleOpenModal} />
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
