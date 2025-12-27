"use client";

import React, { useState, useEffect } from "react";
import { Phone, Home, ShoppingCart, Menu, X, LayoutGrid } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "الرئيسية", href: "/", icon: <Home size={18} /> },
    { name: "منتجاتنا", href: "/products", icon: <ShoppingCart size={18} /> },
    { name: "مشاريعنا", href: "/projects", icon: <LayoutGrid size={18} /> },
    // { name: "تواصل معنا", href: "/contact", icon: <Phone size={18} /> },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar Header */}
      <header
        dir="rtl"
        className={`fixed rounded-[20px] mx-5 my-5 top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? "py-3 bg-white/90 backdrop-blur-md shadow-lg border-b border-[#d4af37]/20"
            : "py-5 bg-black/20 "
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo Section */}
          <Link href="/" className="relative group">
            <div
              className={`transition-all duration-500 ${
                isScrolled ? "scale-90" : "scale-100"
              }`}
            >
              {/* استبدل هذا بـ img الخاص بك - وضعت نصاً جمالياً كمثال */}
              <div className="flex flex-col items-start leading-none">
                <img
                  src="/logo-nav-2.png"
                  alt="Logo"
                  className="w-12 md:w-12 rounded-2xl drop-shadow-2xl"
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-20">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`group relative py-2 text-[20px] font-bold transition-colors duration-300 ${
                  isScrolled ? "text-[#3d2b1f]" : "text-white"
                }`}
              >
                <span className="flex items-center gap-2">{link.name}</span>
                {/* Underline Animation */}
                <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-[#d4af37] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Action Button (Desktop) */}
          <div className="hidden lg:block">
            <Link
              href="/contact"
              className="bg-[#3d2b1f] text-[#d4af37] border border-[#d4af37] px-6 py-2 rounded-full text-sm font-bold hover:bg-[#d4af37] hover:text-[#3d2b1f] transition-all duration-300 shadow-xl"
            >
              تواصل معنا
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? "text-[#3d2b1f] bg-gray-100"
                : "text-[#3d2b1f] bg-gray-100"
            }`}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer (Side Menu) */}
      <div
        className={`fixed inset-0 z-[200] transition-visibility duration-300 ${
          menuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-[#3d2b1f]/60 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-[#faf7f2] shadow-2xl transition-transform duration-500 ease-in-out transform ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          dir="rtl"
        >
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="p-6 flex justify-between items-center border-b border-[#3d2b1f]/10 bg-[#3d2b1f] text-white">
              <span className="font-bold text-lg tracking-widest uppercase">
                القائمة
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Drawer Links */}
            <nav className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-xl text-[#3d2b1f] hover:bg-[#3d2b1f] hover:text-[#d4af37] transition-all duration-300 group"
                >
                  <span className="p-2 bg-gray-100 rounded-lg group-hover:bg-white/10 transition-colors">
                    {link.icon}
                  </span>
                  <span className="font-bold text-lg">{link.name}</span>
                </Link>
              ))}
            </nav>

            {/* Drawer Footer */}
            <div className="mt-auto p-8 border-t border-[#3d2b1f]/10">
              <div className="bg-[#8b5e34]/10 p-6 rounded-2xl text-center">
                <p className="text-[#3d2b1f] text-sm font-bold mb-3">
                  نحن نساعدك في تصميم بيت أحلامك
                </p>
                <Link
                  href="/contact"
                  className="inline-block w-full py-3 bg-[#3d2b1f] text-white rounded-xl font-bold hover:bg-[#8b5e34] transition-colors"
                >
                  تواصل معنا الان
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
