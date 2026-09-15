"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import imageCompression from "browser-image-compression";
import {
  PlusIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  PhotoIcon,
  PencilSquareIcon,
  XMarkIcon,
  SparklesIcon,
  CircleStackIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

/* =========================
    Helpers
========================= */
const getStoragePath = (url) => {
  if (!url) return null;
  const parts = url.split("/projects/");
  return parts[1];
};

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
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
  const [cleaningStorage, setCleaningStorage] = useState(false);
  const [storageUsage, setStorageUsage] = useState({
    totalBytes: 0,
    totalFiles: 0,
    loading: false,
  });

  // Form State
  const [editingId, setEditingId] = useState(null); // ID المشروع الجاري تعديله
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // {id, file, preview, isExisting, url}
  const [deletedImages, setDeletedImages] = useState([]); // لتتبع الصور التي ستحذف من الـ Storage

  /* =========================
      Actions
  ========================= */
  const checkPassword = async () => {
    setChecking(true);
    try {
      const { data: isValid, error } = await supabase.rpc(
        "verify_admin_password",
        { input_password: password }
      );
      if (!error && isValid) {
        setAuthorized(true);
      } else {
        alert("❌ كلمة المرور غير صحيحة");
      }
    } catch (e) {
      alert("خطأ في الاتصال");
    } finally {
      setChecking(false);
    }
  };

  const fetchStorageUsage = async () => {
    setStorageUsage((prev) => ({ ...prev, loading: true }));
    try {
      const { data, error } = await supabase.rpc("get_storage_usage");
      if (!error && data) {
        setStorageUsage({
          totalBytes: Number(data.total_bytes) || 0,
          totalFiles: Number(data.total_files) || 0,
          loading: false,
        });
      } else {
        setStorageUsage((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error("Error fetching storage usage:", err);
      setStorageUsage((prev) => ({ ...prev, loading: false }));
    }
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `id, title, description, project_images (id, image_url, sort_order)`,
      )
      .order("id", { ascending: false });

    if (!error) {
      const formattedData = data?.map((p) => ({
        ...p,
        project_images: (p.project_images || []).sort(
          (a, b) => a.sort_order - b.sort_order,
        ),
      }));
      setProjects(formattedData || []);
    }
  };

  useEffect(() => {
    if (authorized) {
      fetchProjects();
      fetchStorageUsage();
    }
  }, [authorized]);

  const addImages = (files) => {
    const mapped = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      isExisting: false,
    }));
    setImages((prev) => [...prev, ...mapped]);
  };

  const removeImage = (img) => {
    if (img.isExisting) {
      setDeletedImages((prev) => [...prev, img]);
    }
    setImages((prev) => prev.filter((i) => i.id !== img.id));
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setImages([]);
    setDeletedImages([]);
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setImages(
      project.project_images.map((img) => ({
        id: img.id,
        preview: img.image_url,
        isExisting: true,
        url: img.image_url,
      })),
    );
    setDeletedImages([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const compressAndUpload = async (file, projectId, order) => {
    const options = {
      maxSizeMB: 2.5, // رفع الحجم إلى 2.5 ميجا للحفاظ على التفاصيل الفائقة بدون تشويش
      maxWidthOrHeight: 2560, // أبعاد 2K فائقة الوضوح للشاشات الحديثة والريتينا
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: 0.9, // جودة 90% ممتازة جداً ونقية
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}.webp`;
      const path = `${projectId}/${fileName}`;

      const { error: upErr } = await supabase.storage
        .from("projects")
        .upload(path, compressedBlob);
      if (upErr) throw upErr;

      const { data: urlData } = supabase.storage
        .from("projects")
        .getPublicUrl(path);

      await supabase.from("project_images").insert({
        project_id: projectId,
        image_url: urlData.publicUrl,
        sort_order: order,
      });
    } catch (err) {
      console.error("Compression/Upload error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("يرجى إضافة عنوان");
    setLoading(true);

    try {
      let projectId = editingId;

      if (editingId) {
        // 1. تحديث بيانات المشروع الأساسية
        await supabase
          .from("projects")
          .update({ title, description })
          .eq("id", editingId);

        // 2. حذف الصور المحددة للحذف من الـ Storage والـ DB
        for (const img of deletedImages) {
          const path = getStoragePath(img.url);
          if (path) await supabase.storage.from("projects").remove([path]);
          await supabase.from("project_images").delete().eq("id", img.id);
        }
      } else {
        // إنشاء مشروع جديد
        const { data: project, error: pErr } = await supabase
          .from("projects")
          .insert({ title, description })
          .select()
          .single();
        if (pErr) throw pErr;
        projectId = project.id;
      }

      // 3. رفع الصور الجديدة فقط
      const newImages = images.filter((img) => !img.isExisting);
      for (let i = 0; i < newImages.length; i++) {
        await compressAndUpload(newImages[i].file, projectId, i + 100);
      }

      alert("✅ تم الحفظ بنجاح");
      resetForm();
      await fetchProjects();
      await fetchStorageUsage();
    } catch (err) {
      alert("❌ خطأ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (project) => {
    if (!confirm("⚠️ حذف المشروع وجميع صوره نهائياً؟")) return;
    setLoading(true);
    try {
      for (const img of project.project_images) {
        const path = getStoragePath(img.image_url);
        if (path) await supabase.storage.from("projects").remove([path]);
      }
      await supabase.from("projects").delete().eq("id", project.id);
      await fetchProjects();
      await fetchStorageUsage();
    } catch (e) {
      alert("فشل الحذف");
    } finally {
      setLoading(false);
    }
  };

  const cleanUnusedImages = async () => {
    setCleaningStorage(true);
    try {
      // 1. استدعاء دالة قاعدة البيانات لجلب الصور غير المرتبطة بأي مشروع
      const { data: unusedFiles, error: rpcErr } = await supabase.rpc(
        "get_unused_project_images"
      );

      let filesToDelete = unusedFiles;

      // في حال تعذر استدعاء الدالة، استخدام فحص بديل مباشر عبر Storage
      if (rpcErr || !filesToDelete) {
        const { data: activeImages } = await supabase
          .from("project_images")
          .select("image_url");

        const activePaths = new Set(
          (activeImages || [])
            .map((img) => getStoragePath(img.image_url))
            .filter(Boolean)
        );

        const { data: rootItems } = await supabase.storage
          .from("projects")
          .list("");

        const foundUnused = [];
        for (const item of rootItems || []) {
          if (item.id === null) {
            // مجلد مشروع
            const { data: folderFiles } = await supabase.storage
              .from("projects")
              .list(item.name);
            for (const file of folderFiles || []) {
              const fullPath = `${item.name}/${file.name}`;
              if (!activePaths.has(fullPath)) {
                foundUnused.push(fullPath);
              }
            }
          } else {
            if (!activePaths.has(item.name)) {
              foundUnused.push(item.name);
            }
          }
        }
        filesToDelete = foundUnused;
      }

      if (!filesToDelete || filesToDelete.length === 0) {
        alert("✨ مساحة التخزين نظيفة تماماً! لا توجد أي صور غير مستخدمة.");
        return;
      }

      const confirmed = confirm(
        `⚠️ تم العثور على ${filesToDelete.length} صورة غير مستخدمة في Supabase Storage (ليست مرتبطة بأي مشروع).\n\nهل تريد حذفها نهائياً لتفريغ المساحة؟`
      );

      if (!confirmed) return;

      const { error: delErr } = await supabase.storage
        .from("projects")
        .remove(filesToDelete);

      if (delErr) throw delErr;

      alert(`✅ تم حذف ${filesToDelete.length} صورة غير مستخدمة بنجاح وتحرير مساحة التخزين!`);
      await fetchStorageUsage();
    } catch (err) {
      alert("❌ خطأ أثناء تنظيف الصور: " + (err.message || err));
    } finally {
      setCleaningStorage(false);
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

  // Storage Calculations (1 GB = 1024 MB = 1,073,741,824 Bytes)
  const TOTAL_CAPACITY_BYTES = 1024 * 1024 * 1024;
  const usedMB = (storageUsage.totalBytes / (1024 * 1024)).toFixed(2);
  const usedPercent = Math.min(
    100,
    Math.max(0, (storageUsage.totalBytes / TOTAL_CAPACITY_BYTES) * 100)
  );
  const percentDisplay =
    storageUsage.totalBytes > 0 && usedPercent < 0.1
      ? "< 0.1%"
      : `${usedPercent.toFixed(1)}%`;
  const remainingMB = Math.max(
    0,
    1024 - storageUsage.totalBytes / (1024 * 1024)
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 pt-30 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-black text-gray-800">إدارة المعرض</h1>
            <p className="text-xs text-gray-400 mt-1">
              إضافة وتعديل المشاريع وتنظيف وسائط التخزين
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={cleanUnusedImages}
              disabled={cleaningStorage}
              title="فحص وحذف أي صور غير مرتبطة بأي مشروع في Supabase"
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-[#634f0e] border border-amber-200 rounded-md text-xs font-bold transition-all disabled:opacity-50 active:scale-95 shadow-sm cursor-pointer"
            >
              {cleaningStorage ? (
                <Spinner />
              ) : (
                <SparklesIcon className="w-4 h-4 text-[#634f0e]" />
              )}
              <span>
                {cleaningStorage
                  ? "جاري الفحص والتنظيف..."
                  : "تنظيف الصور غير المستخدمة"}
              </span>
            </button>
            <button
              onClick={() => window.location.reload()}
              title="تسجيل الخروج"
              className="p-2.5 bg-gray-50 text-gray-400 rounded-md hover:text-red-500 border border-gray-100 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Storage Capacity Indicator Card */}
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-amber-50 border border-amber-100/80 text-[#634f0e] flex items-center justify-center shrink-0">
                <CircleStackIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-gray-800">
                    سعة التخزين السحابي
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-gray-100 text-gray-600">
                    1 جيجابايت
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  مساحة ملفات وصور مشاريع المعرض
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
              <div className="text-right">
                <div className="text-sm font-black text-gray-900 tracking-tight">
                  {usedMB} ميجابايت{" "}
                  <span className="text-xs font-normal text-gray-400">
                    / 1,024 ميجابايت
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 text-left sm:text-right">
                  المتبقي: {remainingMB} ميجابايت
                </div>
              </div>
              <button
                onClick={fetchStorageUsage}
                disabled={storageUsage.loading}
                title="تحديث مؤشر المساحة"
                className="p-2 text-gray-400 hover:text-[#634f0e] hover:bg-amber-50/50 rounded-md border border-gray-100 transition-all cursor-pointer disabled:opacity-50"
              >
                <ArrowPathIcon
                  className={`w-4 h-4 ${
                    storageUsage.loading ? "animate-spin text-[#634f0e]" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Progress Bar Track & Fill */}
          <div className="space-y-2">
            <div className="w-full bg-gray-100 rounded-md h-3.5 p-0.5 overflow-hidden border border-gray-200/60 shadow-inner">
              <div
                className="bg-gradient-to-l from-[#ac8918] via-[#8c6b12] to-[#634f0e] h-full rounded-sm transition-all duration-500 shadow-sm"
                style={{
                  width: `${Math.min(100, Math.max(usedPercent, storageUsage.totalBytes > 0 ? 0.8 : 0))}%`,
                }}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
              <div className="flex items-center gap-2 font-medium">
                <span>نسبة الاستهلاك:</span>
                <span className="font-bold text-[#634f0e] bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200/40 text-[11px]">
                  {percentDisplay}
                </span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">
                {storageUsage.totalFiles}{" "}
                {storageUsage.totalFiles === 1 ? "صورة مخزنة" : "صور مخزنة"}
              </span>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        <section className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {editingId ? (
                  <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                ) : (
                  <PlusIcon className="w-6 h-6 text-[#634f0e]" />
                )}
                {editingId ? "تعديل المشروع" : "إضافة مشروع جديد"}
              </h2>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="text-sm font-bold text-red-500 flex items-center gap-1"
                >
                  <XMarkIcon className="w-4 h-4" /> إلغاء التعديل
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-600 mr-2">
                  اسم المشروع
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl p-4 border-2 border-transparent focus:border-[#634f0e] outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-600 mr-2">
                  الوصف
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl p-4 min-h-[120px] outline-none border-2 border-transparent focus:border-[#634f0e] transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-600 mr-2">
                  الصور (سيتم تحويلها لـ WebP مضغوط)
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer hover:bg-gray-50 transition-all">
                  <PhotoIcon className="w-8 h-8 text-gray-300" />
                  <span className="text-gray-400 text-sm mt-2">
                    اسحب الصور هنا أو انقر للاختيار
                  </span>
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
                        onClick={() => removeImage(img)}
                        className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <TrashIcon className="w-6 h-6" />
                      </button>
                      {img.isExisting && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                          منشور
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full ${
                  editingId ? "bg-blue-600" : "bg-[#634f0e]"
                } text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all`}
              >
                {loading ? (
                  <Spinner />
                ) : editingId ? (
                  "حفظ التعديلات"
                ) : (
                  "نشر المشروع"
                )}
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
              className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4 sm:gap-6"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                {p.project_images[0] && (
                  <img
                    src={p.project_images[0].image_url}
                    className="w-full h-full object-cover"
                    alt={p.title}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg truncate">{p.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-1">
                  {p.description}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="p-3 sm:p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors"
                >
                  <PencilSquareIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={() => deleteProject(p)}
                  disabled={loading}
                  className="p-3 sm:p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"
                >
                  <TrashIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
