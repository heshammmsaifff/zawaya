"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowsPointingOutIcon,
  ArrowTopRightOnSquareIcon,
  PhotoIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { FaFolderOpen } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import ImageLightbox from "@/components/ImageLightbox";

export default function ProjectsGallery() {
  const [lightboxProject, setLightboxProject] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select(
            `
            id, 
            title, 
            description, 
            project_images (id, image_url, sort_order)
          `
          )
          .order("id", { ascending: false })
          .limit(4);

        if (error) throw error;

        const formatted = (data || []).map((p) => {
          const sortedImgs = (p.project_images || []).sort(
            (a, b) => a.sort_order - b.sort_order
          );
          return {
            ...p,
            mainImage: sortedImgs[0]?.image_url || "/placeholder.jpg",
            allImages: sortedImgs.map((img) => img.image_url),
          };
        });

        setDbProjects(formatted);
      } catch (err) {
        console.error("Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  const openLightbox = (project, index = 0) => {
    if (!project.allImages || project.allImages.length === 0) return;
    setLightboxProject(project);
    setLightboxIndex(index);
  };

  const Skeleton = () => (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="aspect-[4/5] bg-gray-200 animate-pulse rounded-md"
        />
      ))}
    </div>
  );

  return (
    <section dir="rtl" className="relative py-32 px-6 bg-[#fcfcfc]" id="projects-gallery">
      {/* خلفية جمالية خفيفة */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#ac8918]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#3e2f1c]/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ac8918]/10 text-[#ac8918] font-bold text-xs uppercase tracking-widest mb-4">
            <span>سجل الإبداع والتميز</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-[#3e2f1c] mb-6">
            مشاريع <span className="text-[#ac8918]">نفخر</span> بها
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            نحول طموحات عملائنا إلى واقع ملموس يتسم بالفخامة والدقة في كل تفصيلة.
          </p>
        </motion.div>

        {/* Gallery Grid or Empty State */}
        {loading ? (
          <Skeleton />
        ) : dbProjects.length > 0 ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
            {dbProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="relative group overflow-hidden rounded-md shadow-xl hover:shadow-2xl hover:shadow-[#ac8918]/15 bg-white aspect-[4/5] border border-gray-100 transition-all duration-500"
              >
                {/* صورة المشروع */}
                <img
                  src={project.mainImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* شارة عدد الصور في الزاوية العلوية */}
                <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-md text-xs font-bold text-white border border-white/10 shadow-lg">
                  <PhotoIcon className="w-4 h-4 text-[#d4af37]" />
                  <span>{project.allImages.length} صور</span>
                </div>

                {/* زر فوري للمعاينة السريعة للشاشة الكاملة */}
                <button
                  onClick={() => openLightbox(project, 0)}
                  title="فتح الصور بدقة كاملة"
                  className="absolute top-6 left-6 z-20 p-3 bg-black/40 hover:bg-[#ac8918] backdrop-blur-md rounded-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-105"
                >
                  <ArrowsPointingOutIcon className="w-5 h-5" />
                </button>

                {/* التدرج والتفاصيل عند التمرير */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b140c]/95 via-[#231a0f]/50 to-transparent flex flex-col justify-end p-8 md:p-12 transition-all duration-500">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white text-3xl font-black mb-3 leading-tight drop-shadow-md">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base line-clamp-2 mb-6 opacity-90 leading-relaxed font-normal">
                      {project.description}
                    </p>

                    {/* أزرار الإجراءات بحواف حادة */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => openLightbox(project, 0)}
                        className="inline-flex items-center gap-2 bg-[#ac8918] hover:bg-[#c5a059] text-white px-5 py-2.5 rounded-md font-bold text-sm transition-all shadow-lg active:scale-95"
                      >
                        <ArrowsPointingOutIcon className="w-4 h-4" />
                        <span>معاينة الصور كاملة</span>
                      </button>

                      <Link
                        href={`/projects/${project.id}`}
                        className="inline-flex items-center gap-2 bg-white/15 hover:bg-white text-white hover:text-[#3e2f1c] backdrop-blur-md border border-white/25 px-5 py-2.5 rounded-md font-bold text-sm transition-all active:scale-95"
                      >
                        <span>تفاصيل المشروع</span>
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State - الحالة الجذابة عند عدم وجود مشاريع */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto text-center py-20 px-8 rounded-[3rem] border-2 border-dashed border-[#ac8918]/20 bg-[#ac8918]/5"
          >
            <div className="w-24 h-24 bg-[#ac8918]/10 rounded-full flex items-center justify-center mx-auto mb-8 text-[#ac8918]">
              <FaFolderOpen size={40} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#3e2f1c] mb-4">
              نعمل حالياً على <span className="text-[#ac8918]">تحف فنية</span> جديدة
            </h3>
            <p className="text-gray-500 text-lg max-w-lg mx-auto mb-8">
              معرضنا يمتلئ دائماً بالإبداع. ترقبوا قريباً إضافة أحدث أعمالنا التي ستغير مفهوم الفخامة.
            </p>
          </motion.div>
        )}

        {/* Full Gallery CTA */}
        {dbProjects.length > 0 && (
          <div className="mt-20 text-center">
            <Link
              href="/projects"
              className="group relative inline-flex items-center gap-4 bg-[#ac8918] hover:bg-[#c5a059] text-white py-4 px-8 rounded-md overflow-hidden shadow-xl hover:shadow-[#ac8918]/30 transition-all duration-300"
            >
              <span className="text-lg font-bold">
                تصفح أرشيف مشاريعنا بالكامل
              </span>
              <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform" />
            </Link>
          </div>
        )}
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
    </section>
  );
}
