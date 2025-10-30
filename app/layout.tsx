import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // New import of font

import "./globals.css";

// Removed existing boilerplate fonts (plus its import statement) and replaced it with Poppins from Google/fonts
// Import and configure the Poppins font using Next.js's built-in font optimization
const poppins = Poppins({
  subsets: ["latin"], // Load only the Latin character set to reduce bundle size
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Include all available font weights for flexibility
  variable: "--font-poppins", // Define a CSS variable for use in global styles or Tailwind config
});

export const metadata: Metadata = {
  title: "StoreIt", // Changed
  description: "StoreIt - The only storage solution you need", // Changed
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Inject the CSS variable --font-poppins as defined by poppins() above */}
      <body className={`${poppins.variable} font-poppins antialiased`}>
        {children}
      </body>
    </html>
  );
}
/* layout.tsx == The structural wrapper
 */
