import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Page Pulse - Web URL Audit & Health Inspector',
  description: 'Audit any web page URL instantly. Extracts HTTP status, response time, page title, meta description, H1 count, missing image alt text, and approximate word counts.',
  keywords: ['URL audit', 'page inspector', 'SEO analyzer', 'accessibility check', 'alt text scanner', 'HTTP status'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#090d16] text-slate-100">
        {children}
      </body>
    </html>
  );
}
