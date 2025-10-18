import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b-4 border-slate-800">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          viewBox="0 0 24 24"
          fill="#facc15"
          stroke="#475569"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5,10.5 C 9.5,4.5, 17.5,4.5, 19.5,10.5 C 18.5,16.5, 11.5,18.5, 7.5,10.5 z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.5 5.5 C 17 4.5, 16 4, 15.5 4.5"
            fill="none"
          />
        </svg>
        <h1 className="text-2xl font-bold ml-3 text-slate-800">香蕉AI图片工作室</h1>
      </div>
    </header>
  );
};