"use client";

import {
  FaPhoneAlt,
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative text-[#3e2f1c]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/wood-footer.jpg')" }}
      />
      <div className="absolute inset-0 bg-white/50" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/logo.png"
              alt="Zawaya"
              width={140}
              height={60}
              className="mb-6 rounded-[50px]"
            />
            <p className="text-sm leading-relaxed text-[#5a4632] max-w-sm">
              زوايا متخصصة في تصميم وتنفيذ المطابخ وغرف الملابس بأعلى جودة
              وتشطيب، لنحوّل كل مساحة لرؤية عملية وأنيقة.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-bold text-lg mb-6">روابط سريعة</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="/" className="hover:text-[#8b6b3d] transition">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="/projects" className="hover:text-[#8b6b3d] transition">
                  أعمالنا
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-[#8b6b3d] transition">
                  منتجاتنا
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#8b6b3d] transition">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-bold text-lg mb-6">تواصل معنا</h4>

            <div className="space-y-4 text-sm">
              <a
                href="tel:01092141964"
                className="flex items-center gap-3 hover:text-[#8b6b3d]"
              >
                <FaPhoneAlt />
                0109-214-1964
              </a>

              <a
                href="https://wa.me/201092141964"
                target="_blank"
                className="flex items-center gap-3 hover:text-[#8b6b3d]"
              >
                <FaWhatsapp />
                واتساب
              </a>

              <div className="flex gap-4 pt-4">
                <a className="hover:text-[#8b6b3d]" href="#">
                  <FaInstagram />
                </a>
                <a className="hover:text-[#8b6b3d]" href="#">
                  <FaFacebookF />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-[#c4a484]/50" />

        {/* Copyright */}
        <div className="text-center text-xs text-[#6b5b4a]">
          © {new Date().getFullYear()} زوايا — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
