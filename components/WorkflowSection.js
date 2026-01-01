"use client";

import { motion } from "framer-motion";
import React from "react";
import {
  FaRulerCombined,
  FaDraftingCompass,
  FaTools,
  FaTruck,
} from "react-icons/fa";

const steps = [
  {
    title: "المعاينة ورفع المقاسات",
    desc: "نبدأ بزيارة ميدانية لدراسة المساحة، الإضاءة، وتفاصيل المكان لضمان دقة تنفيذ تصل إلى الميليمتر.",
    icon: <FaRulerCombined />,
  },
  {
    title: "رؤية المستقبل (3D)",
    desc: "نحول أفكارك إلى واقع افتراضي ثلاثي الأبعاد، لتشاهد مطبخك أو خزانة ملابسك وتعدلها قبل البدء.",
    icon: <FaDraftingCompass />,
  },
  {
    title: "التصنيع والاتقان",
    desc: "داخل مصانعنا، نستخدم أحدث التقنيات مع أجود الخامات لضمان منتج يجمع بين المتانة والجمال.",
    icon: <FaTools />,
  },
  {
    title: "التركيب والتسليم",
    desc: "فريقنا المتخصص يقوم بالتركيب النهائي مع تنظيف الموقع، لنقدم لك مساحتك الجديدة جاهزة للاستخدام.",
    icon: <FaTruck />,
    cta: true,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function WorkflowSection() {
  return (
    <section
      dir="rtl"
      className="relative py-32 px-6 bg-[#fdfbf7] overflow-hidden"
    >
      {/* خلفية جمالية - دوائر ناعمة */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#ac8918]/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#ac8918]/5 rounded-full blur-[100px]" />
      </div>

      {/* الرأسية */}
      <div className="relative z-10 text-center mb-28">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[#ac8918] font-bold tracking-widest text-sm uppercase mb-4 block"
        >
          خطواتنا المدروسة
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-[#2d2216] mb-6"
        >
          كيف نحول <span className="text-[#ac8918]">حلمك</span> إلى واقع؟
        </motion.h2>
        <div className="w-24 h-1 bg-[#ac8918] mx-auto rounded-full" />
      </div>

      {/* الخط الرابط (Desktop) */}
      <div className="hidden lg:block absolute top-[55%] left-0 w-full z-0">
        <svg width="100%" height="100" viewBox="0 0 1200 100" fill="none">
          <motion.path
            d="M0 50 C 300 50, 600 50, 1200 50"
            stroke="#ac8918"
            strokeWidth="1"
            strokeDasharray="12 12"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* شبكة الخطوات */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
      >
        {steps.map((step, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="relative group"
          >
            {/* الرقم الخلفي */}
            <div className="absolute -top-12 right-0 text-8xl font-black text-[#ac8918]/5 group-hover:text-[#ac8918]/10 transition-colors duration-500">
              {i + 1}
            </div>

            {/* البطاقة */}
            <div className="relative flex flex-col items-center lg:items-start text-center lg:text-right">
              {/* الأيقونة */}
              <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl shadow-[#ac8918]/5 flex items-center justify-center text-3xl text-[#ac8918] mb-8 group-hover:bg-[#ac8918] group-hover:text-white transition-all duration-500 transform group-hover:rotate-[10deg]">
                {step.icon}
              </div>

              {/* المحتوى */}
              <h3 className="text-2xl font-bold text-[#2d2216] mb-4">
                {step.title}
              </h3>

              <p className="text-[#6b5b4a] leading-relaxed text-base md:text-lg opacity-80 group-hover:opacity-100 transition-opacity">
                {step.desc}
              </p>

              {/* زر الحركة الأخير */}
              {step.cta && (
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 px-8 py-3 rounded-xl bg-[#ac8918] text-white font-bold shadow-lg shadow-[#ac8918]/30 transition-all flex items-center gap-2"
                >
                  ابدأ رحلتك الآن
                  <span className="text-xl">←</span>
                </motion.a>
              )}
            </div>

            {/* سهم الربط بين البطاقات (Desktop) */}
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-10 -left-6 text-[#ac8918]/20 text-4xl">
                ←
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* خط الموبايل الجانبي */}
      <div className="lg:hidden absolute right-10 top-[20%] h-[70%] w-[1px] bg-gradient-to-b from-transparent via-[#ac8918]/20 to-transparent" />
    </section>
  );
}
