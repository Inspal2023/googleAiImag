import React from 'react';

interface ResultDisplayProps {
  resultImageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onImageClick: () => void;
}

const Placeholder = () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 14.5M14.25 3.104c.251.023.501.05.75.082M19.8 14.5L14.25 10m-8.25 0l7.5 7.5h3.75a2.25 2.25 0 002.25-2.25v-3.75L16.5 10M9.75 16.5h1.5a1.5 1.5 0 011.5 1.5v1.5a1.5 1.5 0 01-1.5 1.5h-1.5a1.5 1.5 0 01-1.5-1.5v-1.5a1.5 1.5 0 011.5-1.5z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-slate-800">您的结果将显示在此处</h3>
        <p className="mt-1 text-sm text-slate-500">
            生成图片后，它将显示在此面板中。
        </p>
    </div>
);

const Loader = () => (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <svg className="animate-spin h-12 w-12 text-sky-500" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-slate-600">正在生成您的图片...</p>
        <p className="mt-1 text-sm text-slate-500">这可能需要一些时间。</p>
    </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-red-200 border-red-500 border-2 border-dashed rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-bold text-red-700">发生错误</h3>
        <p className="mt-1 text-sm text-red-600">
            {message}
        </p>
    </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ resultImageUrl, isLoading, error, onImageClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-[6px_6px_0px_#475569] border-2 border-slate-800 aspect-square flex flex-col">
      <h2 className="text-xl font-bold p-6 pb-2 text-slate-700">生成结果</h2>
      <div className="flex-grow p-6 pt-2 flex items-center justify-center">
        <div className="w-full h-full bg-amber-100 rounded-lg flex items-center justify-center border-2 border-slate-800">
            {isLoading ? <Loader /> :
             error ? <ErrorDisplay message={error} /> :
             resultImageUrl ? (
                <div className="relative group w-full h-full" onClick={onImageClick}>
                    <img src={resultImageUrl} alt="生成结果" className="w-full h-full object-contain rounded-lg cursor-zoom-in" />
                    <a
                        href={resultImageUrl}
                        download="generated-image.png"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-4 right-4 bg-sky-500 text-white p-3 rounded-full shadow-[2px_2px_0px_#1e293b] border-2 border-slate-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-sky-600 active:shadow-none active:translate-y-0.5 active:translate-x-0.5"
                        title="下载图片"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </a>
                </div>
             ) : <Placeholder />}
        </div>
      </div>
    </div>
  );
};