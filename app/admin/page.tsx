"use client";

import React, { useEffect, useState } from "react";
import {
  COLLECTIONS,
  PRODUCTS,
  CollectionItem,
  Product,
  OrderItem,
  fetchStoreDataFromSupabase,
  uploadImageToR2,
} from "@/lib/storeData";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSCODE = "growmore2026";
const STOREFRONT_URL = process.env.NEXT_PUBLIC_STOREFRONT_URL || "";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [tab, setTab] = useState<"banner" | "collections" | "products" | "orders">("products");
  const [statusMsg, setStatusMsg] = useState("");
  const [busy, setBusy] = useState(false);

  // Store state
  const [bannerImage, setBannerImage] = useState("/banner.png");
  const [bannerTitle, setBannerTitle] = useState("GROW MORE AUDIO & ACCESSORIES");
  const [bannerSubtitle, setBannerSubtitle] = useState(
    "Crystal Clear Sound • Fast Charging • Official Warranty"
  );

  const [collections, setCollections] = useState<CollectionItem[]>(COLLECTIONS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<OrderItem[]>([]);

  // Product form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [prodName, setProdName] = useState("");
  const [prodSubtitle, setProdSubtitle] = useState("");
  const [prodCategory, setProdCategory] = useState("Wireless Earbuds");
  const [prodPrice, setProdPrice] = useState("");
  const [prodOriginalPrice, setProdOriginalPrice] = useState("");
  const [prodDiscount, setProdDiscount] = useState("");
  const [prodBadge, setProdBadge] = useState("");
  const [prodRating, setProdRating] = useState("4.8");
  const [prodImage, setProdImage] = useState("");
  const [prodBgTone, setProdBgTone] = useState("bg-neutral-100");

  const notify = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 4500);
  };

  const loadAll = async () => {
    const data = await fetchStoreDataFromSupabase();
    setBannerImage(data.banner.bannerImage);
    setBannerTitle(data.banner.bannerTitle);
    setBannerSubtitle(data.banner.bannerSubtitle);
    setCollections(data.collections);
    setProducts(data.products);
    setOrders(data.orders);
  };

  useEffect(() => {
    if (unlocked) {
      loadAll();
    }
  }, [unlocked]);

  const handleSeedDefaults = async () => {
    if (!supabase) return notify("❌ Supabase configured nahi hai");
    setBusy(true);
    try {
      const { error: bannerErr } = await supabase.from("store_settings").upsert({
        id: "main",
        banner_image: bannerImage,
        banner_title: bannerTitle,
        banner_subtitle: bannerSubtitle,
      });
      if (bannerErr) throw bannerErr;

      const colRows = collections.map((c, idx) => ({
        id: c.filterValue.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: c.label,
        filter_value: c.filterValue,
        image_path: c.imagePath,
        sort_order: idx + 1,
      }));
      const { error: colErr } = await supabase.from("collections").upsert(colRows);
      if (colErr) throw colErr;

      const prodRows = products.map((p) => ({
        id: p.id,
        name: p.name,
        subtitle: p.subtitle,
        category: p.category,
        price: p.price,
        original_price: p.originalPrice || null,
        discount_label: p.discountLabel || null,
        badge: p.badge || null,
        rating: p.rating,
        image_path: p.imagePath,
        bg_tone: p.bgTone,
      }));
      const { error: prodErr } = await supabase.from("products").upsert(prodRows);
      if (prodErr) throw prodErr;

      notify("✅ Default data Supabase mein sync ho gaya!");
      await loadAll();
    } catch (e: unknown) {
      notify("❌ " + (e instanceof Error ? e.message : "Sync failed"));
    } finally {
      setBusy(false);
    }
  };

  // Banner upload & save
  const handleBannerFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImageToR2(file, "banners");
      setBannerImage(url);
      notify("✅ Banner R2 par upload ho gaya! Ab Save Banner dabayein.");
    } catch (e: unknown) {
      notify("❌ " + (e instanceof Error ? e.message : "Upload failed"));
    } finally {
      setBusy(false);
    }
  };

  const handleSaveBanner = async () => {
    if (!supabase) return notify("❌ Supabase missing");
    setBusy(true);
    const { error } = await supabase.from("store_settings").upsert({
      id: "main",
      banner_image: bannerImage,
      banner_title: bannerTitle,
      banner_subtitle: bannerSubtitle,
    });
    setBusy(false);
    if (error) return notify("❌ " + error.message);
    notify("✅ Hero Banner Supabase mein save ho gaya!");
    await loadAll();
  };

  // Collection image upload & save
  const handleCollectionFile = async (idx: number, file?: File) => {
    if (!file || !supabase) return;
    setBusy(true);
    try {
      const url = await uploadImageToR2(file, "collections");
      const updated = collections.map((item, i) =>
        i === idx ? { ...item, imagePath: url } : item
      );
      setCollections(updated);

      const target = updated[idx];
      const { error } = await supabase.from("collections").upsert({
        id: target.filterValue.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: target.label,
        filter_value: target.filterValue,
        image_path: target.imagePath,
        sort_order: idx + 1,
      });
      if (error) throw error;
      notify(`✅ ${target.label} ki image update ho gayi!`);
    } catch (e: unknown) {
      notify("❌ " + (e instanceof Error ? e.message : "Upload failed"));
    } finally {
      setBusy(false);
    }
  };

  // Product image upload
  const handleProductFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImageToR2(file, "products");
      setProdImage(url);
      notify("✅ Product image R2 par upload ho gayi!");
    } catch (e: unknown) {
      notify("❌ " + (e instanceof Error ? e.message : "Upload failed"));
    } finally {
      setBusy(false);
    }
  };

  const resetProductForm = () => {
    setEditingId(null);
    setProdName("");
    setProdSubtitle("");
    setProdCategory("Wireless Earbuds");
    setProdPrice("");
    setProdOriginalPrice("");
    setProdDiscount("");
    setProdBadge("");
    setProdRating("4.8");
    setProdImage("");
    setProdBgTone("bg-neutral-100");
  };

  const handleEditProduct = (p: Product) => {
    setEditingId(p.id);
    setProdName(p.name);
    setProdSubtitle(p.subtitle);
    setProdCategory(p.category);
    setProdPrice(String(p.price));
    setProdOriginalPrice(p.originalPrice ? String(p.originalPrice) : "");
    setProdDiscount(p.discountLabel || "");
    setProdBadge(p.badge || "");
    setProdRating(String(p.rating));
    setProdImage(p.imagePath);
    setProdBgTone(p.bgTone);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return notify("❌ Supabase missing");
    if (!prodName.trim() || !prodPrice) return notify("❌ Product name aur price zaroori hain");

    setBusy(true);
    const id = editingId || `gm-${Date.now()}`;
    const row = {
      id,
      name: prodName.trim(),
      subtitle: prodSubtitle.trim(),
      category: prodCategory,
      price: Number(prodPrice),
      original_price: prodOriginalPrice ? Number(prodOriginalPrice) : null,
      discount_label: prodDiscount.trim() || null,
      badge: prodBadge.trim() || null,
      rating: Number(prodRating) || 4.8,
      image_path: prodImage.trim() || "/products/earbuds.png",
      bg_tone: prodBgTone,
    };

    const { error } = await supabase.from("products").upsert(row);
    setBusy(false);
    if (error) return notify("❌ " + error.message);

    notify(editingId ? "✅ Product update ho gaya!" : "✅ Naya product add ho gaya!");
    resetProductForm();
    await loadAll();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!supabase) return;
    if (!confirm("Kya aap waqai is product ko delete karna chahte hain?")) return;
    setBusy(true);
    const { error } = await supabase.from("products").delete().eq("id", id);
    setBusy(false);
    if (error) return notify("❌ " + error.message);
    notify("🗑️ Product delete ho gaya");
    await loadAll();
  };

  const handleOrderStatus = async (orderId: string, status: OrderItem["status"]) => {
    if (!supabase) return;
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) return notify("❌ " + error.message);
    notify(`✅ Order ${orderId} → ${status}`);
    await loadAll();
  };

  const handleViewLiveStore = () => {
    if (STOREFRONT_URL) {
      window.open(STOREFRONT_URL, "_blank", "noopener,noreferrer");
    } else {
      notify(
        "ℹ️ Customer Storefront abhi live deploy nahi hai. Storefront deploy kar ke Vercel mein NEXT_PUBLIC_STOREFRONT_URL add karein."
      );
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (passInput === ADMIN_PASSCODE) {
              setUnlocked(true);
            } else {
              alert("Galat passcode!");
            }
          }}
          className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4"
        >
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight">
              GROW<span className="text-emerald-500">MORE</span>
            </h1>
            <p className="text-xs text-neutral-400 mt-1">Admin Control Panel</p>
          </div>
          <input
            type="password"
            placeholder="Admin Passcode darj karein"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm cursor-pointer"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="bg-black text-white px-4 sm:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl tracking-tight">
              GROW<span className="text-emerald-500">MORE</span>
            </span>
            <span className="text-[11px] bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-full font-semibold">
              ADMIN PANEL
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSeedDefaults}
              disabled={busy}
              className="bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer"
            >
              Sync Default Data
            </button>
            <button
              onClick={handleViewLiveStore}
              className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
            >
              View Live Store →
            </button>
          </div>
        </div>
      </header>

      {/* Status Toast */}
      {statusMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-neutral-700 max-w-md">
          {statusMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-4">
          {(["products", "collections", "banner", "orders"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer ${
                tab === t
                  ? "bg-black text-white"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
              }`}
            >
              {t === "banner"
                ? "Hero Banner"
                : t === "collections"
                ? "Circular Collections"
                : t === "products"
                ? `Products (${products.length})`
                : `Orders (${orders.length})`}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* TAB 1: HERO BANNER */}
        {tab === "banner" && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5 max-w-2xl">
            <h2 className="text-lg font-black uppercase">Update Hero Banner</h2>

            <div className="rounded-xl overflow-hidden border border-neutral-200 bg-black">
              <img
                src={bannerImage}
                alt="Banner preview"
                className="w-full max-h-64 object-cover"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                Upload New Banner Image (Cloudflare R2)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleBannerFile(e.target.files?.[0])}
                className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-black file:text-white file:font-bold cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Banner Image URL</label>
              <input
                type="text"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="w-full border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Banner Title</label>
              <input
                type="text"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                className="w-full border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Banner Subtitle</label>
              <input
                type="text"
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
                className="w-full border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>

            <button
              onClick={handleSaveBanner}
              disabled={busy}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-sm cursor-pointer"
            >
              {busy ? "Saving..." : "Save Banner to Live Website"}
            </button>
          </div>
        )}

        {/* TAB 2: CIRCULAR COLLECTIONS */}
        {tab === "collections" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {collections.map((col, idx) => (
              <div
                key={col.filterValue}
                className="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col items-center text-center gap-3"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border border-neutral-200 bg-neutral-100">
                  <img
                    src={col.imagePath}
                    alt={col.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{col.label}</h3>
                  <p className="text-[11px] text-neutral-400">{col.filterValue}</p>
                </div>
                <label className="w-full bg-black hover:bg-neutral-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl cursor-pointer">
                  {busy ? "Uploading..." : "Change Icon (R2)"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleCollectionFile(idx, e.target.files?.[0])}
                  />
                </label>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: PRODUCTS */}
        {tab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form
              onSubmit={handleSaveProduct}
              className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 h-fit"
            >
              <h2 className="text-base font-black uppercase">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>

              <div>
                <label className="block text-xs font-bold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Subtitle / Features</label>
                <input
                  type="text"
                  value={prodSubtitle}
                  onChange={(e) => setProdSubtitle(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Category</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm"
                >
                  {COLLECTIONS.map((c) => (
                    <option key={c.filterValue} value={c.filterValue}>
                      {c.filterValue}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Sale Price (Rs) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Original Price (Rs)</label>
                  <input
                    type="number"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Discount Label</label>
                  <input
                    type="text"
                    placeholder="25% OFF"
                    value={prodDiscount}
                    onChange={(e) => setProdDiscount(e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Badge</label>
                  <input
                    type="text"
                    placeholder="BEST SELLER"
                    value={prodBadge}
                    onChange={(e) => setProdBadge(e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  Product Image (Upload to R2)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleProductFile(e.target.files?.[0])}
                  className="text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-black file:text-white file:font-bold cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="Ya direct image URL paste karein"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs mt-2"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm cursor-pointer"
                >
                  {busy ? "Please wait..." : editingId ? "Update Product" : "Add Product"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="px-4 py-3 rounded-xl border border-neutral-300 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Product List */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-4 flex gap-4 items-center"
                >
                  <img
                    src={p.imagePath}
                    alt={p.name}
                    className="w-20 h-20 object-contain rounded-xl bg-neutral-100 p-2"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-emerald-600">{p.category}</p>
                    <h3 className="font-bold text-sm truncate">{p.name}</h3>
                    <p className="text-xs font-black mt-0.5">Rs. {p.price.toLocaleString()}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditProduct(p)}
                        className="text-xs font-bold px-3 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-xs font-bold px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center text-sm text-neutral-500">
                Abhi tak koi order nahi aaya.
              </div>
            ) : (
              orders.map((o) => (
                <div
                  key={o.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-xs font-black text-emerald-600">{o.id}</p>
                    <h3 className="font-bold text-sm">
                      {o.customerName} — {o.phone}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      {o.address}, {o.city}
                    </p>
                    <p className="text-xs font-bold mt-1">
                      Total: Rs. {o.totalAmount.toLocaleString()} ({o.items.length} items)
                    </p>
                  </div>

                  <select
                    value={o.status}
                    onChange={(e) =>
                      handleOrderStatus(o.id, e.target.value as OrderItem["status"])
                    }
                    className="border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}