import React from 'react';

interface ResultDisplayProps {
  resultImageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onImageClick: () => void;
}

const Placeholder = () => (
    <div className="text-center p-8 opacity-60">
        <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-slate-100 to-white rounded-full flex items-center justify-center shadow-inner mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-600">等待生成</h3>
        <p className="mt-2 text-sm text-slate-400 max-w-xs mx-auto">
            AI 生成的艺术作品将以高清质量展示在此处
        </p>
    </div>
);

const Loader = () => (
    <div className="flex flex-col items-center justify-center p-8">
        <div className="relative w-20 h-20">
             <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
             <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
        </div>
        <h3 className="mt-6 text-lg font-semibold text-slate-700">正在渲染</h3>
        <p className="mt-1 text-sm text-slate-500">AI 正在构思像素细节...</p>
    </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="text-center p-8 max-w-sm">
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800">出错了</h3>
        <p className="mt-2 text-sm text-slate-600 bg-red-50 p-3 rounded-lg border border-red-100">
            {message}
        </p>
    </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ resultImageUrl, isLoading, error, onImageClick }) => {
  return (
    <div className="glass-panel rounded-3xl p-2 h-full min-h-[500px] flex flex-col relative overflow-hidden transition-all duration-500">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></div>
      
      <div className="flex-1 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/40 flex items-center justify-center overflow-hidden relative group">
          
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

          {isLoading ? <Loader /> :
           error ? <ErrorDisplay message={error} /> :
           resultImageUrl ? (
            <>
                <img 
                    src={resultImageUrl} 
                    alt="生成结果" 
                    onClick={onImageClick}
                    className="max-w-full max-h-full object-contain cursor-zoom-in drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" 
                />
                <div className="absolute bottom-6 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    <a
                        href={resultImageUrl}
                        download="ai-generated-image.png"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white/90 backdrop-blur text-slate-700 hover:text-indigo-600 px-4 py-2 rounded-full shadow-lg border border-white/50 text-sm font-medium flex items-center gap-2 transition-transform hover:scale-105"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        下载
                    </a>
                </div>
            </>
           ) : <Placeholder />}
      </div>
    </div>
  );
};