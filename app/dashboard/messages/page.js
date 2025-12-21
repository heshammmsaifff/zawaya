"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { FaWhatsapp } from "react-icons/fa";

export default function MessagesDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  // التحقق من كلمة المرور
  const checkPassword = async () => {
    setChecking(true);
    try {
      const { data } = await supabase.from("pass").select("password").single();
      if (data?.password === password) {
        setAuthorized(true);
      } else {
        alert("❌ كلمة المرور غير صحيحة");
      }
    } catch (e) {
      alert("خطأ في الاتصال بقاعدة البيانات");
    } finally {
      setChecking(false);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching messages:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) {
      fetchMessages();
    }
  }, [authorized]);

  const deleteMessage = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة نهائياً؟")) return;

    try {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
      setMessages(messages.filter((m) => m.id !== id));
    } catch (err) {
      alert("فشل حذف الرسالة");
    }
  };

  if (!authorized) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-4"
        dir="rtl"
      >
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl w-full max-w-md border border-[#3d2b1f]/10 text-center">
          <div className="bg-[#3d2b1f] text-[#d4af37] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <EnvelopeIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#3d2b1f] mb-6">
            بريد الرسائل
          </h2>
          <input
            type="password"
            placeholder="كلمة المرور"
            className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#d4af37] rounded-2xl mb-4 outline-none transition-all text-center"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkPassword()}
          />
          <button
            onClick={checkPassword}
            disabled={checking}
            className="bg-[#3d2b1f] text-white w-full py-4 rounded-2xl font-bold hover:bg-[#5a402d] transition-all"
          >
            {checking ? "جاري التحقق..." : "دخول النظام"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-30 bg-[#fdfaf7] py-12 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto">
        {/* الهيدر العلوي */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-[#3d2b1f] p-8 rounded-[2rem] shadow-2xl text-white">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-[#d4af37]" />
              صندوق الوارد
            </h1>
            <p className="text-gray-300 mt-2">
              لديك {messages.length} رسالة من العملاء
            </p>
          </div>
          <button
            onClick={fetchMessages}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all border border-white/10"
          >
            <ArrowPathIcon
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
            />
            تحديث البيانات
          </button>
        </div>

        {/* قائمة الرسائل */}
        {loading ? (
          <div className="text-center py-20 text-[#3d2b1f] font-bold">
            جاري تحميل الرسائل...
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-gray-200">
            <EnvelopeIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-xl font-bold">
              الصندوق فارغ حالياً
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-[#3d2b1f]/5 hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* الخط الخشبي الجانبي */}
                <div className="absolute top-0 right-0 w-2 h-full bg-[#3d2b1f]" />

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* معلومات العميل */}
                  <div className="lg:w-1/4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[#faf7f2] rounded-2xl flex items-center justify-center text-[#3d2b1f] border border-[#d4af37]/20">
                        <span className="font-bold text-xl">
                          {msg.name ? msg.name[0] : "?"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-black text-[#3d2b1f] text-lg">
                          {msg.name}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                          <CalendarDaysIcon className="w-3 h-3" />
                          {new Date(msg.created_at).toLocaleDateString(
                            "ar-EG",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <a
                        href={`tel:${msg.phone}`}
                        className="flex items-center gap-2 text-sm text-[#3d2b1f] hover:text-[#d4af37] transition-colors p-3 bg-gray-50 rounded-xl"
                      >
                        <PhoneIcon className="w-4 h-4" />
                        <span dir="ltr">{msg.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/${msg.phone.replace(/\s+/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-green-700 hover:bg-green-100 transition-colors p-3 bg-green-50 rounded-xl font-bold"
                      >
                        <FaWhatsapp className="w-4 h-4" />
                        واتساب
                      </a>
                    </div>
                  </div>

                  {/* محتوى الرسالة */}
                  <div className="lg:w-2/3 border-r border-gray-100 pr-0 lg:pr-8">
                    <span className="text-[10px] uppercase tracking-[2px] text-gray-400 font-black mb-3 block">
                      نص الرسالة
                    </span>
                    <p className="text-[#6b5b4a] leading-relaxed whitespace-pre-line text-lg">
                      {msg.message}
                    </p>
                  </div>

                  {/* الحذف */}
                  <div className="lg:w-auto flex lg:flex-col justify-end items-center">
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      title="حذف"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
