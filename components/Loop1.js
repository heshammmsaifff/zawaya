"use client";

import React from "react";
import { motion } from "framer-motion";

const Loop1 = ({
  texts = [
    "مطابخ حديثة",
    "غرف ملابس فاخرة",
    "ديكورات داخلية",
    "وحدات تخزين ذكية",
  ],
  speed = 20,
}) => {
  // مضاعفة النصوص لضمان استمرارية الحركة بدون فراغات
  const duplicatedTexts = [...texts, ...texts, ...texts];

  return (
    <div className="w-full bg-[#ac8918] py-6 relative overflow-hidden group">
      {/* طبقة التلاشي الجانبي - Masking Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#ac8918] via-transparent to-[#ac8918] opacity-100" />

      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div
          className="flex items-center"
          animate={{
            x: ["0%", "-50%"], // يتحرك من البداية حتى نصف القائمة لضمان التكرار السلس
          }}
          transition={{
            duration: speed,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedTexts.map((text, i) => (
            <div key={i} className="flex items-center" dir="rtl">
              <span className="text-white text-2xl md:text-3xl font-black mx-12 tracking-tight uppercase">
                {text}
              </span>
              {/* عنصر فاصل جمالي */}
              <div className="w-2 h-2 bg-[#3e2f1c] rounded-full opacity-40 shadow-sm" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Loop1;
