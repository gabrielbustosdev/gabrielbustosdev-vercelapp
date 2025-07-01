import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { ChatProvider } from "@/hooks/ChatContext";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gabriel Bustos - Desarrollador Full Stack & Especialista en AI",
  description: "Desarrollador full stack especializado en Next.js y soluciones de inteligencia artificial. Creo páginas web disruptivas y modernas con agentes de AI integrados.",
  keywords: "desarrollador full stack, Next.js, AI, inteligencia artificial, freelance, desarrollo web",
  authors: [{ name: "Gabriel Bustos" }],
  openGraph: {
    title: "Gabriel Bustos - Desarrollador Full Stack & Especialista en AI",
    description: "Especialista en desarrollo full stack con Next.js y integración de agentes de IA",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="es">
      <body className={inter.className}>
        <ChatProvider>
          <Navbar />
          {children}
          <Footer />
          <Chatbot />
        </ChatProvider>
      </body>
    </html>
  );
}
