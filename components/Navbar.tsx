"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ChatBot from "./Chatbot"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const [isChatOpen, setIsChatOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/portafolio", label: "Portafolio" },
    { href: "/servicios", label: "Servicios" },
    { href: "/contacto", label: "Contacto" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent cursor-pointer">
                  Gabriel Bustos
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`transition-colors duration-300 font-medium relative ${isActive(item.href) ? "text-blue-400" : "text-white hover:text-blue-400"
                      }`}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-slate-300 rounded-full"></span>
                    )}
                  </Link>
                ))}
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-slate-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-slate-700 transition-all duration-300 font-medium"
                >
                  Hablar con AI
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-blue-400 transition-colors duration-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-black/30 backdrop-blur-md rounded-lg mt-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 transition-colors duration-300 ${isActive(item.href) ? "text-blue-400 bg-blue-500/10 rounded-lg" : "text-white hover:text-blue-400"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setIsChatOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left bg-gradient-to-r from-blue-500 to-slate-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-slate-700 transition-all duration-300 mt-2"
                >
                  Hablar con AI
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} onOpen={() => setIsChatOpen(true)} />
    </>
  )
}
