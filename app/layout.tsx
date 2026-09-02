import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://premdheeraj.github.io/My-Portfolio/'),
  title: 'Dheeraj Kumar Prajapati | AI & Software Engineer',
  description:
    'Portfolio of Dheeraj Kumar Prajapati - AI data specialist and software engineer building reliable, human-centered systems.',
  openGraph: {
    title: 'Dheeraj Kumar Prajapati | AI & Software Engineer',
    description: 'AI systems, model evaluation, and human-centered software engineering.',
    url: 'https://premdheeraj.github.io/My-Portfolio/',
    siteName: 'Dheeraj Kumar Prajapati',
    images: [
      {
        url: 'og.png',
        width: 1200,
        height: 630,
        alt: 'Dheeraj Kumar Prajapati - AI Systems and Software Engineering',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dheeraj Kumar Prajapati | AI & Software Engineer',
    description: 'AI systems, model evaluation, and human-centered software engineering.',
    images: ['og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
