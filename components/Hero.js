"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";

const videos = [
  {
    id: 0,
    src: "/dressing.mp4",
    title: "فخامة تليق بخصوصيتك",
    subtitle: "تصاميم ذكية لغرف الملابس تستغل كل إنش بلمسة عصرية.",
  },
  {
    id: 1,
    src: "/kitchen.mp4",
    title: "مطبخك.. قلب منزلك النابض",
    subtitle:
      "نجمع بين كفاءة الأداء وجمال التصميم لنصنع لك تجربة طهي استثنائية.",
  },
];

const HeroSection = () => {
  const [currentVideo, setCurrentVideo] = useState(0);

  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  return (
    <section
      dir="rtl"
      className="py-30 relative md:mt-6 md:mx-6 md:rounded-[40px] min-h-[90vh] flex items-center justify-center overflow-hidden shadow-2xl"
    >
      {/* Background Videos with Crossfade */}
      <AnimatePresence mode="wait">
        <motion.video
          key={currentVideo}
          src={videos[currentVideo].src}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 blur-[3px] w-full h-full object-cover brightness-[0.6]"
        />
      </AnimatePresence>

      {/* Overlay Gradients for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />

      {/* Progress Bars (UX improvement) */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {videos.map((vid, index) => (
          <div
            key={index}
            className="h-1 w-12 bg-white/20 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-[#ac8918]"
              initial={{ width: 0 }}
              animate={{ width: currentVideo === index ? "100%" : "0%" }}
              transition={{ duration: currentVideo === index ? 10 : 0.5 }} // Adjust based on video length
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-right">
            <motion.div
              key={`text-${currentVideo}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.2]">
                <span className="block text-[#fff] text-2xl md:text-3xl mb-2 font-medium">
                  زوايا للتصميم الداخلي
                </span>
                {videos[currentVideo].title}
              </h1>

              <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-xl leading-relaxed">
                {videos[currentVideo].subtitle}
                <span className="block mt-4 text-sm md:text-lg font-light text-gray-300">
                  هدفنا ليس فقط التصميم، نحن نصنع أسلوب حياة يعكس شخصيتك بأعلى
                  معايير الجودة.
                </span>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05, backgroundColor: "#dccc19" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-[#ac8918] text-white text-lg font-bold rounded-xl shadow-[0_10px_20px_rgba(172,137,24,0.3)] transition-all text-center"
                >
                  احجز استشارتك المجانية
                </motion.a>
                <motion.a
                  href="/projects"
                  whileHover={{ scale: 1.05, borderColor: "#ac8918" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 border-2 border-white/50 text-white text-lg font-bold rounded-xl backdrop-blur-sm transition-all text-center hover:text-[#ac8918]"
                >
                  مشاهدة أعمالنا
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Logo / Brand Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-[#ac8918]/20 blur-[100px] rounded-full group-hover:bg-[#ac8918]/40 transition-all duration-500" />
              <img
                src="/logo-z-3.png"
                alt="Zaway Kitchens & Dressing"
                className="relative w-[250px] md:w-[500px] lg:w-[600px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Side Social Info (Optional UX touch) */}
      <div className="hidden lg:flex absolute left-10 bottom-10 flex-col gap-4 text-white/50 text-sm">
        <span className="rotate-90 origin-left mb-10 tracking-[3px] uppercase">
          Scroll to explore
        </span>
        <div className="w-[1px] h-20 bg-white/20 mx-auto" />
      </div>
    </section>
  );
};

export default HeroSection;
