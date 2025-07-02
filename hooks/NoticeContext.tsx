"use client";
import React, { createContext, useState, useEffect } from "react";

interface NoticeContextType {
  showNotice: boolean;
  setShowNotice: (show: boolean) => void;
}

export const NoticeContext = createContext<NoticeContextType>({
  showNotice: true,
  setShowNotice: () => {},
});

export const NoticeProvider = ({ children }: { children: React.ReactNode }) => {
  const [showNotice, setShowNoticeState] = useState(true);

  useEffect(() => {
    const closed = sessionStorage.getItem("noticeClosed");
    if (closed === "true") setShowNoticeState(false);
  }, []);

  const setShowNotice = (show: boolean) => {
    setShowNoticeState(show);
    if (!show) sessionStorage.setItem("noticeClosed", "true");
  };

  return (
    <NoticeContext.Provider value={{ showNotice, setShowNotice }}>
      {children}
    </NoticeContext.Provider>
  );
}; 