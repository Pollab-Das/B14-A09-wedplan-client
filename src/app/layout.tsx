import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"], 
  variable: "--font-cormorant" 
});

const lato = Lato({ 
  subsets: ["latin"], 
  weight: ["400", "700"], 
  variable: "--font-lato" 
});

export const metadata: Metadata = { 
  title: "WedPlan - Wedding Planning Platform", 
  description: "Discover and book the best wedding services for your special day." 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var n=document.querySelectorAll("#scrnli_recorder_root");for(var i=0;i<n.length;i++){var e=n[i],p=e.parentNode;if(!p)continue;if(e.hasAttribute("data-app-root")){e.removeAttribute("id");continue;}while(e.firstChild)p.insertBefore(e.firstChild,e);p.removeChild(e);}})()`,
          }}
        />
      </head>
      <body 
        className={`${cormorant.variable} ${lato.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <div data-app-root suppressHydrationWarning>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}