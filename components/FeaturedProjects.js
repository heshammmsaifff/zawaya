"use client";

import { motion } from "framer-motion";

const projects = [
  {
    id: 1,
    title: "مطبخ مودرن",
    category: "مطابخ",
    image: "/kitchen1.jpg",
  },
  {
    id: 2,
    title: "غرفة ملابس كلاسيك",
    category: "غرف ملابس",
    image: "/closet1.jpg",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="py-20 bg-gray-100" id="FeaturedProjects">
      <div className="container mx-auto px-6">
        {/* title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            أهم منتجاتنا
          </h2>
          <p className="text-gray-600 text-lg">منتجاتنا المميزة بالجودة</p>
        </motion.div>

        {/* cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition"
            >
              {/* image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              {/* content */}
              <div className="p-5 text-center">
                <span className="text-sm text-[#ac8918] font-bold block mb-2">
                  {project.category}
                </span>
                <h3 className="text-lg font-bold">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <motion.a
            href="/products"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-[#634f0e] hover:bg-[#bfa520] text-white text-lg font-bold py-4 px-14 rounded-full shadow-lg transition"
          >
            عرض المزيد من التفاصيل
          </motion.a>
        </div>
      </div>
    </section>
  );
}
