"use client";

import { motion } from "framer-motion";
import {
  FaTools,
  FaCrown,
  FaHandshake,
  FaDraftingCompass,
} from "react-icons/fa";

const features = [
  {
    icon: <FaDraftingCompass />,
    title: "تصميمات مبتكرة",
    desc: "نقدم تصميمات عصرية تناسب جميع الأذواق والمساحات.",
  },
  {
    icon: <FaTools />,
    title: "تنفيذ بأعلى جودة",
    desc: "نستخدم أفضل الخامات وننفذ بأعلى معايير الدقة.",
  },
  {
    icon: <FaHandshake />,
    title: "التزام بالمواعيد",
    desc: "نلتزم بالتسليم في الوقت المتفق عليه بدون تأخير.",
  },
  {
    icon: <FaCrown />,
    title: "خبرة وثقة",
    desc: "سنوات من الخبرة جعلتنا الاختيار الأول لعملائنا.",
  },
];

export default function WhyZawaya() {
  return (
    <section className="py-24 bg-gray-100">
      <div className="container mx-auto px-6">
        {/* title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            ليه تختار زوايا؟
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            لأننا بنهتم بكل تفصيلة من أول التصميم لحد التسليم
          </p>
        </motion.div>

        {/* cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="group bg-gray-50 rounded-2xl p-8 text-center hover:shadow-xl transition"
            >
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-[#ac8918] text-white text-3xl mb-6 group-hover:scale-110 transition">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold mb-3">{item.title}</h3>

              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        {/* CTA */}
        <div className="text-center mt-14">
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-[#634f0e] hover:bg-[#bfa520] text-white text-lg font-bold py-4 px-14 rounded-full shadow-lg transition"
          >
            تواصل معنا الآن
          </motion.a>
        </div>
      </div>
    </section>
  );
}
