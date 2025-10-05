import type { Metadata } from "next";
import "./globals.css";
import { url } from "inspector";

export const metadata: Metadata = {
  title: "Veyra",
  description: "The Invoicing of new time",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
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
