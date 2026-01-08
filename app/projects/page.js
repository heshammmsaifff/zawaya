"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PhotoIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
            والجودة.
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
                  className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[#ac8918]/10 transition-all duration-500 border border-gray-50 flex flex-col h-full"
                >
                  {/* Image Gallery Preview */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-gray-100">
                    {project.project_images?.length > 0 ? (
                      <img
                        src={
                          project.project_images.sort(
                            (a, b) => a.sort_order - b.sort_order
                          )[0].image_url
                        }
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PhotoIcon className="w-12 h-12 text-gray-200" />
                      </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-[#3e2f1c] shadow-sm uppercase tracking-widest">
                      {project.project_images?.length || 0} صور للمشروع
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-10 flex flex-col flex-1 relative">
                    {/* <div className="absolute -top-10 left-10 w-20 h-20 bg-[#ac8918] rounded-3xl flex items-center justify-center text-white shadow-xl shadow-[#ac8918]/30 transform group-hover:-translate-y-2 transition-transform duration-500">
                      <PhotoIcon className="w-8 h-8" />
                    </div> */}

                    <h2 className="text-2xl font-black text-[#3e2f1c] mb-4 group-hover:text-[#ac8918] transition-colors leading-tight">
                      {project.title}
                    </h2>
                    <p className="text-gray-500 leading-relaxed text-sm line-clamp-2 mb-8 flex-1">
                      {project.description}
                    </p>

                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center gap-3 text-[#3e2f1c] font-black text-sm group/btn"
                    >
                      <span className="relative">
                        اكتشف المشروع
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ac8918] group-hover/btn:w-full transition-all duration-300"></span>
                      </span>
                      <ArrowRightIcon className="w-5 h-5 rotate-180 group-hover/btn:translate-x-[-5px] transition-transform text-[#ac8918]" />
                    </Link>
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
    </div>
  );
}
