import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Product, CollectionItem, COLLECTIONS, PRODUCTS } from "@/data/storeData";

export type { Product, CollectionItem };

export const R2_PUBLIC_BASE_URL =
  "https://pub-d70940bb93eb4727953b2e2c02263b46.r2.dev";

export function resolveMediaUrl(
  url?: string | null,
  fallback = "/banner.png"
): string {
  const trimmed = url?.trim();
  if (!trimmed) return fallback;
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }
  return `${R2_PUBLIC_BASE_URL}/${trimmed.replace(/^\/+/, "")}`;
}

export interface OrderItem {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  productName: string;
  category: string;
  unitPrice: number;
  qty: number;
  status: "Delivered" | "Shipped" | "Processing" | "Cancelled";
  date: string;
}

export interface StoreBannerConfig {
  bannerImage: string;
  bannerTitle: string;
  bannerSubtitle: string;
}

export interface StoreData {
  banner: StoreBannerConfig;
  collections: CollectionItem[];
  products: Product[];
  orders: OrderItem[];
}

export const DEFAULT_STORE_DATA: StoreData = {
  banner: {
    bannerImage: "/banner.png",
    bannerTitle: "GROW MORE AUDIO & ACCESSORIES",
    bannerSubtitle: "Crystal Clear Sound • Fast Charging • Official Warranty",
  },
  collections: COLLECTIONS,
  products: PRODUCTS,
  orders: [],
};

export async function fetchStoreDataFromSupabase(): Promise<StoreData> {
  if (!isSupabaseConfigured || !supabase) {
    return DEFAULT_STORE_DATA;
  }

  try {
    const [settingsRes, collectionsRes, productsRes, ordersRes] =
      await Promise.all([
        supabase
          .from("store_settings")
          .select("*")
          .eq("id", "main")
          .maybeSingle(),
        supabase
          .from("collections")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase.from("products").select("*").order("id", { ascending: true }),
        supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

    const banner: StoreBannerConfig = settingsRes.data
      ? {
          bannerImage: resolveMediaUrl(
            settingsRes.data.banner_image,
            DEFAULT_STORE_DATA.banner.bannerImage
          ),
          bannerTitle:
            settingsRes.data.banner_title ||
            DEFAULT_STORE_DATA.banner.bannerTitle,
          bannerSubtitle:
            settingsRes.data.banner_subtitle ||
            DEFAULT_STORE_DATA.banner.bannerSubtitle,
        }
      : DEFAULT_STORE_DATA.banner;

    const collections: CollectionItem[] =
      collectionsRes.data && collectionsRes.data.length > 0
        ? collectionsRes.data.map((row) => ({
            label: row.label,
            filterValue: row.filter_value,
            imagePath: resolveMediaUrl(
              row.image_path,
              "/collections/earbuds.jpg"
            ),
            fallbackIcon: row.fallback_icon || "🎧",
          }))
        : COLLECTIONS;

    const products: Product[] =
      productsRes.data && productsRes.data.length > 0
        ? productsRes.data.map((row) => ({
            id: Number(row.id),
            name: row.name,
            subtitle: row.subtitle || "Official Grow More Product",
            category: row.category,
            originalPrice: Number(row.original_price || 0),
            salePrice: Number(row.sale_price || 0),
            reviews: Number(row.reviews || 1),
            badge: row.badge || undefined,
            emoji: row.emoji || "🎧",
            imagePath: row.image_path
              ? resolveMediaUrl(row.image_path, "")
              : undefined,
            bgTone: row.bg_tone || "bg-stone-100",
          }))
        : PRODUCTS;

    const orders: OrderItem[] =
      ordersRes.data && ordersRes.data.length > 0
        ? ordersRes.data.map((row) => ({
            id: String(row.id),
            customerName: row.customer_name,
            phone: row.phone || "",
            city: row.city || "",
            productName: row.product_name,
            category: row.category || "General",
            unitPrice: Number(row.unit_price || 0),
            qty: Number(row.qty || 1),
            status: (row.status as OrderItem["status"]) || "Processing",
            date: row.date_label || "Today",
          }))
        : [];

    return { banner, collections, products, orders };
  } catch (err) {
    console.warn("Supabase fetchStoreDataFromSupabase error:", err);
    return DEFAULT_STORE_DATA;
  }
}

export async function uploadImageToR2(
  file: File,
  folder: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.url) {
    throw new Error(data.error || "R2 image upload fail ho gayi.");
  }
  return resolveMediaUrl(data.url, data.url);
}