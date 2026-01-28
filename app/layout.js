import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Düğün Video Edit | Profesyonel Kurgu Hizmeti",
  description: "Düğün hikayelerinizi profesyonelce kurguluyoruz. Hızlı teslim, net fiyatlar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${inter.variable}`}>
        {/* Navbar will be added here */}
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        {/* Footer will be added here */}
        <Footer />
      </body>
    </html>
  );
}
