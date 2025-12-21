"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaExternalLinkAlt } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

export default function ProjectsGallery() {
  const [active, setActive] = useState(null);
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب أحدث مشروعين فقط
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
          .limit(2); // نريد أحدث 2 فقط

        if (error) throw error;

        // معالجة البيانات لجلب الصورة الأساسية (الأولى في الترتيب)
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
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  if (loading)
    return (
      <div className="py-20 text-center bg-[#f6f1ea]">جاري التحميل...</div>
    );

  return (
    <section className="py-32 px-6 bg-[#f6f1ea]">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#3e2f1c] mb-6">
          أحدث أعمالنا
        </h2>
        <p className="text-lg text-[#6b5b4a] max-w-2xl mx-auto">
          نستعرض لكم آخر المشاريع التي تم تنفيذها بجودة واحترافية عالية.
        </p>
      </motion.div>

      {/* Grid - سنستخدم 2 أعمدة فقط هنا لأننا نعرض مشروعين */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {dbProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] shadow-xl bg-white aspect-[4/5]"
            onClick={() => setActive(project)}
          >
            {/* Image */}
            <img
              src={project.mainImage}
              alt={project.title}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#3e2f1c]/90 via-[#3e2f1c]/40 to-transparent flex flex-col justify-end p-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition duration-500">
              <h3 className="text-white text-2xl font-bold mb-2">
                {project.title}
              </h3>
              <p className="text-gray-200 text-sm line-clamp-2 mb-6">
                {project.description}
              </p>
              <div className="flex items-center gap-3 text-[#c4a484] font-bold">
                <span>عرض التفاصيل</span>
                <FaExternalLinkAlt className="text-sm" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox - لعرض الصور كاملة عند الضغط */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-[#3e2f1c]/95 flex items-center justify-center p-6"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-6 right-6 z-10 bg-black/50 text-white p-3 rounded-full hover:bg-black transition"
              >
                <FaTimes />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-[400px] md:h-[600px]">
                  <img
                    src={active.mainImage}
                    alt={active.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-10 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold text-[#3e2f1c] mb-4">
                    {active.title}
                  </h2>
                  <div className="w-16 h-1 bg-[#c4a484] mb-6"></div>
                  <p className="text-[#6b5b4a] leading-relaxed mb-8">
                    {active.description}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {active.allImages.slice(1, 5).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        className="h-16 w-full object-cover rounded-lg border border-gray-100"
                        alt="preview"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA - زر عرض جميع الأعمال */}
      <div className="text-center mt-20">
        <p className="text-[#6b5b4a] mb-6 font-medium">
          هل تريد رؤية المزيد من مشاريعنا؟
        </p>
        <motion.a
          href="/projects"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-[#634f0e] hover:bg-[#3e2f1c] text-white text-lg font-bold py-5 px-16 rounded-full shadow-2xl transition-all duration-300"
        >
          استعراض معرض الأعمال كاملاً
        </motion.a>
      </div>
    </section>
  );
}
