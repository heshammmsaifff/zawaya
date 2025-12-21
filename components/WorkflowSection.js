"use client";

import { motion } from "framer-motion";
import {
  FaRulerCombined,
  FaDraftingCompass,
  FaTools,
  FaTruck,
} from "react-icons/fa";

const steps = [
  {
    title: "المعاينة و القياس",
    desc: "نحدد المساحات بدقة ونفهم احتياجك بالكامل.",
    icon: <FaRulerCombined />,
  },
  {
    title: "التصميم ثلاثي الأبعاد",
    desc: "نقدملك تصور 3D واقعي قبل التنفيذ.",
    icon: <FaDraftingCompass />,
  },
  {
    title: "التنفيذ بأعلى جودة",
    desc: "تصنيع بخامات مختارة وتشطيب احترافي.",
    icon: <FaTools />,
  },
  {
    title: "التسليم والتركيب",
    desc: "تركيب دقيق وتسليم في الموعد.",
    icon: <FaTruck />,
    cta: true,
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.25 },
  },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function WorkflowSection() {
  return (
    <section className="relative py-32 px-6 bg-[#f6f1ea] overflow-hidden">
      {/* SVG LINE – Desktop */}
      <svg
        className="hidden md:block absolute top-1/2 left-0 w-full h-32 -translate-y-1/2"
        viewBox="0 0 1200 200"
        fill="none"
      >
        <motion.path
          d="M50 100 H1150"
          stroke="#c4a484"
          strokeWidth="2"
          strokeDasharray="10 10"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
        />
      </svg>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mb-24 relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#3e2f1c] mb-6">
          رحلتك معنا في زوايا
        </h2>
        <p className="text-lg text-[#6b5b4a] max-w-2xl mx-auto">
          خطوات واضحة، تجربة مريحة، ونتيجة تستحق.
        </p>
      </motion.div>

      {/* Steps */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10"
      >
        {steps.map((step, i) => (
          <motion.div key={i} variants={item} className="relative group">
            {/* Number */}
            <span className="absolute -top-10 left-4 text-7xl font-black text-[#c4a484]/15">
              {`0${i + 1}`}
            </span>

            {/* Card */}
            <div className="relative bg-white/70 backdrop-blur-lg rounded-3xl p-10 text-center shadow-md group-hover:shadow-2xl transition">
              <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#c4a484]/20 flex items-center justify-center text-3xl text-[#a8845b]">
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-[#3e2f1c] mb-3">
                {step.title}
              </h3>

              <p className="text-sm text-[#6b5b4a] leading-relaxed mb-6">
                {step.desc}
              </p>

              {/* CTA */}
              {step.cta && (
                <motion.a
                  href="/contact"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="inline-block mt-4 px-6 py-3 rounded-full bg-[#3e2f1c] text-white text-sm font-semibold hover:bg-[#2d2216] transition"
                >
                  ابدأ مشروعك الآن
                </motion.a>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile Timeline Line */}
      <div className="md:hidden absolute left-1/2 top-0 h-full w-px bg-[#c4a484]/30" />
    </section>
  );
}
