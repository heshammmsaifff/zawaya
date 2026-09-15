"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsPointingOutIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ImageLightbox from "@/components/ImageLightbox";

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // جلب البيانات من Supabase
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select(
            `id, title, description, project_images (id, image_url, sort_order)`
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data?.project_images) {
          data.project_images.sort((a, b) => a.sort_order - b.sort_order);
        }
        setProject(data);
      } catch (error) {
        console.error("Error:", error?.message);
        router.push("/projects");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProjectDetails();
  }, [id, router]);

  const nextSlide = useCallback(() => {
    if (!project?.project_images?.length) return;
    setCurrentIndex((prev) =>
      prev === project.project_images.length - 1 ? 0 : prev + 1
    );
  }, [project]);

  const prevSlide = () => {
    if (!project?.project_images?.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? project.project_images.length - 1 : prev - 1
    );
  };

  // مراجع إحداثيات اللمس لمنع تداخل السكرول الرأسي مع السحب الأفقي
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchEndX = useRef(null);
  const touchEndY = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = (touchStartY.current || 0) - (touchEndY.current || 0);

    // التأكد من أن السحب أفقي بوضوح لتفادي تعارض سكرول الصفحة
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 40) {
        // سحب لليسار -> السابق في RTL
        prevSlide();
      } else if (diffX < -40) {
        // سحب لليمين -> التالي في RTL
        nextSlide();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  if (loading) return <LoadingSpinner />;
  if (!project) return null;

  const imagesList = project.project_images || [];

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24 pt-24 mt-10" dir="rtl">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ac8918] transition-all font-bold mb-4 group"
            >
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <span>العودة للمشاريع</span>
            </Link>
            <h1 className="text-3xl md:text-5xl font-black text-[#3e2f1c]">
              {project.title}
            </h1>
          </motion.div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 bg-[#ac8918]/10 hover:bg-[#ac8918] text-[#ac8918] hover:text-white px-4 py-2 rounded-2xl text-xs font-bold transition-all border border-[#ac8918]/20"
            >
              <ArrowsPointingOutIcon className="w-4 h-4" />
              <span>معاينة مكبرة</span>
            </button>
            <div className="text-[#ac8918] font-black text-lg md:text-xl">
              {String(currentIndex + 1).padStart(2, "0")}{" "}
              <span className="text-gray-200 mx-1">/</span>
              <span className="text-gray-300 text-sm">
                {String(imagesList.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Main Slider مع دعم السحب والنقر للتكبير */}
        <div className="relative rounded-md overflow-hidden bg-white shadow-2xl border border-gray-100 shadow-[#ac8918]/10">
          {/* زر شاشة كاملة عائم على الصورة */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            title="فتح الصورة بكامل الشاشة"
            className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/40 hover:bg-[#ac8918] backdrop-blur-md px-3 py-1.5 rounded-md text-white text-xs font-bold border border-white/15 transition-all shadow-xl hover:scale-105"
          >
            <ArrowsPointingOutIcon className="w-4 h-4" />
            <span className="hidden sm:inline">تكبير كامل</span>
          </button>

          {/* شارة عدد الصور */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-md text-white text-xs font-bold border border-white/15">
            <PhotoIcon className="w-4 h-4 text-[#d4af37]" />
            <span>{imagesList.length} صور</span>
          </div>

          <div
            className="aspect-[16/9] relative overflow-hidden cursor-zoom-in touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => setIsLightboxOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={imagesList[currentIndex]?.image_url}
                alt={`${project.title} - صورة ${currentIndex + 1}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="w-full h-full object-cover select-none"
              />
            </AnimatePresence>

            {/* أزرار التنقل - مخفية تماماً على الموبايل */}
            <div
              className="hidden md:flex absolute inset-0 items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="p-3 rounded-full bg-black/40 hover:bg-[#ac8918] backdrop-blur-md text-white transition-all pointer-events-auto shadow-lg active:scale-95"
                aria-label="Previous Image"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="p-3 rounded-full bg-black/40 hover:bg-[#ac8918] backdrop-blur-md text-white transition-all pointer-events-auto shadow-lg active:scale-95"
                aria-label="Next Image"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {imagesList.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(i);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    i === currentIndex
                      ? "w-8 bg-[#ac8918] h-1.5 shadow-md"
                      : "w-1.5 bg-white/60 h-1.5 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* شريط المصغرات التفاعلي لتصفح فوري لجميع الصور */}
        {imagesList.length > 1 && (
          <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {imagesList.map((img, i) => (
              <button
                key={img.id || i}
                onClick={() => setCurrentIndex(i)}
                className={`relative shrink-0 w-20 h-14 sm:w-24 sm:h-18 rounded-md overflow-hidden transition-all duration-300 border-2 ${
                  i === currentIndex
                    ? "border-[#ac8918] shadow-lg shadow-[#ac8918]/20 scale-105"
                    : "border-transparent opacity-60 hover:opacity-100 hover:scale-102"
                }`}
              >
                <img
                  src={img.image_url}
                  alt={`مصغر ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Content Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-50">
              <h3 className="text-xl font-black text-[#3e2f1c] mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#ac8918]"></span>
                عن المشروع
              </h3>
              <p className="text-gray-500 text-lg leading-[1.8] font-medium whitespace-pre-line">
                {project.description}
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-[#3e2f1c] text-white p-8 rounded-lg shadow-xl">
              <h4 className="text-[#ac8918] font-bold text-xs uppercase tracking-[0.2em] mb-4">
                التنفيذ
              </h4>
              <p className="text-lg font-bold mb-6">زويا للحلول المتكاملة</p>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full bg-[#ac8918] hover:bg-[#c5a059] text-white py-4 rounded-md font-black transition-all shadow-lg active:scale-95"
              >
                اطلب استشارة
                <ArrowRightIcon className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* عارض الصور المتقدم بالشاشة الكاملة */}
      {isLightboxOpen && (
        <ImageLightbox
          isOpen={isLightboxOpen}
          images={imagesList}
          initialIndex={currentIndex}
          title={project.title}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
      <div className="w-12 h-12 border-4 border-[#ac8918]/10 border-t-[#ac8918] rounded-full animate-spin"></div>
    </div>
  );
}
