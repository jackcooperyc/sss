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
  title: "NWAGo | Cupr.os Lead Gen",
  description: "No-Website-Available lead finder for Montana cannabis retail — exports to Cupr.os CRM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ListProvider>
          <SearchBankProvider>
            <header className="bg-slate-900 border-b border-slate-800 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex-shrink-0 flex items-center">
                    <span className="font-bold text-xl tracking-tight text-white">
                      NWAGo
                    </span>
                  </div>
                  <nav className="flex space-x-6">
                    <Link 
                      href="/" 
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Search size={16} />
                      Lead Search
                    </Link>
                    <Link 
                      href="/formatter" 
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Database size={16} />
                      CSV Formatter
                    </Link>
                    <Link 
                      href="/lists" 
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <ListChecks size={16} />
                      My Lists
                    </Link>
                  </nav>
                </div>
              </div>
            </header>
            <div className="flex-grow">
              {children}
            </div>
          </SearchBankProvider>
        </ListProvider>
      </body>
    </html>
  );
}
