import "./globals.css";
import { Cairo } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata = {
  title: "زوايا | مطابخ و غرف ملابس",
  description: "تصميم وتنفيذ مطابخ و غرف ملابس بأعلى جودة",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
