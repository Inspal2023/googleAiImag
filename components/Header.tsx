import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 pt-4 pb-2 px-4">
      <div className="container mx-auto max-w-6xl glass-panel rounded-2xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-yellow-300 to-amber-500 rounded-xl shadow-lg shadow-amber-200">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white drop-shadow-md"
                viewBox="0 0 24 24"
                fill="currentColor"
                >
                <path
                    d="M7.5,10.5 C 9.5,4.5, 17.5,4.5, 19.5,10.5 C 18.5,16.5, 11.5,18.5, 7.5,10.5 z"
                />
                </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-500 tracking-tight">
                香蕉AI <span className="font-light text-slate-400">|</span> 图片工作室
            </h1>
        </div>
        <div className="hidden sm:block">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-500 border border-indigo-100">
                v2.0 Liquid Glass
            </span>
        </div>
      </div>
    </header>
  );
};