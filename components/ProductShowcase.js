"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

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
  const sliderRef = useRef(null);

  const [active, setActive] = useState(0);

  /* Scroll animation */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        introRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Auto slider */
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const next = () => setActive((prev) => (prev + 1) % images.length);

  const prev = () =>
    setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-32 px-6 max-w-7xl mx-auto"
    >
      {/* Intro */}
      <div ref={introRef} className="text-center max-w-3xl mx-auto mb-20">
        <span className="uppercase tracking-[4px] text-sm text-[#9c7c55] font-semibold">
          {subtitle}
        </span>

        <h2 className="text-4xl md:text-5xl font-extrabold text-[#3e2f1c] mt-4 mb-4">
          {title}
        </h2>

        <p className="text-lg text-[#6b5b4a] mb-6">{tagline}</p>

        <div className="w-24 h-[2px] bg-[#c4a484] mx-auto rounded-full" />
      </div>

      {/* Content */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Image Slider */}
        <div className="relative w-full max-w-xl mx-auto">
          <div
            ref={sliderRef}
            className="relative h-[460px] rounded-3xl overflow-hidden"
          >
            {images.map((img, i) => {
              const isActive = i === active;
              return (
                <div
                  key={i}
                  className={`absolute inset-0 transition-all duration-700 ease-out
                    ${
                      isActive
                        ? "opacity-100 scale-100 z-20"
                        : "opacity-0 scale-105 z-10"
                    }`}
                >
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-full object-cover rounded-3xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
              );
            })}
          </div>

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute top-1/2 -translate-y-1/2 left-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center"
              >
                <FaChevronLeft />
              </button>

              <button
                onClick={next}
                className="absolute top-1/2 -translate-y-1/2 right-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-3 h-3 rounded-full transition
                    ${active === i ? "bg-[#634f0e] w-[30px]" : "bg-[#d6c2a6]"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Description (PC & Mobile) */}
        <div>
          <p className="text-lg leading-relaxed text-[#6b5b4a]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
