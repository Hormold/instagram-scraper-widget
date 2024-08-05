import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Instagram Widget",
  description: "Generate an Instagram widget for your website",
};

const merge = (...classNames: (string | undefined)[]) =>
  classNames.filter(Boolean).join(" ");


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={merge(inter.className, 'bg-transparent')}>{children}</body>
    </html>
  );
}
