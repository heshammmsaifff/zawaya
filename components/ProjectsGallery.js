"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaExternalLinkAlt,
  FaImages,
  FaFolderOpen,
} from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

export default function ProjectsGallery() {
  const [active, setActive] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
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
            project_images (image_url, sort_order)
          `
          )
          .order("id", { ascending: false })
          .limit(2);

        if (error) throw error;

        const formatted = data.map((p) => ({
          ...p,
          mainImage:
            p.project_images?.sort((a, b) => a.sort_order - b.sort_order)[0]
              ?.image_url || "/placeholder.jpg",
          allImages:
            p.project_images
              ?.sort((a, b) => a.sort_order - b.sort_order)
              .map((img) => img.image_url) || [],
        }));

        setDbProjects(formatted);
      } catch (err) {
        console.error("Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  const openModal = (project) => {
    setActive(project);
    setSelectedImg(project.mainImage);
  };

  const Skeleton = () => (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="aspect-[4/5] bg-gray-200 animate-pulse rounded-[2.5rem]"
        />
      ))}
    </div>
  );

  return (
    <section dir="rtl" className="relative py-32 px-6 bg-[#fcfcfc]">
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black text-[#3e2f1c] mb-6">
            مشاريع <span className="text-[#ac8918]">نفخر</span> بها
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            نحول طموحات عملائنا إلى واقع ملموس يتسم بالفخامة والرقي.
          </p>
        </motion.div>

        {/* Gallery Grid or Empty State */}
        {loading ? (
          <Skeleton />
        ) : dbProjects.length > 0 ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {dbProjects.map((project) => (
              <motion.div
                key={project.id}
                layoutId={`card-${project.id}`}
                whileHover={{ y: -10 }}
                className="relative group cursor-pointer overflow-hidden rounded-[3rem] shadow-2xl bg-white aspect-[4/5]"
                onClick={() => openModal(project)}
              >
                <img
                  src={project.mainImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#231a0f] via-[#3e2f1c]/20 to-transparent flex flex-col justify-end p-8 md:p-12 transition-all duration-500">
                  <h3 className="text-white text-3xl font-black mb-3">
                    {project.title}
                  </h3>
                  <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-bold group-hover:bg-[#ac8918] group-hover:border-[#ac8918] transition-all w-fit">
                    اكتشف المشروع <FaExternalLinkAlt className="text-xs" />
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
              نعمل حالياً على <span className="text-[#ac8918]">تحف فنية</span>{" "}
              جديدة
            </h3>
            <p className="text-gray-500 text-lg max-w-lg mx-auto mb-8">
              معرضنا يمتلئ دائماً بالإبداع. ترقبوا قريباً إضافة أحدث أعمالنا
              التي ستغير مفهوم الفخامة.
            </p>
          </motion.div>
        )}

        {/* Full Gallery CTA */}
        {dbProjects.length > 0 && (
          <div className="mt-24 text-center">
            <motion.a
              href="/projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-4 bg-[#ac8918] text-white py-6 px-12 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-[#1a1a1a] w-0 group-hover:w-full transition-all duration-500 ease-out z-0" />
              <span className="relative z-10 text-xl font-bold">
                تصفح أرشيف مشاريعنا بالكامل
              </span>
              <span className="relative z-10 text-2xl group-hover:translate-x-[-8px] transition-transform">
                ←
              </span>
            </motion.a>
          </div>
        )}
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-[#1a150f]/98 flex items-center justify-center p-4 md:p-10 backdrop-blur-xl"
            onClick={() => setActive(null)}
          >
            <motion.div
              layoutId={`card-${active.id}`}
              className="relative max-w-6xl w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl h-fit max-h-[90vh] flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-6 right-6 z-50 bg-black/20 text-white p-4 rounded-full hover:bg-[#ac8918] transition-all"
              >
                <FaTimes size={20} />
              </button>

              <div className="md:w-3/5 h-[350px] md:h-[600px] relative bg-gray-200">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImg}
                    src={selectedImg}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>

              <div className="md:w-2/5 p-8 md:p-12 overflow-y-auto flex flex-col justify-between bg-white text-right">
                <div>
                  <h2 className="text-3xl font-black text-[#3e2f1c] mb-4">
                    {active.title}
                  </h2>
                  <p className="text-[#6b5b4a] text-lg leading-relaxed mb-8">
                    {active.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-[#ac8918] font-bold text-sm mb-4 uppercase tracking-wider">
                    صور المشروع
                  </h4>
                  <div className="grid grid-cols-4 gap-3">
                    {active.allImages.map((img, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedImg(img)}
                        className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedImg === img
                            ? "border-[#ac8918] shadow-lg"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img}
                          className="w-full h-full object-cover"
                          alt="thumbnail"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
