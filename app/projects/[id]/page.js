"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  PhotoIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* =========================
      جلب البيانات
  ========================= */
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

  /* =========================
      منطق التنقل (Slider)
  ========================= */
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

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-[#634f0e] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 pt-20" dir="rtl">
      <div className="max-w-5xl mx-auto px-6">
        {/* زر العودة السريع */}
        <div className="mb-6 mt-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#634f0e] transition-colors group"
          >
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>العودة للمشاريع</span>
          </Link>
        </div>

        {/* 1. العنوان */}
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            {project.title}
          </h1>
          <div className="w-16 h-1 bg-[#634f0e] mx-auto rounded-full"></div>
        </div>

        {/* 2. معرض الصور */}
        <div className="relative group overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-gray-100 aspect-[16/10] md:aspect-[16/8]">
          {project.project_images && project.project_images.length > 0 ? (
            <>
              {/* الصور مع تأثير التلاشي */}
              <div className="w-full h-full relative">
                {project.project_images.map((img, index) => (
                  <div
                    key={img.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                      index === currentIndex
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105 pointer-events-none"
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* أزرار التحكم الجانبية */}
              <button
                onClick={prevSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/10 backdrop-blur-md text-white hover:bg-black/30 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
              >
                <ChevronRightIcon className="w-8 h-8" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/10 backdrop-blur-md text-white hover:bg-black/30 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
              >
                <ChevronLeftIcon className="w-8 h-8" />
              </button>

              {/* نقاط التنقل السفلى */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {project.project_images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i === currentIndex
                        ? "w-8 bg-white shadow-lg"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <PhotoIcon className="w-20 h-20 text-gray-200" />
            </div>
          )}
        </div>

        {/* 3. وصف المشروع */}
        <div className="mt-12 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-50">
          <div className="flex items-center gap-3 mb-6 text-[#634f0e]">
            <span className="text-xl font-bold italic">التفاصيل</span>
            <div className="flex-1 h-[1px] bg-gray-100"></div>
          </div>
          <p className="text-gray-600 text-lg md:text-xl leading-[1.8] whitespace-pre-line text-justify">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}
