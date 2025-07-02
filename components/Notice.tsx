"use client";
import React, { useContext } from "react";
import { NoticeContext } from "../hooks/NoticeContext";

export default function Notice() {
  const { showNotice, setShowNotice } = useContext(NoticeContext);
  if (!showNotice) return null;
  return (
    <div className="w-full pt-16">
      <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #fca5a5', position: 'relative' }}>
        <span>Los servicios ofrecidos en esta página son únicamente demostrativos. Este sitio no representa una oferta comercial real.</span>
        <button onClick={() => setShowNotice(false)} style={{ position: 'absolute', right: 16, top: 8, background: 'none', border: 'none', color: '#b91c1c', fontSize: 20, cursor: 'pointer' }} aria-label="Cerrar alerta">&times;</button>
      </div>
    </div>
  );
} 