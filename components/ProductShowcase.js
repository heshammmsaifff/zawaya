"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProductShowcase({
  title,
  subtitle,
  tagline,
  description,
  images = [],
  reverse = false,
}) {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const [active, setActive] = useState(0);

  /* Scroll animation using GSAP */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        introRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* Auto slider Logic */
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const next = () => setActive((prev) => (prev + 1) % images.length);
  const prev = () =>
    setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 px-6 max-w-7xl mx-auto"
      dir="rtl"
    >
      {/* Intro Section */}
      <div
        ref={introRef}
        className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-4"
      >
        <span className="uppercase tracking-[6px] text-xs md:text-sm text-[#ac8918] font-black">
          {subtitle}
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-[#3e2f1c] leading-tight">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-[#6b5b4a] font-medium leading-relaxed">
          {tagline}
        </p>
        <div className="w-20 h-1.5 bg-[#ac8918] mx-auto rounded-full opacity-30" />
      </div>

      {/* Main Content Grid */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center ${
          reverse ? "lg:direction-ltr" : ""
        }`}
      >
        {/* Image Slider Container */}
        <div className={`relative w-full group ${reverse ? "lg:order-2" : ""}`}>
          <motion.div
            className="relative h-[400px] md:h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#ac8918]/10 touch-none bg-gray-50"
            // Swipe Support
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset }) => {
              if (offset.x < -50) next();
              if (offset.x > 50) prev();
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={active}
                src={images[active]}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                alt={title}
              />
            </AnimatePresence>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#3e2f1c]/40 via-transparent to-transparent pointer-events-none" />

            {/* Desktop Arrows (Hidden on Mobile) */}
            <div className="absolute inset-0 hidden md:flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-[#ac8918] transition-all flex items-center justify-center shadow-xl"
              >
                <FaChevronRight size={18} />
              </button>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-[#ac8918] transition-all flex items-center justify-center shadow-xl"
              >
                <FaChevronLeft size={18} />
              </button>
            </div>
          </motion.div>

          {/* Dots Pagination */}
          {images.length > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-500 
                    ${
                      active === i
                        ? "bg-[#ac8918] w-10 shadow-lg shadow-[#ac8918]/20"
                        : "bg-gray-200 w-2 hover:bg-gray-300"
                    }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Text Description Section */}
        <motion.div
          initial={{ opacity: 0, x: reverse ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="inline-block p-4 bg-[#ac8918]/5 rounded-2xl border-r-4 border-[#ac8918]">
            <p className="text-[#3e2f1c] text-lg md:text-xl font-bold leading-relaxed">
              {description}
            </p>
          </div>

          <ul className="space-y-4">
            {[
              "خامات عالمية بلمسة محلية",
              "تصميمات ذكية تستغل المساحات",
              "ضمان حقيقي وخدمة ما بعد البيع",
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-[#6b5b4a] font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-[#ac8918]" />
                {item}
              </li>
            ))}
          </ul>

          {/* <button className="px-10 py-4 bg-[#3e2f1c] text-white rounded-xl font-black hover:bg-[#ac8918] transition-all shadow-xl shadow-[#3e2f1c]/10 active:scale-95">
            اكتشف المجموعة كاملة
          </button> */}
        </motion.div>
      </div>
    </section>
  );
}
