import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./providers/ThemeProvider";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import { Navbar } from "@/components/shared/Navbar";
import { FavoritesProvider } from "@/hooks/useFavorites";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Catalog | Поиск фильмов",
  description: "Ищите и находите информацию о ваших любимых фильмах.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <FavoritesProvider>
              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-8">
                  {children}
                </main>
              </div>
            </FavoritesProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
