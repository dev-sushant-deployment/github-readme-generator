import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/general/Navbar";
import { Footer } from "@/components/general/Footer";

export const metadata: Metadata = {
  title: "Github Readme Generator",
  description: "Generate a beautiful README for your GitHub repo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-lvh flex flex-col justify-between">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
