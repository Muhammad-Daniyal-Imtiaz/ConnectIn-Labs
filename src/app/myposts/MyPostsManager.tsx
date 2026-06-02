"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  FileImage,
  Edit3,
  Eye,
  Globe2,
  ImageIcon,
  Loader2,
  Mail,
  MoreHorizontal,
  MessageSquare,
  Phone,
  Plus,
  Repeat2,
  Save,
  Send,
  Sparkles,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react";
import { deletePost, getUserPosts, updatePost } from "@/app/actions/myposts";

const categories = [
  "Idea",
  "MVP",
  "Investment Wanted",
  "Partners Wanted",
  "Startup Space Wanted",
  "Cofounder Wanted",
];

type ManagedPost = {
  id: string;
  title: string;
  content: string;
  category: string;
  imagesJson: string;
  showContactEmail: boolean | null;
  showContactPhone: boolean | null;
  showContactCountry: boolean | null;
  userName: string;
  userRole: string;
  userAvatar: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactCountry?: string | null;
  createdAt: string;
  updatedAt: string;
};

type EditDraft = {
  id: string;
  title: string;
  content: string;
  category: string;
  images: string[];
  showContactEmail: boolean;
  showContactPhone: boolean;
  showContactCountry: boolean;
};

function parseImages(imagesJson: string) {
  try {
    const parsed = JSON.parse(imagesJson || "[]");
    return Array.isArray(parsed) ? parsed.slice(0, 3).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function toDraft(post: ManagedPost): EditDraft {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    images: parseImages(post.imagesJson),
    showContactEmail: Boolean(post.showContactEmail),
    showContactPhone: Boolean(post.showContactPhone),
    showContactCountry: Boolean(post.showContactCountry),
  };
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}

export default function MyPostsManager() {
  const [posts, setPosts] = useState<ManagedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditDraft | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const stats = useMemo(() => {
    const withMedia = posts.filter((post) => parseImages(post.imagesJson).length > 0).length;
    return { total: posts.length, withMedia };
  }, [posts]);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      setError(null);
      const result = await getUserPosts();
      if (result.success) {
        setPosts((result.posts || []) as ManagedPost[]);
      } else {
        setError(result.error || "Failed to load your posts.");
      }
      setLoading(false);
    }

    loadPosts();
  }, []);

  async function handleDelete(postId: string) {
    const confirmed = window.confirm("Delete this post permanently?");
    if (!confirmed) return;

    setDeletingId(postId);
    setError(null);
    const formData = new FormData();
    formData.append("postId", postId);
    const result = await deletePost(formData);

    if (result.success) {
      setPosts((current) => current.filter((post) => post.id !== postId));
      setSuccess("Post deleted.");
    } else {
      setError(result.error || "Could not delete this post.");
    }
    setDeletingId(null);
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    setSaving(true);
    setError(null);
    const formData = new FormData();
    formData.append("postId", editing.id);
    formData.append("title", editing.title);
    formData.append("content", editing.content);
    formData.append("category", editing.category);
    formData.append("images", JSON.stringify(editing.images.filter(Boolean).slice(0, 3)));
    formData.append("showContactEmail", String(editing.showContactEmail));
    formData.append("showContactPhone", String(editing.showContactPhone));
    formData.append("showContactCountry", String(editing.showContactCountry));

    const result = await updatePost(formData);
    if (result.success && result.post) {
      setPosts((current) =>
        current.map((post) =>
          post.id === editing.id ? { ...post, ...(result.post as ManagedPost) } : post
        )
      );
      setEditing(null);
      setSuccess("Post updated.");
    } else {
      setError(result.error || "Could not update this post.");
    }
    setSaving(false);
  }

  function updateImageAt(index: number, value: string) {
    if (!editing) return;
    const images = [...editing.images];
    images[index] = value;
    setEditing({ ...editing, images: images.slice(0, 3) });
  }

  function removeImageAt(index: number) {
    if (!editing) return;
    const images = editing.images.filter((_, imageIndex) => imageIndex !== index);
    setEditing({ ...editing, images });
  }

  async function handleLocalImages(files: FileList | null) {
    if (!editing || !files?.length) return;

    setError(null);
    const availableSlots = Math.max(0, 3 - editing.images.filter(Boolean).length);
    if (availableSlots === 0) {
      setError("You can attach up to 3 images only.");
      return;
    }

    const selectedFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, availableSlots);

    if (selectedFiles.length === 0) {
      setError("Please select valid image files.");
      return;
    }

    try {
      const uploadedImages = await Promise.all(selectedFiles.map(fileToDataUrl));
      setEditing({
        ...editing,
        images: [...editing.images.filter(Boolean), ...uploadedImages].slice(0, 3),
      });
    } catch {
      setError("Could not load one of the selected images.");
    }
  }

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-white px-4 pt-4 pb-12 sm:px-6 bg-grid-pattern overflow-hidden">
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="hidden space-y-4 text-left lg:sticky lg:top-[76px] lg:col-span-3 lg:block">
          <div className="rounded-lg border border-[#38434f] bg-[#1d2226] p-5 shadow-lg">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest text-emerald-400 ring-1 ring-emerald-500/20">
              <Sparkles className="h-3 w-3" />
                Creator Studio
            </div>
            <h1 className="text-xl font-bold uppercase tracking-tight text-white">My Posts</h1>
            <p className="mt-3 text-xs font-medium leading-relaxed text-slate-400">
              Manage your public founder updates in the same format people see on the feed.
            </p>
            <Link
              href="/feed"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-xs font-black text-slate-950 shadow-md shadow-emerald-500/15 transition hover:from-emerald-400 hover:to-teal-500"
            >
              <Plus className="h-3.5 w-3.5" />
              View Public Feed
            </Link>
          </div>

          <div className="rounded-lg border border-[#38434f] bg-[#1d2226] p-4 text-[11px] text-slate-400">
            <p className="mb-2 font-mono text-[10px] font-extrabold uppercase tracking-widest text-white">Creator Stats</p>
            <div className="flex justify-between border-b border-white/5 py-1.5">
              <span>Total Posts</span>
              <span className="font-bold text-white">{stats.total}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>Posts With Media</span>
              <span className="font-bold text-white">{stats.withMedia}</span>
            </div>
          </div>
        </aside>

        <section className="mx-auto w-full max-w-[452px] lg:col-span-6 lg:max-w-none">
          <div className="mb-4 rounded-lg border border-[#38434f] bg-[#1d2226] p-4 text-left shadow-lg lg:hidden">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest text-emerald-400 ring-1 ring-emerald-500/20">
              <Sparkles className="h-3 w-3" />
              Creator Studio
            </div>
            <h1 className="text-lg font-bold uppercase tracking-tight text-white">My Posts</h1>
            <p className="mt-2 text-xs font-medium leading-normal text-slate-400">
              Edit or delete your public posts exactly as they appear in the feed.
            </p>
          </div>

          <AnimatePresence>
            {(error || success) && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`mb-4 flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${
                  error
                    ? "border-red-500/25 bg-red-500/10 text-red-200"
                    : "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                }`}
              >
                <span className="flex items-center gap-2">
                  {error ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  {error || success}
                </span>
                <button onClick={() => { setError(null); setSuccess(null); }} className="rounded-full p-1 hover:bg-white/10">
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-[#38434f] bg-[#1d2226]">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-emerald-400" />
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Loading your posts</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-lg border border-[#38434f] bg-[#1d2226] px-6 py-16 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-slate-600" />
              <h2 className="mt-4 text-xl font-black">No posts yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                Once you publish updates, MVP calls, hiring posts, or cofounder requests, they will appear here.
              </p>
              <Link href="/feed" className="mt-6 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-950 hover:bg-slate-200">
                Go to Feed
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {posts.map((post) => {
                const images = parseImages(post.imagesJson);
                return (
                  <motion.article
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2 overflow-hidden rounded-lg border border-[#38434f] bg-[#1d2226] font-sans text-[#e9eaec]"
                  >
                    <div className="flex items-start px-4 pt-3 pb-1">
                      <img src={post.userAvatar} alt={post.userName} className="mr-3 h-12 w-12 rounded-full object-cover" />
                      <div className="flex-1 leading-tight">
                        <span className="flex items-center gap-1.5 text-[15px] font-semibold transition-colors hover:text-[#0a66c2] hover:underline">
                          {post.userName}
                          <span className="text-sm font-normal text-[#8c959f]">• 1st</span>
                        </span>
                        <span className="mt-0.5 block max-w-[90%] truncate text-xs text-[#8c959f]">
                          {post.userRole} | {post.category}
                        </span>
                        <div className="mt-0.5 flex items-center text-xs text-[#8c959f]">
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          <span className="mx-1">•</span>
                          <Globe2 className="h-3 w-3" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[#8c959f]">
                        <button className="rounded-full p-2 transition-colors hover:bg-[#38434f] hover:text-[#e9eaec]" title="More options">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        <button onClick={() => setEditing(toDraft(post))} className="rounded-full p-2 transition-colors hover:bg-[#38434f] hover:text-[#e9eaec]" title="Edit post">
                          <Edit3 className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDelete(post.id)} disabled={deletingId === post.id} className="rounded-full p-2 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-60" title="Delete post">
                          {deletingId === post.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="px-4 py-2 text-sm leading-relaxed text-[#e9eaec]">
                      <p className="whitespace-pre-wrap">
                        {post.title ? <span className="mb-1 block text-[15px] font-bold">{post.title}</span> : null}
                        {post.content}
                      </p>
                    </div>

                    {(post.showContactEmail || post.showContactPhone || post.showContactCountry) && (
                      <div className="mx-4 mt-1 mb-2 rounded-lg border border-slate-700/40 bg-slate-900/30 p-3 text-sm text-[#8c959f]">
                        <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#e9eaec]">
                          <Eye className="h-3 w-3 text-emerald-400" />
                          Creator Contact Information
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                          {post.showContactEmail && post.contactEmail && (
                            <div className="flex items-center gap-1.5 text-slate-300"><Mail className="h-3.5 w-3.5 text-slate-500" /> {post.contactEmail}</div>
                          )}
                          {post.showContactPhone && post.contactPhone && (
                            <div className="flex items-center gap-1.5 text-slate-300"><Phone className="h-3.5 w-3.5 text-slate-500" /> {post.contactPhone}</div>
                          )}
                          {post.showContactCountry && post.contactCountry && (
                            <div className="flex items-center gap-1.5 text-slate-300"><Globe2 className="h-3.5 w-3.5 text-slate-500" /> {post.contactCountry}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {images.length > 0 && (
                      <div className="relative mt-2 flex w-full items-center justify-center bg-[#1b1f23]">
                        <img src={images[0]} alt={`${post.title} media`} className="max-h-[500px] w-full object-contain" />
                        {images.length > 1 && (
                          <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                            1 / {images.length}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mx-2 flex items-center justify-between border-b border-[#38434f] px-4 py-2 text-[13px] text-[#8c959f]">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1">
                          <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#0a66c2] ring-[1.5px] ring-[#1d2226]">
                            <ThumbsUp className="h-2.5 w-2.5 fill-white text-white" />
                          </div>
                        </div>
                        <span className="cursor-pointer hover:text-[#0a66c2] hover:underline">{Math.max(7, post.title.length + post.category.length)}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="cursor-pointer hover:text-[#0a66c2] hover:underline">0 comments</span>
                        <span>•</span>
                        <span className="cursor-pointer hover:text-[#0a66c2] hover:underline">0 reposts</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2 py-1 text-sm font-semibold text-[#8c959f]">
                      <button className="mx-0.5 flex flex-1 items-center justify-center gap-2 rounded-md py-3 transition-colors hover:bg-[#38434f] hover:text-[#e9eaec]">
                        <ThumbsUp className="h-[18px] w-[18px]" />
                        Like
                      </button>
                      <button className="mx-0.5 flex flex-1 items-center justify-center gap-2 rounded-md py-3 transition-colors hover:bg-[#38434f] hover:text-[#e9eaec]">
                        <MessageSquare className="h-[18px] w-[18px]" />
                        Comment
                      </button>
                      <button className="mx-0.5 hidden flex-1 items-center justify-center gap-2 rounded-md py-3 transition-colors hover:bg-[#38434f] hover:text-[#e9eaec] sm:flex">
                        <Repeat2 className="h-[18px] w-[18px]" />
                        Repost
                      </button>
                      <button className="mx-0.5 flex flex-1 items-center justify-center gap-2 rounded-md py-3 transition-colors hover:bg-[#38434f] hover:text-[#e9eaec]">
                        <Send className="mt-1 h-[18px] w-[18px] -rotate-12" />
                        Send
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#38434f] bg-slate-950/25 px-4 py-2 text-[11px] text-[#8c959f]">
                      <span className="font-mono uppercase tracking-widest text-emerald-400">Editable by you</span>
                      <span>Updated {new Date(post.updatedAt || post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </section>

        <div className="hidden lg:col-span-3 lg:block" />
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              onSubmit={handleUpdate}
              className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#38434f] bg-[#1d2226] shadow-2xl shadow-black"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#38434f] bg-[#1d2226]/95 px-5 py-4 backdrop-blur">
                <div>
                  <h2 className="text-lg font-black">Edit Post</h2>
                  <p className="text-xs text-slate-400">Update all public post fields.</p>
                </div>
                <button type="button" onClick={() => setEditing(null)} className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">Title</span>
                  <input
                    value={editing.title}
                    onChange={(event) => setEditing({ ...editing, title: event.target.value })}
                    className="w-full rounded-xl border border-[#38434f] bg-slate-950/70 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                    required
                    maxLength={140}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">Content</span>
                  <textarea
                    value={editing.content}
                    onChange={(event) => setEditing({ ...editing, content: event.target.value })}
                    className="min-h-40 w-full rounded-xl border border-[#38434f] bg-slate-950/70 px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">Category</span>
                  <select
                    value={editing.category}
                    onChange={(event) => setEditing({ ...editing, category: event.target.value })}
                    className="w-full rounded-xl border border-[#38434f] bg-slate-950/70 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>

                <div>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="block text-xs font-black uppercase tracking-widest text-slate-400">Post Images</span>
                      <span className="mt-1 block text-[11px] text-slate-500">
                        Remove old pictures, paste URLs, or upload local images. Max 3.
                      </span>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-black text-emerald-300 transition hover:bg-emerald-500/20">
                      <FileImage className="h-4 w-4" />
                      Upload Local
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(event) => {
                          handleLocalImages(event.target.files);
                          event.target.value = "";
                        }}
                      />
                    </label>
                  </div>

                  {editing.images.filter(Boolean).length > 0 && (
                    <div className="mb-4 grid gap-3 sm:grid-cols-3">
                      {editing.images.filter(Boolean).map((image, index) => (
                        <div key={`${image}-${index}`} className="group relative overflow-hidden rounded-2xl border border-[#38434f] bg-slate-950/70">
                          <img src={image} alt={`Selected post image ${index + 1}`} className="h-36 w-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent p-3">
                            <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur">
                              Image {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeImageAt(index)}
                              className="rounded-full bg-red-500/90 p-2 text-white shadow-lg transition hover:bg-red-400"
                              title="Remove image"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3 rounded-2xl border border-[#38434f] bg-slate-950/30 p-3">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="grid gap-2 sm:grid-cols-[44px_1fr_auto]">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#38434f] bg-slate-950/70 text-slate-500">
                          {editing.images[index] ? (
                            <img src={editing.images[index]} alt="" className="h-full w-full rounded-xl object-cover" />
                          ) : (
                            <ImageIcon className="h-4 w-4" />
                          )}
                        </div>
                        <input
                          value={editing.images[index] || ""}
                          onChange={(event) => updateImageAt(index, event.target.value)}
                          placeholder={`Paste image ${index + 1} URL or keep uploaded image data`}
                          className="w-full rounded-xl border border-[#38434f] bg-slate-950/70 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeImageAt(index)}
                          disabled={!editing.images[index]}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-slate-500">
                    Tip: uploaded local images are saved into the post as image data, so they replace old pictures immediately after you click Save Changes.
                  </p>
                </div>

                <div>
                  <span className="mb-3 block text-xs font-black uppercase tracking-widest text-slate-400">Contact Visibility</span>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["showContactEmail", "Show Email", Mail],
                      ["showContactPhone", "Show Phone", Phone],
                      ["showContactCountry", "Show Country", Globe2],
                    ].map(([key, label, Icon]) => (
                      <label key={key as string} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#38434f] bg-slate-950/40 p-3 text-sm text-slate-300 hover:bg-white/5">
                        <input
                          type="checkbox"
                          checked={Boolean(editing[key as keyof EditDraft])}
                          onChange={(event) => setEditing({ ...editing, [key as string]: event.target.checked })}
                          className="h-4 w-4 accent-emerald-500"
                        />
                        <Icon className="h-4 w-4 text-emerald-400" />
                        {label as string}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 flex justify-end gap-3 border-t border-[#38434f] bg-[#1d2226]/95 px-5 py-4 backdrop-blur">
                <button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/10">
                  Cancel
                </button>
                <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-black text-slate-950 hover:bg-emerald-400 disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
