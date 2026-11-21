import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "VowVista - Wedding Planning Platform",
  description: "Discover and book the best wedding services for your special day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${lato.variable} font-sans h-full antialiased min-h-full flex flex-col bg-[#0f172a] text-[#FDFBF7]`}
        suppressHydrationWarning
      >
        {children}
        
        {/* 🌟 নোটিফিকেশনের জন্য Toaster */}
        <Toaster 
          position="top-right" 
          richColors 
          theme="dark" 
          closeButton
        />
      </body>
    </html>
  );
}