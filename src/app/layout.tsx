import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NautilusOS",
  description: "Explore Your Digital Ocean — A browser-based OS inspired by the deep sea.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
