import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Link from 'next/link';
import { Search, Database, ListChecks } from 'lucide-react';
import { ListProvider } from '@/context/ListContext';
import { SearchBankProvider } from '@/context/SearchBankContext';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cupr.os Smoke Shop Search Tool",
  description: "Find smoke shops and dispensaries without a real website — export leads to Cupr.os CRM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white`}
        suppressHydrationWarning
      >
        <ListProvider>
          <SearchBankProvider>
            <header className="bg-cupros-header border-b border-white/10 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <span className="font-black text-xl tracking-tight text-white">
                      Cupr<span className="text-cupros-apricot">.os</span>
                    </span>
                    <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest text-white/50 border-l border-white/20 pl-2 ml-1">
                      Smoke Shop Search
                    </span>
                  </div>
                  <nav className="flex space-x-2 sm:space-x-4">
                    <Link 
                      href="/" 
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Search size={16} className="text-cupros-apricot" />
                      Lead Search
                    </Link>
                    <Link 
                      href="/formatter" 
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Database size={16} className="text-cupros-apricot" />
                      CSV Formatter
                    </Link>
                    <Link 
                      href="/lists" 
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <ListChecks size={16} className="text-cupros-apricot" />
                      My Lists
                    </Link>
                  </nav>
                </div>
              </div>
            </header>
            <div className="flex-grow bg-white">
              {children}
            </div>
          </SearchBankProvider>
        </ListProvider>
      </body>
    </html>
  );
}
