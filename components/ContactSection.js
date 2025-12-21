"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import Swal from "sweetalert2";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
        text: "شكراً لتواصلك مع زوايا، فريقنا هيراجع رسالتك ويتواصل معك قريباً.",
        confirmButtonText: "تمام",
        confirmButtonColor: "#3e2f1c",
        background: "#fdfaf6",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ",
        text: "حصلت مشكلة أثناء إرسال الرسالة، حاول مرة أخرى.",
        confirmButtonText: "إغلاق",
        confirmButtonColor: "#3e2f1c",
      });
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-32 px-6 bg-gradient-to-br from-[#f5efe6] via-[#e7d8c3] to-[#c4a484]"
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#3e2f1c] mb-6">
          تواصل معنا
        </h2>
        <p className="text-lg text-[#6b5b4a] max-w-2xl mx-auto">
          سيب رسالتك و فريق زوايا هيتواصل معاك في أقرب وقت
        </p>
      </motion.div>

      {/* Content */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14">
        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[#3e2f1c]"
        >
          <h3 className="text-2xl font-bold mb-6">خلينا نبدأ مشروعك</h3>

          <p className="mb-8 leading-relaxed text-[#5a4632]">
            فريقنا جاهز يساعدك في تصميم وتنفيذ مطبخك أو غرفة ملابسك بأعلى جودة
            وتشطيب.
          </p>

          <div className="space-y-4">
            <a
              href="tel:01092141964"
              className="flex text-[30px] items-center gap-3 font-semibold"
            >
              <FaPhoneAlt size={30} />
              0109-214-1964
            </a>

            <a
              href="https://wa.me/201092141964"
              target="_blank"
              className="flex text-[30px] items-center gap-3 font-semibold"
            >
              <FaWhatsapp size={30} />
              واتساب
            </a>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl"
        >
          <div className="mb-5">
            <input
              type="text"
              name="name"
              placeholder="الاسم"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl px-5 py-4 border border-[#d6c2a6] focus:outline-none"
            />
          </div>

          <div className="mb-5">
            <input
              dir="rtl"
              type="tel"
              name="phone"
              placeholder="رقم الهاتف"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full rounded-xl px-5 py-4 border border-[#d6c2a6] focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <textarea
              name="message"
              placeholder="رسالتك"
              rows="4"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full rounded-xl px-5 py-4 border border-[#d6c2a6] focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3e2f1c] hover:bg-[#2d2216] text-white font-bold py-4 rounded-full transition"
          >
            {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6b5b4a]">
              ⏱ سيتم التواصل معكم بحد أقصي خلال
              <span className="font-bold text-[#3e2f1c]"> 24 ساعة </span>
              من وقت إرسال الرسالة
            </p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
