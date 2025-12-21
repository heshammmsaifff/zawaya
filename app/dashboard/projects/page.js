"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  PlusIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

/* =========================
    Helpers
========================= */
const getStoragePath = (url) => {
  const parts = url.split("/projects/");
  return parts[1];
};

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function ProjectsDashboard() {
  /* =========================
      State Management
  ========================= */
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  /* =========================
      Actions
  ========================= */
  const checkPassword = async () => {
    setChecking(true);
    try {
      const { data } = await supabase.from("pass").select("password").single();
      if (data?.password === password) setAuthorized(true);
      else alert("❌ كلمة المرور غير صحيحة");
    } catch (e) {
      alert("خطأ في الاتصال");
    } finally {
      setChecking(false);
    }
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `id, title, description, project_images (id, image_url, sort_order)`
      )
      .order("id", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      return;
    }

    const formattedData = data?.map((p) => ({
      ...p,
      project_images: (p.project_images || []).sort(
        (a, b) => a.sort_order - b.sort_order
      ),
    }));
    setProjects(formattedData || []);
  };

  useEffect(() => {
    if (authorized) fetchProjects();
  }, [authorized]);

  const addImages = (files) => {
    const mapped = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...mapped]);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("يرجى إضافة عنوان");
    setLoading(true);
    try {
      const { data: project, error: pErr } = await supabase
        .from("projects")
        .insert({ title, description })
        .select()
        .single();

      if (pErr) throw pErr;

      // رفع الصور
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const path = `${project.id}/${Date.now()}-${img.file.name}`;

        const { error: upErr } = await supabase.storage
          .from("projects")
          .upload(path, img.file);
        if (upErr) throw upErr;

        const { data: urlData } = supabase.storage
          .from("projects")
          .getPublicUrl(path);

        await supabase.from("project_images").insert({
          project_id: project.id,
          image_url: urlData.publicUrl,
          sort_order: i,
        });
      }

      setTitle("");
      setDescription("");
      setImages([]);
      await fetchProjects();
      alert("✅ تم نشر المشروع بنجاح");
    } catch (err) {
      alert("❌ خطأ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (project) => {
    if (!confirm("⚠️ حذف المشروع بالكامل؟")) return;
    setLoading(true);
    try {
      for (const img of project.project_images) {
        const path = getStoragePath(img.image_url);
        await supabase.storage.from("projects").remove([path]);
      }
      await supabase.from("projects").delete().eq("id", project.id);
      await fetchProjects();
      alert("تم حذف المشروع");
    } catch (e) {
      alert("فشل الحذف");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
      UI Sections
  ========================= */
  if (!authorized) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
        dir="rtl"
      >
        <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="bg-[#634f0e] text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg">
              <ArrowRightOnRectangleIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">لوحة التحكم</h2>
          </div>
          <input
            type="password"
            placeholder="كلمة المرور"
            className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#634f0e] rounded-2xl mb-4 outline-none transition-all text-center text-lg"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkPassword()}
          />
          <button
            onClick={checkPassword}
            disabled={checking}
            className="bg-black text-white w-full py-4 rounded-2xl font-bold active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {checking ? <Spinner /> : "دخول"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 pt-30 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h1 className="text-2xl font-black text-gray-800">إدارة المعرض</h1>
          <button
            onClick={() => window.location.reload()}
            className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Add Project Form */}
        <section className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-10">
            <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
              <PlusIcon className="w-6 h-6 text-[#634f0e]" />
              إضافة مشروع جديد
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-600 mr-2">
                  اسم المشروع
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl p-4 border-2 border-transparent focus:border-[#634f0e] focus:bg-white outline-none transition-all text-lg"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-600 mr-2">
                  الوصف
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl p-4 min-h-[120px] outline-none border-2 border-transparent focus:border-[#634f0e] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-600 mr-2">
                  الصور
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer hover:bg-gray-50 transition-all">
                  <PhotoIcon className="w-8 h-8 text-gray-300" />
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => addImages(e.target.files)}
                  />
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-video rounded-xl overflow-hidden group border shadow-sm"
                    >
                      <img
                        src={img.preview}
                        className="w-full h-full object-cover"
                        alt="preview"
                      />
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#634f0e] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
              >
                {loading ? <Spinner /> : "نشر المشروع"}
              </button>
            </div>
          </div>
        </section>

        {/* List of Projects */}
        <div className="space-y-6 pb-20">
          <h2 className="text-xl font-bold text-gray-800 px-2">
            المشاريع المنشورة
          </h2>
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-6"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                {p.project_images[0] && (
                  <img
                    src={p.project_images[0].image_url}
                    className="w-full h-full object-cover"
                    alt={p.title}
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{p.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-1">
                  {p.description}
                </p>
              </div>
              <button
                onClick={() => deleteProject(p)}
                disabled={loading}
                className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
