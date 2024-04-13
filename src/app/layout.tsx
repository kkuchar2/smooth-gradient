import React from 'react';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Gaussian Gradient Generator',
    description: 'A simple tool to generate radial gradients with Gaussian distribution.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang={'en'} className={'dark'}>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
