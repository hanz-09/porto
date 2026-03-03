import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Han — Web Developer",
  description:
    "Personal portfolio website — Frontend Developer crafting modern web experiences with React & Next.js.",
  keywords: ["portfolio", "frontend developer", "react", "nextjs", "web developer"],
  authors: [{ name: "Farhan Zuhdi" }],
  openGraph: {
    title: "Han — Web Developer",
    description: "Personal portfolio website — Frontend Developer crafting modern web experiences with React & Next.js.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased max-w-[100vw] overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex min-h-screen w-full flex-col overflow-x-hidden relative">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
