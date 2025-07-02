"use client";
import React, { useContext } from "react";
import { NoticeContext } from "../hooks/NoticeContext";

export default function Notice() {
  const { showNotice, setShowNotice } = useContext(NoticeContext);
  if (!showNotice) return null;
  return (
    <div className="w-full flex justify-center pt-16 px-2 bg-slate-900 border-b border-red-200 shadow-sm animate-fade-in">
      <div className="relative flex items-center gap-3 max-w-2xl w-full rounded-lg bg-red-100 border border-red-300 px-4 py-2">
        <span className="text-red-500 text-xl">⚠️</span>
        <span className="text-red-700 font-medium text-sm sm:text-base">
          Los servicios ofrecidos en esta página son únicamente demostrativos. Este sitio no representa una oferta comercial real.
        </span>
        <button
          onClick={() => setShowNotice(false)}
          className="absolute right-2 top-1 text-red-400 hover:text-red-700 text-xl font-bold transition-colors"
          aria-label="Cerrar alerta"
        >
          &times;
        </button>
      </div>
    </div>
  );
} 