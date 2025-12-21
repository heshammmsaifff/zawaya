"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PhotoIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
      Fetch Projects
  ========================= */
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          id,
          title,
          description,
          project_images (
            id,
            image_url,
            sort_order
          )
        `
        )
        .order("id", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#634f0e] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium tracking-widest">
            جاري تحميل المشاريع...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-30 px-6 sm:px-12" dir="rtl">
      {/* زر العودة السريع */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#634f0e] transition-colors group"
        >
          <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20 space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">
            معرض <span className="text-[#634f0e]">أعمالنا</span>
          </h1>
          <div className="w-24 h-1.5 bg-[#634f0e] mx-auto rounded-full"></div>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            نستعرض هنا مجموعة من أحدث مشاريعنا التي تم تنفيذها بأعلى معايير
            الجودة والاحترافية.
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
              >
                {/* Image Gallery Preview */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {project.project_images &&
                  project.project_images.length > 0 ? (
                    <img
                      src={
                        project.project_images.sort(
                          (a, b) => a.sort_order - b.sort_order
                        )[0].image_url
                      }
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <PhotoIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  {/* Image Count Badge */}
                  {project.project_images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                      +{project.project_images.length - 1} صور إضافية
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-8 flex flex-col flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#634f0e] transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-sm line-clamp-3 mb-6">
                    {project.description}
                  </p>

                  <Link
                    href={`/projects/${project.id}`}
                    className="text-[#634f0e] font-bold text-sm flex items-center gap-2 cursor-pointer hover:gap-3 transition-all"
                  >
                    عرض التفاصيل
                    <ArrowRightIcon className="w-4 h-4 rotate-180" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
            <PhotoIcon className="w-20 h-20 text-gray-200 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-400">
              لا توجد مشاريع منشورة حالياً.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
