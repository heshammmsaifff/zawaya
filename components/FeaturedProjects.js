"use client";

import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

const projects = [
  {
    id: 1,
    title: "مطبخ الترا مودرن",
    category: "أنظمة المطابخ الذكية",
    desc: "دمج بين تكنولوجيا الإضاءة المخفية واستغلال الزوايا بأسلوب عصري.",
    image: "/k1.jpg",
  },
  {
    id: 2,
    title: "خزانة الملابس",
    category: "غرف الملابس (Dressing)",
    desc: "تصميم مفتوح يجمع بين الأناقة الفندقية والتقسيم الوظيفي المريح.",
    image: "/c3.jpg",
  },
];

export default function FeaturedProjects() {
  return (
    <section dir="rtl" className="py-24 bg-white" id="FeaturedProjects">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-[#ac8918] font-bold text-sm tracking-widest uppercase mb-3">
              خدماتنا المميزة
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              إبداعات تجسد <span className="text-[#ac8918]">الفخامة</span> في كل
              زاوية
            </h3>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gray-500 text-lg max-w-sm"
          >
            نستعرض لكم جزءاً من خدماتنا التي نقوم بتنفيذها بأعلى معايير الدقة
            والاتقان لتناسب تطلعات عملائنا.
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-[40px] shadow-2xl">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                  <motion.div
                    initial={{ y: 20 }}
                    whileInView={{ y: 0 }}
                    className="flex justify-between items-center"
                  >
                    <div className="text-white">
                      <p className="text-[#ac8918] font-medium mb-2">
                        {project.category}
                      </p>
                      <h4 className="text-2xl font-bold">{project.title}</h4>
                    </div>
                    <div className="w-14 h-14 bg-[#ac8918] rounded-full flex items-center justify-center text-white text-xl">
                      <FaArrowLeft className="rotate-45 group-hover:rotate-0 transition-transform" />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Mobile/Static Content (Visible when not hovered on small screens) */}
              <div className="mt-6 px-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[#ac8918] text-sm font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#ac8918] transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-md">
                  {project.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full Portfolio CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-20"
        >
          <motion.a
            href="/products"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center gap-4 group"
          >
            <span className="text-xl font-bold text-gray-900 group-hover:text-[#ac8918] transition-colors">
              اكتشف المزيد عن خدماتنا
            </span>
            <div className="w-12 h-12 border-2 border-[#ac8918] rounded-full flex items-center justify-center text-[#ac8918] group-hover:bg-[#ac8918] group-hover:text-white transition-all">
              <FaArrowLeft />
            </div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
