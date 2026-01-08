"use client";

import React, { useEffect, useState } from "react";
import {
  Home,
  ShoppingCart,
  Menu,
  X,
  LayoutGrid,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "الرئيسية", href: "/", icon: <Home size={20} /> },
    { name: "منتجاتنا", href: "/products", icon: <ShoppingCart size={20} /> },
    { name: "مشاريعنا", href: "/projects", icon: <LayoutGrid size={20} /> },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // منع التمرير في الخلفية عند فتح القائمة
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [menuOpen]);

  return (
    <>
      <header
        dir="rtl"
        className={`fixed top-4 left-4 right-4 md:top-6 md:left-10 md:right-10 z-[100] transition-all duration-500 rounded-[24px] ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg py-3 border border-white/20"
            : "py-5 bg-black/20"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link
            href="/"
            className="transition-transform duration-300 hover:scale-105"
          >
            <img
              src="/logo-nav-2.png"
              alt="Logo"
              className={`${
                isScrolled ? "h-10" : "bg-black h-12"
              } w-auto rounded-xl px-4 transition-all`}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-12 text-[#3e2f1c]">
            {/* ... نفس روابط الديسك توب ... */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-bold transition-all ${
                  isScrolled ? "text-[#3e2f1c]" : "text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden p-3 rounded-2xl bg-[#3e2f1c] text-white shadow-lg"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-[#3e2f1c]/80 backdrop-blur-md z-[200]"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              /* الحل هنا: h-screen و overflow-y-auto */
              className="fixed top-0 right-0 h-screen h-[100dvh] w-[85%] max-w-sm bg-[#fcfcfc] z-[210] shadow-2xl flex flex-col"
              dir="rtl"
            >
              {/* Header - ثابت في الأعلى */}
              <div className="p-6 flex justify-between items-center border-b border-gray-100 shrink-0">
                <img
                  src="/logo-nav-2.png"
                  alt="Logo"
                  className="h-8 rounded-lg"
                />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 bg-gray-100 rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>

              {/* سكرول داخلي للمحتوى فقط */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                <nav className="p-6 space-y-3">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-2xl text-[#3e2f1c] bg-white border border-gray-50 shadow-sm"
                      >
                        <span className="p-2 bg-[#ac8918]/10 text-[#ac8918] rounded-lg">
                          {link.icon}
                        </span>
                        <span className="font-bold text-lg">{link.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Footer داخل منطقة السكرول لضمان الوصول إليه */}
                <div className="p-6 pt-0">
                  <div className="bg-[#3e2f1c] p-6 rounded-[2rem] text-center shadow-xl">
                    <MessageCircle
                      className="mx-auto text-[#ac8918] mb-3"
                      size={28}
                    />
                    <h4 className="text-white font-bold text-sm mb-1">
                      جاهز لتصميم بيت أحلامك؟
                    </h4>
                    <p className="text-gray-400 text-xs mb-4">
                      نحن هنا لتحويل خيالك إلى حقيقة.
                    </p>
                    <Link
                      href="/contact"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full py-3 bg-[#ac8918] text-white rounded-xl font-black text-sm"
                    >
                      تواصل معنا الآن
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
