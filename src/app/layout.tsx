import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rebound — Find Your Next Chapter",
  description:
    "A warm, supportive space to meet people who truly understand the fresh-start feeling. Because healing is better together.",
  openGraph: {
    title: "Rebound — Find Your Next Chapter",
    description: "A dating app built for people ready for something real again.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="font-body bg-cream antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#FFFFFF",
              color: "#2D1B0E",
              border: "1px solid #EDD9C8",
              borderRadius: "12px",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            },
            success: {
              iconTheme: {
                primary: "#FF7B7B",
                secondary: "#FFFFFF",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
