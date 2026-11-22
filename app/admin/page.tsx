"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  COLLECTIONS,
  PRODUCTS,
  NAV_COLLECTIONS,
  Product,
  CollectionItem,
} from "@/data/storeData";
import {
  fetchStoreDataFromSupabase,
  uploadImageToR2,
  OrderItem,
} from "@/data/storeConfig";

const ADMIN_PASSCODE = "growmore2026";

export default function GrowMoreAdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [tab, setTab] = useState<"banner" | "collections" | "products" | "orders">("products");
  const [statusMsg, setStatusMsg] = useState("");
  const [busy, setBusy] = useState(false);

  // Store state
  const [bannerImage, setBannerImage] = useState("/banner.png");
  const [bannerTitle, setBannerTitle] = useState("GROW MORE AUDIO & ACCESSORIES");
  const [bannerSubtitle, setBannerSubtitle] = useState("Crystal Clear Sound • Fast Charging • Official Warranty");

  const [collections, setCollections] = useState<CollectionItem[]>(COLLECTIONS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<OrderItem[]>([]);

  // New/Edit Product Form
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pName, setPName] = useState("");
  const [pSubtitle, setPSubtitle] = useState("");
  const [pCategory, setPCategory] = useState("Wireless Earbuds");
  const [pOriginalPrice, setPOriginalPrice] = useState("");
  const [pSalePrice, setPSalePrice] = useState("");
  const [pBadge, setPBadge] = useState("");
  const [pEmoji, setPEmoji] = useState("🎧");
  const [pImagePath, setPImagePath] = useState("");

  const notify = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 4000);
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
    if (unlocked) loadAll();
  }, [unlocked]);

  // Seed default collections & products into Supabase if empty
  const handleSyncDefaultsToSupabase = async () => {
    if (!supabase) return notify("Supabase configured nahi hai.");
    setBusy(true);
    try {
      await supabase.from("store_settings").upsert({
        id: "main",
        banner_image: bannerImage,
        banner_title: bannerTitle,
        banner_subtitle: bannerSubtitle,
      });

      const colRows = collections.map((c, idx) => ({
        id: c.filterValue.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: c.label,
        filter_value: c.filterValue,
        image_path: c.imagePath,
        fallback_icon: c.fallbackIcon,
        sort_order: idx + 1,
      }));
      await supabase.from("collections").upsert(colRows);

      const prodRows = products.map((p) => ({
        id: p.id,
        name: p.name,
        subtitle: p.subtitle,
        category: p.category,
        original_price: p.originalPrice,
        sale_price: p.salePrice,
        reviews: p.reviews,
        badge: p.badge || null,
        emoji: p.emoji,
        image_path: p.imagePath || null,
        bg_tone: p.bgTone,
      }));
      await supabase.from("products").upsert(prodRows);

      notify("✅ Default data Supabase mein sync ho gaya!");
      await loadAll();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : "Sync error");
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
      notify(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const handleSaveBanner = async () => {
    if (!supabase) return notify("Supabase missing");
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
  };

  // Collection image upload & save
  const handleCollectionUpload = async (idx: number, file?: File) => {
    if (!file || !supabase) return;
    setBusy(true);
    try {
      const url = await uploadImageToR2(file, "collections");
      const updated = collections.map((item, i) =>
        i === idx ? { ...item, imagePath: url } : item
      );
      setCollections(updated);

      const target = updated[idx];
      await supabase.from("collections").upsert({
        id: target.filterValue.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: target.label,
        filter_value: target.filterValue,
        image_path: url,
        fallback_icon: target.fallbackIcon,
        sort_order: idx + 1,
      });
      notify(`✅ ${target.label} ki image update ho gayi!`);
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : "Upload failed");
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
      setPImagePath(url);
      notify("✅ Product photo R2 par upload ho gayi!");
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const resetProductForm = () => {
    setEditingId(null);
    setPName("");
    setPSubtitle("");
    setPCategory("Wireless Earbuds");
    setPOriginalPrice("");
    setPSalePrice("");
    setPBadge("");
    setPEmoji("🎧");
    setPImagePath("");
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return notify("Supabase missing");
    setBusy(true);

    const newId = editingId ?? Date.now();
    const row = {
      id: newId,
      name: pName,
      subtitle: pSubtitle || "Official Grow More Product",
      category: pCategory,
      original_price: Number(pOriginalPrice || pSalePrice || 0),
      sale_price: Number(pSalePrice || 0),
      reviews: 12,
      badge: pBadge || null,
      emoji: pEmoji || "🎧",
      image_path: pImagePath || null,
      bg_tone: "bg-stone-100",
    };

    const { error } = await supabase.from("products").upsert(row);
    setBusy(false);
    if (error) return notify("❌ " + error.message);

    notify(editingId ? "✅ Product update ho gaya!" : "✅ Naya product add ho gaya!");
    resetProductForm();
    await loadAll();
  };

  const handleEditProduct = (p: Product) => {
    setEditingId(p.id);
    setPName(p.name);
    setPSubtitle(p.subtitle);
    setPCategory(p.category);
    setPOriginalPrice(String(p.originalPrice));
    setPSalePrice(String(p.salePrice));
    setPBadge(p.badge || "");
    setPEmoji(p.emoji);
    setPImagePath(p.imagePath || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (id: number) => {
    if (!supabase) return;
    setBusy(true);
    await supabase.from("products").delete().eq("id", id);
    setBusy(false);
    notify("🗑️ Product delete ho gaya.");
    await loadAll();
  };

  const handleOrderStatus = async (orderId: string, status: OrderItem["status"]) => {
    if (!supabase) return;
    await supabase.from("orders").update({ status }).eq("id", orderId);
    notify(`✅ Order ${orderId} → ${status}`);
    await loadAll();
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (passInput === ADMIN_PASSCODE) setUnlocked(true);
            else alert("Galat passcode! Default: growmore2026");
          }}
          className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-sm w-full space-y-5"
        >
          <div>
            <span className="text-xs font-bold uppercase text-emerald-400">
              Grow More Control Center
            </span>
            <h1 className="text-2xl font-black mt-1">Admin Login</h1>
            <p className="text-xs text-neutral-400 mt-1">
              Passcode: <code className="text-emerald-400">growmore2026</code>
            </p>
          </div>
          <input
            type="password"
            placeholder="Enter Admin Passcode"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-xl text-sm cursor-pointer"
          >
            Open Admin Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="bg-black text-white px-4 sm:px-8 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl tracking-tighter">
              GROW<span className="text-emerald-500">MORE</span>
            </span>
            <span className="text-xs bg-emerald-600/20 text-emerald-400 border border-emerald-600/40 px-2.5 py-0.5 rounded-full font-semibold">
              {isSupabaseConfigured ? "Supabase + R2 Live" : "Local Mode"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncDefaultsToSupabase}
              disabled={busy}
              className="bg-neutral-800 hover:bg-neutral-700 text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer"
            >
              Sync Default Data
            </button>
            <Link
              href="/"
              className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold px-4 py-2 rounded-xl"
            >
              View Live Store →
            </Link>
          </div>
        </div>
      </header>

      {statusMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-4">
          <div className="bg-emerald-600 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-xl shadow">
            {statusMsg}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-4">
          {(["products", "collections", "banner", "orders"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase cursor-pointer transition ${
                tab === t
                  ? "bg-black text-white"
                  : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
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
              <img src={bannerImage} alt="Banner preview" className="w-full max-h-64 object-cover" />
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
                key={col.label}
                className="bg-white rounded-2xl border border-neutral-200 p-5 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-100 border">
                  <img
                    src={col.imagePath}
                    alt={col.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase">{col.label}</h3>
                  <p className="text-[11px] text-neutral-500">{col.filterValue}</p>
                </div>
                <label className="w-full bg-black hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl cursor-pointer transition">
                  Upload Circle Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleCollectionUpload(idx, e.target.files?.[0])}
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
              <h2 className="text-lg font-black uppercase">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>

              <div>
                <label className="block text-xs font-bold mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="GrowMore AirBuds X1"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Subtitle / Key Specs</label>
                <input
                  type="text"
                  placeholder="ANC • 40H Battery • Type-C"
                  value={pSubtitle}
                  onChange={(e) => setPSubtitle(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Collection Category</label>
                <select
                  value={pCategory}
                  onChange={(e) => setPCategory(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm bg-white"
                >
                  {NAV_COLLECTIONS.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Original Price (Rs)</label>
                  <input
                    type="number"
                    required
                    placeholder="6999"
                    value={pOriginalPrice}
                    onChange={(e) => setPOriginalPrice(e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Sale Price (Rs)</label>
                  <input
                    type="number"
                    required
                    placeholder="4499"
                    value={pSalePrice}
                    onChange={(e) => setPSalePrice(e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Badge (Optional)</label>
                  <input
                    type="text"
                    placeholder="BEST SELLER"
                    value={pBadge}
                    onChange={(e) => setPBadge(e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Fallback Emoji</label>
                  <input
                    type="text"
                    value={pEmoji}
                    onChange={(e) => setPEmoji(e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  Product Photo (Upload to R2)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleProductFile(e.target.files?.[0])}
                  className="text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-black file:text-white file:font-bold cursor-pointer"
                />
                {pImagePath && (
                  <img
                    src={pImagePath}
                    alt="Preview"
                    className="mt-2 w-20 h-20 object-cover rounded-xl border"
                  />
                )}
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
                    className="px-4 py-3 rounded-xl border text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-4 flex gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-16 h-16 rounded-xl bg-neutral-100 shrink-0 overflow-hidden flex items-center justify-center text-2xl">
                      {p.imagePath ? (
                        <img
                          src={p.imagePath}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        p.emoji
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase text-emerald-600">
                        {p.category}
                      </span>
                      <h4 className="font-bold text-sm truncate">{p.name}</h4>
                      <p className="text-xs font-black">
                        Rs. {p.salePrice.toLocaleString()}{" "}
                        <span className="text-neutral-400 line-through font-normal">
                          Rs. {p.originalPrice.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => handleEditProduct(p)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {tab === "orders" && (
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            {orders.length === 0 ? (
              <p className="p-8 text-center text-sm text-neutral-500">
                Abhi tak koi order nahi aaya. Website se test order place karein to yahan live dikhe ga!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-neutral-100 text-neutral-700 uppercase text-xs">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Product</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td className="p-4 font-bold">{o.id}</td>
                        <td className="p-4">
                          <div className="font-bold">{o.customerName}</div>
                          <div className="text-xs text-neutral-500">
                            {o.phone} • {o.city}
                          </div>
                        </td>
                        <td className="p-4">
                          {o.productName} × {o.qty}
                        </td>
                        <td className="p-4 font-black">
                          Rs. {(o.unitPrice * o.qty).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <select
                            value={o.status}
                            onChange={(e) =>
                              handleOrderStatus(o.id, e.target.value as OrderItem["status"])
                            }
                            className="border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-white"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}