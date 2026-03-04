import type { Metadata } from 'next';
import { Crimson_Pro, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IB Word Counter',
  description: 'Accurate word counts for IB assignments — strips bibliography, appendices, and non-counting content automatically.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${crimsonPro.variable} ${ibmPlexMono.variable} ${ibmPlexSans.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
