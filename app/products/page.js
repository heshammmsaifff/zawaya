"use client";

import ProductShowcase from "@/components/ProductShowcase";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function ProductsPage() {
  return (
    <main dir="rtl" className="bg-[#fcfcfc] min-h-screen">
      {/* قسم الترويسة (Header) وزر العودة */}
      <div className="relative mt-10 pt-20 pb-10 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-black text-[#3e2f1c] mb-6 leading-tight">
            مساحات صُممت <br />
            <span className="text-[#ac8918]">لتلهمك</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed border-r-4 border-[#ac8918] pr-6">
            نحن لا نصنع أثاثاً فحسب، بل نبني بيئة متكاملة تجمع بين الراحة
            المطلقة والجمال العصري لتناسب نمط حياتك الفريد.
          </p>
        </motion.div>
      </div>

      {/* قسم المطابخ */}
      <section className="relative overflow-hidden">
        <div className="absolute top-40 right-0 w-96 h-96 bg-[#ac8918]/5 rounded-full blur-3xl -z-10" />
        <ProductShowcase
          subtitle="KITCHENS"
          title="المطابخ"
          tagline="حيث يلتقي التصميم الذكي مع الجودة التي تدوم"
          description="نُصمّم المطابخ لتكون قلب المنزل الحقيقي، جامعاً بين الأناقة العصرية والوظيفة العملية التي تلبي تطلعاتكم. نبتكر حلولاً ذكية تستغل كل شبر بجمالية فائقة، لنحول روتينكم اليومي إلى لحظات من الرفاهية والتميز. هدفنا هو تقديم مساحة تعكس شخصيتكم وتدوم معكم بجودتها العالية لسنوات طويلة."
          images={["/k3.jpg", "/k2.jpg", "/k1.jpg"]}
          reverse={true}
        />
      </section>

      {/* فاصل بصري ناعم */}
      <div className="flex justify-center py-10">
        <div className="w-24 h-px bg-gray-200" />
      </div>

      {/* قسم غرف الملابس */}
      <section className="relative overflow-hidden pb-20">
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-[#3e2f1c]/5 rounded-full blur-3xl -z-10" />
        <ProductShowcase
          subtitle="WARDROBES"
          title="غرف الملابس"
          tagline="تنظيم أنيق يعكس ذوقك ويمنحك راحة يومية"
          description="غرف الملابس لدينا ليست مجرد وحدات تخزين، بل هي ملاذكم الخاص الذي يجمع بين الفخامة والنظام المثالي. نُصممها بعناية فائقة لتعكس ذوقكم الشخصي، مع حلول ذكية تجعل الوصول لأشيائكم تجربة ممتعة كل صباح. إنها المساحة التي يبدأ منها يومكم بكل ثقة وأناقة."
          images={["/c1.jpg", "/c2.jpg", "/c3.jpg"]}
          reverse={false}
        />
      </section>

      {/* قسم الختام (CTA) */}
      <section className="bg-[#3e2f1c] py-24 px-6 text-center relative overflow-hidden">
        {/* خلفية زخرفية */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0 100 L100 0 L100 100 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#ac8918] font-bold tracking-widest mb-4"
          >
            هل أنت جاهز للخطوة القادمة؟
          </motion.h3>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-10 leading-snug">
            فلنبدأ برسم ملامح <br /> مساحتك المثالية معاً
          </h2>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/contact"
              className="inline-block bg-[#ac8918] hover:bg-white hover:text-[#3e2f1c] text-white text-xl font-black py-6 px-16 rounded-2xl shadow-2xl transition-all duration-500 ease-in-out"
            >
              احصل على استشارة مجانية الآن
            </Link>
          </motion.div>

          <p className="mt-8 text-gray-400 text-sm">
            نحن ملتزمون بتقديم أعلى معايير الجودة في كل تفصيلة.
          </p>
        </div>
      </section>
    </main>
  );
}
