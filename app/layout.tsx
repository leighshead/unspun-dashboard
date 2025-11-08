import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unspun Media Annotation System",
  description: "Sentence-level bias detection platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
