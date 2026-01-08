"use client";

import {
  FaPhoneAlt,
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer dir="rtl" className="relative text-[#3e2f1c] overflow-hidden">
      {/* Background Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-110"
        style={{ backgroundImage: "url('/wood-footer.jpg')" }}
      />

      {/* Overlay - تحسين التباين باستخدام تأثير زجاجي ناعم */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-10 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Image
              src="/logo-z-11.png"
              alt="Zawaya Logo"
              width={160}
              height={50}
              className="mb-4 rounded-xl shadow-sm"
            />
            <p className="text-sm leading-[1.8] text-[#5a4632] font-medium">
              في <span className="font-bold text-[#8b6b3d]">زوايا</span>، نؤمن
              أن المطبخ وغرفة الملابس هما ركائز الراحة في منزلك. نصمم وننفذ
              بأعلى معايير الجودة لنلبي تطلعاتك.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-black text-lg mb-8 border-r-4 border-[#8b6b3d] pr-4">
              روابط سريعة
            </h4>
            <ul className="space-y-4 text-sm font-bold">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#8b6b3d] transition-all flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-[#8b6b3d] group-hover:w-4 transition-all"></span>
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-[#8b6b3d] transition-all flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-[#8b6b3d] group-hover:w-4 transition-all"></span>
                  أعمالنا
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#8b6b3d] transition-all flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-[#8b6b3d] group-hover:w-4 transition-all"></span>
                  منتجاتنا
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#8b6b3d] transition-all flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-[#8b6b3d] group-hover:w-4 transition-all"></span>
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-black text-lg mb-8 border-r-4 border-[#8b6b3d] pr-4">
              تواصل معنا
            </h4>
            <div className="space-y-5 text-sm font-bold">
              <a
                href="tel:01092141964"
                className="flex items-center gap-4 hover:text-[#8b6b3d] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#3e2f1c]/10 flex items-center justify-center group-hover:bg-[#8b6b3d] group-hover:text-white transition-all">
                  <FaPhoneAlt />
                </div>
                <span>0109-214-1964</span>
              </a>
              <a
                href="https://wa.me/201092141964"
                target="_blank"
                className="flex items-center gap-4 hover:text-[#8b6b3d] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-all">
                  <FaWhatsapp size={18} />
                </div>
                <span>واتساب مباشر</span>
              </a>
              {/* <div className="flex items-center gap-4 text-[#5a4632]">
                <div className="w-10 h-10 rounded-full bg-[#3e2f1c]/10 flex items-center justify-center">
                  <FaMapMarkerAlt />
                </div>
                <span>القاهرة، مصر</span>
              </div> */}
            </div>
          </motion.div>

          {/* Social Follow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-black text-lg mb-8 border-r-4 border-[#8b6b3d] pr-4">
              تابعنا
            </h4>
            <p className="text-xs text-[#5a4632] mb-6 font-bold uppercase tracking-wider">
              شاهد أحدث تصميماتنا يومياً
            </p>
            <div className="flex gap-4">
              <SocialIcon
                icon={<FaInstagram size={20} />}
                href="#"
                color="hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"
              />
              <SocialIcon
                icon={<FaFacebookF size={18} />}
                href="#"
                color="hover:bg-[#1877F2]"
              />
              <SocialIcon
                icon={<FaWhatsapp size={20} />}
                href="https://wa.me/201092141964"
                color="hover:bg-[#25D366]"
              />
            </div>
          </motion.div>
        </div>

        {/* Decorative Divider */}
        <div className="mt-16 mb-8 h-px bg-gradient-to-l from-transparent via-[#c4a484] to-transparent" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold text-[#6b5b4a] uppercase tracking-widest">
          <p>© {currentYear} ZAWAYA INTERIORS — جميع الحقوق محفوظة</p>
          {/* <div className="flex gap-6">
            <a href="#" className="hover:text-[#8b6b3d]">
              الشروط
            </a>
            <a href="#" className="hover:text-[#8b6b3d]">
              الخصوصية
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}

// مكون فرعي للأيقونات لتجنب التكرار
function SocialIcon({ icon, href, color }) {
  return (
    <a
      href={href}
      target="_blank"
      className={`w-12 h-12 rounded-2xl bg-[#3e2f1c]/5 flex items-center justify-center text-[#3e2f1c] ${color} hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm`}
    >
      {icon}
    </a>
  );
}
