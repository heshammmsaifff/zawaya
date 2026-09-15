"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function ImageLightbox({
  isOpen,
  images = [],
  initialIndex = 0,
  title = "",
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const thumbnailsRef = useRef(null);

  // إحداثيات اللمس للتنقل بالسحب (Touch Swipe)
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  if (prevInitialIndex !== initialIndex) {
    setPrevInitialIndex(initialIndex);
    setCurrentIndex(initialIndex);
    setZoom(1);
  }

  // استخراج روابط الصور سواء كانت مصفوفة نصوص أو كائنات
  const imageList = images.map((img) =>
    typeof img === "string" ? img : img.image_url || img.url
  );

  const total = imageList.length;

  const nextImage = useCallback(() => {
    if (total <= 1) return;
    setZoom(1);
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  const prevImage = useCallback(() => {
    if (total <= 1) return;
    setZoom(1);
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  // معالجة السحب باللمس على شاشات الموبايل
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (zoom > 1) return; // عند التكبير، السحب يكون لتحريك الصورة وليس لتغييرها
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40; // مسافة السحب المحتسبة بالبكسل

    if (diffX > minSwipeDistance) {
      // سحب لليسار -> الصورة السابقة
      prevImage();
    } else if (diffX < -minSwipeDistance) {
      // سحب لليمين -> الصورة التالية
      nextImage();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // التحكم عبر لوحة المفاتيح في أجهزة الكمبيوتر
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        prevImage();
      } else if (e.key === "ArrowLeft") {
        nextImage();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-") {
        handleZoomOut();
      } else if (e.key === "0") {
        resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, nextImage, prevImage, onClose]);

  // التمرير التلقائي للمصغر المحدد في الشريط السفلي
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[currentIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentIndex]);

  if (!isOpen || total === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[9999] bg-[#0c0906]/95 backdrop-blur-2xl flex flex-col justify-between select-none text-white overflow-hidden"
        dir="rtl"
        onClick={() => {
          if (zoom === 1) onClose();
        }}
      >
        {/* شريط الأدوات العلوي (Header) متجاوب تماماً مع الشاشات الصغيرة */}
        <div
          className="relative z-50 flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-b from-black/80 to-transparent shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* عنوان المشروع والعداد */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            {title && (
              <h3 className="text-sm sm:text-lg font-bold text-white/90 truncate max-w-[140px] sm:max-w-md">
                {title}
              </h3>
            )}
            <div className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-black text-[#d4af37] border border-white/10 shrink-0">
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </div>
          </div>

          {/* أدوات التحكم (Zoom, Reset, Close) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              title="تكبير (+)"
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-all border border-white/10 text-white"
            >
              <MagnifyingGlassPlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              title="تصغير (-)"
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-all border border-white/10 text-white"
            >
              <MagnifyingGlassMinusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {zoom > 1 && (
              <button
                onClick={resetZoom}
                title="إعادة الحجم الافتراضي"
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#ac8918] hover:bg-[#c5a059] text-[11px] sm:text-xs font-bold transition-all text-white flex items-center gap-1 shadow-lg shadow-[#ac8918]/30"
              >
                <ArrowPathIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">إعادة الحجم</span>
              </button>
            )}

            <button
              onClick={onClose}
              title="إغلاق (Esc)"
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-red-500/80 transition-all border border-white/10 text-white mr-1 sm:mr-2"
            >
              <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* مساحة العرض الرئيسية للصورة - تدعم السحب باللمس على الموبايل */}
        <div
          className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => {
            if (e.target === e.currentTarget && zoom === 1) {
              onClose();
            }
          }}
        >
          {/* زر السابق - مخفي تماماً على الموبايل ويظهر فقط في الشاشات المتوسطة والكبيرة (md) */}
          {total > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              title="الصورة السابقة"
              className="hidden md:flex absolute right-4 md:right-8 z-30 p-3 sm:p-4 rounded-lg bg-black/40 hover:bg-[#ac8918] backdrop-blur-md text-white border border-white/15 transition-all shadow-2xl active:scale-95 items-center justify-center"
            >
              <ChevronRightIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* الصورة المعروضة مع ضمان ظهورها كاملة طولاً وعرضاً بدون أي اقتصاص */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative w-full h-full flex items-center justify-center p-1 sm:p-2"
              >
                <motion.img
                  src={imageList[currentIndex]}
                  alt={`${title} - ${currentIndex + 1}`}
                  animate={{ scale: zoom }}
                  drag={zoom > 1}
                  dragConstraints={{
                    left: -300 * (zoom - 1),
                    right: 300 * (zoom - 1),
                    top: -300 * (zoom - 1),
                    bottom: 300 * (zoom - 1),
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onDoubleClick={() => {
                    setZoom((prev) => (prev === 1 ? 2 : 1));
                  }}
                  className={`w-auto h-auto max-w-[96vw] md:max-w-[88vw] max-h-[calc(100dvh-125px)] md:max-h-[calc(100vh-140px)] object-contain rounded-none sm:rounded-sm shadow-2xl transition-shadow select-none ${
                    zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
                  }`}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* زر التالي - مخفي تماماً على الموبايل ويظهر فقط في الشاشات المتوسطة والكبيرة (md) */}
          {total > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              title="الصورة التالية"
              className="hidden md:flex absolute left-4 md:left-8 z-30 p-3 sm:p-4 rounded-lg bg-black/40 hover:bg-[#ac8918] backdrop-blur-md text-white border border-white/15 transition-all shadow-2xl active:scale-95 items-center justify-center"
            >
              <ChevronLeftIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}
        </div>

        {/* الشريط السفلي للمصغرات (Filmstrip) متجاوب تماماً بحواف حادة */}
        {total > 1 && (
          <div
            className="relative z-50 bg-gradient-to-t from-black/95 via-black/80 to-transparent py-2 sm:py-3 px-3 sm:px-6 border-t border-white/10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={thumbnailsRef}
              className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto py-1 scrollbar-none max-w-4xl mx-auto"
            >
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setZoom(1);
                    setCurrentIndex(idx);
                  }}
                  className={`relative shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-sm overflow-hidden transition-all duration-300 border-2 ${
                    currentIndex === idx
                      ? "border-[#d4af37] scale-105 sm:scale-110 shadow-lg shadow-[#d4af37]/30 ring-1 ring-[#d4af37]/40"
                      : "border-transparent opacity-50 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {currentIndex === idx && (
                    <div className="absolute inset-0 bg-[#d4af37]/10" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
