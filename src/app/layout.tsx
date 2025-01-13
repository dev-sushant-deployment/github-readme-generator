import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/general/Navbar";
import { Footer } from "@/components/general/Footer";
import { Toaster } from "sonner";

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
        <Toaster
          richColors={true}
          theme="light"
          position="top-center"
        />
        <div className="min-h-lvh flex flex-col justify-between">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
