"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  PhotoIcon,
  ArrowRightIcon,
  ArrowsPointingOutIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ImageLightbox from "@/components/ImageLightbox";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxProject, setLightboxProject] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

      const formatted = (data || []).map((p) => {
        const sorted = (p.project_images || []).sort(
          (a, b) => a.sort_order - b.sort_order
        );
        return {
          ...p,
          project_images: sorted,
          allImages: sorted.map((img) => img.image_url),
          mainImage: sorted[0]?.image_url || "/placeholder.jpg",
        };
      });

      setProjects(formatted);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openLightbox = (project, index = 0) => {
    if (!project.allImages || project.allImages.length === 0) return;
    setLightboxProject(project);
    setLightboxIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#ac8918]/20 border-t-[#ac8918] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#ac8918]">
              Z
            </div>
          </div>
          <p className="text-[#3e2f1c] font-black tracking-widest animate-pulse">
            جاري تحميل معرض الإبداع...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#fcfcfc] py-24 px-6 md:px-12 mt-10"
      dir="rtl"
    >
      {/* عناصر خلفية ديكورية */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#ac8918]/5 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* زر العودة */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-gray-400 hover:text-[#ac8918] transition-all group font-bold"
          >
            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#ac8918] transition-colors">
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
            <span>العودة للرئيسية</span>
          </Link>
        </motion.div>

        {/* Header Section */}
        <div className="mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ac8918]/10 text-[#ac8918] font-bold text-xs uppercase tracking-widest mb-3">
              <span>أعمال نفخر بها</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#3e2f1c] tracking-tight">
              قصص <span className="text-[#ac8918]">نجاح زوايا</span>
            </h1>
            <div className="w-32 h-2 bg-[#ac8918] mt-4 rounded-full"></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-2xl text-xl leading-relaxed font-medium"
          >
            كل مشروع هو رحلة فنية بدأناها بفكرة، وحوّلناها إلى واقع ينبض بالحياة
            والجودة بأدق التفاصيل.
          </motion.p>
        </div>

        {/* Projects Grid */}
        <AnimatePresence>
          {projects.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
            >
              {projects.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-md overflow-hidden shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[#ac8918]/15 transition-all duration-500 border border-gray-100 flex flex-col h-full hover:-translate-y-2"
                >
                  {/* Image Gallery Preview */}
                  <div
                    className="relative aspect-[16/11] overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => openLightbox(project, 0)}
                  >
                    {project.project_images?.length > 0 ? (
                      <img
                        src={project.mainImage}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PhotoIcon className="w-12 h-12 text-gray-200" />
                      </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md text-xs font-black text-[#3e2f1c] shadow-sm flex items-center gap-1.5">
                      <PhotoIcon className="w-4 h-4 text-[#ac8918]" />
                      <span>{project.project_images?.length || 0} صور</span>
                    </div>

                    {/* زر المعاينة الفورية عند التحويم */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLightbox(project, 0);
                        }}
                        className="px-4 py-3 bg-white/90 hover:bg-[#ac8918] hover:text-white text-[#3e2f1c] rounded-md shadow-2xl backdrop-blur-md transition-all flex items-center gap-2 font-bold text-sm transform scale-90 group-hover:scale-100"
                      >
                        <ArrowsPointingOutIcon className="w-5 h-5" />
                        <span>فتح الصور كاملة</span>
                      </button>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-8 md:p-10 flex flex-col flex-1 relative">
                    <h2 className="text-2xl font-black text-[#3e2f1c] mb-3 group-hover:text-[#ac8918] transition-colors leading-tight">
                      {project.title}
                    </h2>
                    <p className="text-gray-500 leading-relaxed text-sm line-clamp-2 mb-8 flex-1">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        onClick={() => openLightbox(project, 0)}
                        className="text-xs font-bold text-gray-500 hover:text-[#ac8918] transition-colors flex items-center gap-1.5"
                      >
                        <ArrowsPointingOutIcon className="w-4 h-4 text-[#ac8918]" />
                        <span>معاينة الصور ({project.project_images?.length || 0})</span>
                      </button>

                      <Link
                        href={`/projects/${project.id}`}
                        className="inline-flex items-center gap-2 text-[#3e2f1c] font-black text-sm group/btn hover:text-[#ac8918] transition-colors"
                      >
                        <span className="relative">
                          استعراض المشروع
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ac8918] group-hover/btn:w-full transition-all duration-300"></span>
                        </span>
                        <ArrowLeftIcon className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform text-[#ac8918]" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-gray-100"
            >
              <PhotoIcon className="w-20 h-20 text-gray-100 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-gray-300 tracking-widest">
                نعمل حالياً على توثيق مشاريع جديدة...
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* عارض الصور المتقدم بالشاشة الكاملة */}
      {lightboxProject && (
        <ImageLightbox
          isOpen={!!lightboxProject}
          images={lightboxProject.allImages}
          initialIndex={lightboxIndex}
          title={lightboxProject.title}
          onClose={() => setLightboxProject(null)}
        />
      )}
    </div>
  );
}
