"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

const HeroSection = () => {
  const [currentVideo, setCurrentVideo] = useState(0);

  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };
  const videos = ["/dressing.mp4", "/kitchen.mp4"];

  return (
    <section
      dir="rtl"
      className="relative md:mt-10 md:mx-10 md:rounded-[30px] min-h-screen flex items-center justify-center overflow-hidden py-20"
    >
      {/* bg-vid */}
      <AnimatePresence mode="wait">
        <motion.video
          key={currentVideo}
          src={videos[currentVideo]}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="absolute inset-0 w-full h-full object-cover brightness-75 blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* layout */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 container mx-auto px-6  mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          {/* text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="text-center md:text-cetner max-w-2xl order-2 md:order-1"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight inline-grid gap-3 mb-6 mt-3">
              زوايا{" "}
              <span className="text-[#ac8918]">للمطابخ و غرف الملابس</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-5 leading-relaxed">
              <span className="font-bold block text-gray-300 mb-5">
                أفضل غرف الملابس و المطابخ مع زوايا
              </span>
              علامة متخصصة في تصميم و تنفيذ غرف الملابس و المطابخ
            </p>

            {/* CTA */}
            <div className="flex flex-col md:flex-row items-center md:justify-center gap-4 mt-6">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="w-full md:w-auto bg-[#968211] hover:bg-[#dccc19] text-white text-lg font-bold py-4 px-12 rounded-full shadow-lg transition-all duration-300 text-center"
              >
                ابدأ رحلتك في تأسيس منزلك
              </motion.a>
            </div>
          </motion.div>

          {/* logo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center md:justify-start order-1 md:order-2 md:mr-19"
          >
            <img
              src="/logo-z-3.png"
              alt="Logo"
              className="w-[280px] md:w-[990px] rounded-full drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
