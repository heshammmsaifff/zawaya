"use client";

import ProductShowcase from "@/components/ProductShowcase";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function ProductsPage() {
  return (
    <main className="bg-[#f6f1ea]">
      {/* زر العودة السريع */}
      <div className="mb-6 pt-30 pr-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#634f0e] transition-colors group"
        >
          <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>
      <ProductShowcase
        subtitle="KITCHENS"
        title="المطابخ"
        tagline="حيث يلتقي التصميم الذكي مع الجودة التي تدوم"
        description="نُصمّم المطابخ لتكون قلب المنزل الحقيقي، جامعاً بين الأناقة العصرية والوظيفة العملية التي تلبي تطلعاتكم. نبتكر حلولاً ذكية تستغل كل شبر بجمالية فائقة، لنحول روتينكم اليومي إلى لحظات من الرفاهية والتميز. هدفنا هو تقديم مساحة تعكس شخصيتكم وتدوم معكم بجودتها العالية لسنوات طويلة."
        images={["/kitchen1.jpg", "/kitchen2.jpg", "/kitchen1.jpg"]}
        reverse
      />

      <ProductShowcase
        subtitle="WARDROBES"
        title="غرف الملابس"
        tagline="تنظيم أنيق يعكس ذوقك ويمنحك راحة يومية"
        description="غرف الملابس لدينا ليست مجرد وحدات تخزين، بل هي ملاذكم الخاص الذي يجمع بين الفخامة والنظام المثالي. نُصممها بعناية فائقة لتعكس ذوقكم الشخصي، مع حلول ذكية تجعل الوصول لأشيائكم تجربة ممتعة كل صباح. إنها المساحة التي يبدأ منها يومكم بكل ثقة وأناقة."
        images={["/closet1.jpg", "/closet2.jpg", "/closet1.jpg"]}
      />

      {/* CTA */}
      <div className="text-center mt-10 pb-10">
        <motion.a
          href="/contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-[#634f0e] hover:bg-[#bfa520] text-white text-lg font-bold py-4 px-14 rounded-full shadow-xl transition"
        >
          تواصل معنا الآن لمزيد من التفاصيل
        </motion.a>
      </div>
    </main>
  );
}
