"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("messages").insert([form]);

    setLoading(false);

    if (!error) {
      setForm({ name: "", phone: "", message: "" });
      Swal.fire({
        icon: "success",
        title: "تم استلام رسالتك بنجاح",
        text: "شكراً لتواصلك مع زوايا، فريقنا سيراجع رسالتك ويتواصل معك قريباً.",
        confirmButtonText: "موافق",
        confirmButtonColor: "#ac8918",
        background: "#ffffff",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ ما",
        text: "تعذر إرسال الرسالة حالياً، يرجى المحاولة مرة أخرى.",
        confirmButtonText: "إغلاق",
        confirmButtonColor: "#3e2f1c",
      });
    }
  };

  return (
    <section
      id="contact"
      dir="rtl"
      className="relative py-24 px-6 bg-[#fdfbf7] overflow-hidden"
    >
      {/* عناصر ديكورية في الخلفية */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#ac8918]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#3e2f1c]/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* العناوين */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-[#3e2f1c] mb-4"
          >
            دعنا نصمم <span className="text-[#ac8918]">مساحتك</span> القادمة
          </motion.h2>
          <div className="w-20 h-1 bg-[#ac8918] mx-auto rounded-full mb-6" />
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            سواء كنت تخطط لمطبخ أحلامك أو غرفة ملابس بتنظيم ذكي، نحن هنا لنجعل
            الأمر حقيقة.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* الجانب الأيمن: معلومات الاتصال */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-[#ac8918]/5 border border-gray-100">
              <h3 className="text-2xl font-bold text-[#3e2f1c] mb-8">
                معلومات التواصل
              </h3>

              <div className="space-y-6">
                <ContactInfoItem
                  icon={<FaPhoneAlt />}
                  title="اتصل بنا"
                  value="0109-214-1964"
                  link="tel:01092141964"
                />
                <ContactInfoItem
                  icon={<FaWhatsapp className="text-green-600" />}
                  title="واتساب"
                  value="تحدث معنا مباشرة"
                  link="https://wa.me/201092141964"
                />
                {/* <ContactInfoItem
                  icon={<FaMapMarkerAlt className="text-red-500" />}
                  title="المقر الرئيسي"
                  value="القاهرة، جمهورية مصر العربية"
                  link="#"
                /> */}
              </div>
            </div>

            {/* بطاقة الدعم السريع */}
            <div className="bg-[#3e2f1c] p-8 rounded-[2rem] text-white">
              <h4 className="text-xl font-bold mb-2">ساعات العمل</h4>
              <p className="text-gray-400 text-sm mb-4">
                نحن متواجدون لخدمتكم طوال الأسبوع
              </p>
              <p className="text-[#ac8918] font-bold">
                10:00 صباحاً - 10:00 مساءً
              </p>
            </div>
          </motion.div>

          {/* الجانب الأيسر: نموذج الاتصال */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-50"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#3e2f1c] mr-2">
                    الاسم بالكامل
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="أدخل اسمك هنا"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 rounded-2xl px-6 py-4 border border-transparent focus:border-[#ac8918] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#3e2f1c] mr-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="01xxxxxxxxx"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 rounded-2xl px-6 py-4 border border-transparent focus:border-[#ac8918] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#3e2f1c] mr-2">
                  تفاصيل المشروع
                </label>
                <textarea
                  name="message"
                  placeholder="كيف يمكننا مساعدتك في مشروعك القادم؟"
                  rows="4"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 rounded-2xl px-6 py-4 border border-transparent focus:border-[#ac8918] focus:bg-white focus:outline-none transition-all resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#ac8918] hover:bg-[#3e2f1c] text-white font-black text-lg py-5 rounded-2xl shadow-xl shadow-[#ac8918]/20 transition-all duration-300 disabled:bg-gray-400"
              >
                {loading ? "جاري الإرسال..." : "إرسال الطلب الآن"}
              </motion.button>

              <p className="text-center text-sm text-gray-400 mt-4">
                ⏱ نعدك بالرد خلال أقل من 24 ساعة عمل.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// مكون فرعي لعناصر معلومات الاتصال لسهولة الإدارة
function ContactInfoItem({ icon, title, value, link }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-5 group"
    >
      <div className="w-14 h-14 bg-[#fdfbf7] text-[#ac8918] rounded-2xl flex items-center justify-center text-xl group-hover:bg-[#ac8918] group-hover:text-white transition-all duration-300 shadow-sm">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {title}
        </h4>
        <p className="text-lg font-bold text-[#3e2f1c] group-hover:text-[#ac8918] transition-colors">
          {value}
        </p>
      </div>
    </a>
  );
}
