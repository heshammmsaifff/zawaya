"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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
        console.error("Error:", error.message);
        router.push("/projects");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProjectDetails();
  }, [id, router]);

  const nextSlide = useCallback(() => {
    if (!project?.project_images.length) return;
    setCurrentIndex((prev) =>
      prev === project.project_images.length - 1 ? 0 : prev + 1
    );
  }, [project]);

  const prevSlide = () => {
    if (!project?.project_images.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? project.project_images.length - 1 : prev - 1
    );
  };

  if (loading) return <LoadingSpinner />;
  if (!project) return null;

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

          <div className="text-[#ac8918] font-black text-lg md:text-xl">
            {String(currentIndex + 1).padStart(2, "0")}{" "}
            <span className="text-gray-200 mx-1">/</span>
            <span className="text-gray-300 text-sm">
              {String(project.project_images.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Main Slider مع دعم السحب (Swipe) */}
        <div className="relative rounded-[2rem] overflow-hidden bg-white shadow-2xl border border-gray-100 shadow-[#ac8918]/10 touch-none">
          <motion.div
            className="aspect-[16/9] relative overflow-hidden cursor-grab active:cursor-grabbing"
            // منطق السحب (Swipe Logic)
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = offset.x;
              if (swipe < -50) nextSlide(); // سحب لليسار
              else if (swipe > 50) prevSlide(); // سحب لليمين
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={project.project_images[currentIndex]?.image_url}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full h-full object-cover pointer-events-none"
              />
            </AnimatePresence>

            {/* أزرار التنقل - ظاهرة دائماً في الموبايل ومخفية في الديسك توب وتظهر عند التحويم */}
            <div className="absolute inset-0 flex items-center justify-between px-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full bg-black/20 md:bg-white/20 backdrop-blur-md text-white hover:bg-[#ac8918] transition-all pointer-events-auto shadow-lg"
                aria-label="Previous Image"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 rounded-full bg-black/20 md:bg-white/20 backdrop-blur-md text-white hover:bg-[#ac8918] transition-all pointer-events-auto shadow-lg"
                aria-label="Next Image"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {project.project_images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === currentIndex
                      ? "w-8 bg-[#ac8918] h-1.5"
                      : "w-1.5 bg-white/50 h-1.5"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-50">
              <h3 className="text-xl font-black text-[#3e2f1c] mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#ac8918]"></span>
                عن المشروع
              </h3>
              <p className="text-gray-500 text-lg leading-[1.8] font-medium">
                {project.description}
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-[#3e2f1c] text-white p-8 rounded-[2rem] shadow-xl">
              <h4 className="text-[#ac8918] font-bold text-xs uppercase tracking-[0.2em] mb-4">
                التنفيذ
              </h4>
              <p className="text-lg font-bold mb-6">زويا للحلول المتكاملة</p>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full bg-[#ac8918] text-white py-4 rounded-xl font-black transition-all"
              >
                اطلب استشارة
                <ArrowRightIcon className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
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
