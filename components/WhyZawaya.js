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
    title: "تصميمات تُحاكي خيالك",
    desc: "فريقنا يحول مساحاتك الصامتة إلى لوحات فنية تجمع بين استغلال المساحة الذكي والأناقة العصرية.",
    number: "01",
  },
  {
    icon: <FaTools />,
    title: "جودة ألمانية، تنفيذ محلي",
    desc: "نستخدم أجود أنواع الأخشاب والإكسسوارات المقاومة للرطوبة والحرارة لضمان استدامة تدوم لسنوات.",
    number: "02",
  },
  {
    icon: <FaHandshake />,
    title: "التزام بمواعيد التسليم",
    desc: "وقتك ثمين، لذا نلتزم بجدول زمني دقيق يبدأ من التعاقد وينتهي بتركيب آخر قطعة في منزلك.",
    number: "03",
  },
  {
    icon: <FaCrown />,
    title: "ضمان وخدمة ما بعد البيع",
    desc: "علاقتنا بك لا تنتهي بالتسليم؛ نوفر ضماناً حقيقياً وخدمة صيانة دورية لضمان راحة بالك.",
    number: "04",
  },
];

export default function WhyZawaya() {
  return (
    <section dir="rtl" className="relative py-24 bg-[#fcfcfc] overflow-hidden">
      {/* عناصر ديكورية في الخلفية */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ac8918]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ac8918]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[#ac8918] font-bold tracking-[3px] uppercase text-sm mb-4 block">
            لماذا يختارنا النخبة؟
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            ما الذي يجعل <span className="text-[#ac8918]">"زوايا"</span> شريكك
            المثالي؟
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            نحن لا نصنع مطابخ أو خزائن فحسب، بل نبني بيئة مريحة ترفع من جودة
            حياتك اليومية بأعلى معايير الدقة.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative bg-white border border-gray-100 p-10 rounded-[30px] shadow-sm hover:shadow-2xl hover:shadow-[#ac8918]/10 transition-all duration-300"
            >
              {/* Card Number Background */}
              <span className="absolute top-6 left-8 text-6xl font-black text-gray-50 group-hover:text-[#ac8918]/10 transition-colors duration-300">
                {item.number}
              </span>

              {/* Icon */}
              <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-[#ac8918]/10 text-[#ac8918] text-3xl mb-8 group-hover:bg-[#ac8918] group-hover:text-white transition-all duration-300 shadow-inner">
                {item.icon}
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#ac8918] transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-[1.8] text-sm md:text-base">
                {item.desc}
              </p>

              {/* Bottom Decorative Line */}
              <div className="mt-6 w-0 h-1 bg-[#ac8918] group-hover:w-full transition-all duration-500 rounded-full" />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-20"
        >
          <div className="inline-flex flex-col items-center">
            <motion.a
              href="/contact"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(172,137,24,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1a1a1a] text-white text-lg font-bold py-5 px-16 rounded-2xl transition-all duration-300 flex items-center gap-3"
            >
              ابدأ مشروعك مع خبراء زوايا
              <span className="text-2xl">←</span>
            </motion.a>
            <p className="mt-4 text-gray-400 text-sm">
              استشارة فنية وتصميم مبدئي مجاناً لفترة محدودة
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
