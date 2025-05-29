import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["400", "600", "700"]
});

export const metadata: Metadata = {
  title: "HealthHive - See a Doctor Online, Anytime",
  description: "Get expert medical advice, prescriptions, and more — from the comfort of your home.",
  keywords: "telemedicine, online doctor, virtual consultation, healthcare, medical advice",
  authors: [{ name: "HealthHive" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
