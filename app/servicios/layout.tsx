import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios - Gabriel Bustos",
  description: "Desarrollo web profesional con Next.js y soluciones con inteligencia artificial. Creamos sitios efectivos que generan resultados.",
};

export default function ServiciosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 