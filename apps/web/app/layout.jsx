import "./globals.css";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono" });

export const metadata = {
  title: "GHC - GitHub Clone",
  description: "A bold GitHub-like experience"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${space.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
