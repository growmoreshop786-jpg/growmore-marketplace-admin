"use client";

import { useState } from "react";
import { resolveMediaUrl } from "@/data/storeConfig";

interface HeroBannerProps {
  bannerImage: string;
  bannerTitle: string;
  bannerSubtitle: string;
  isSupabaseConfigured: boolean;
}

const SLIDES = [
  {
    tag: "UPGRADE YOUR TECH",
    title: "Premium Mobile Accessories",
    highlight: "Mobile",
    subtitle: "Stylish. Durable. Always with You.",
  },
  {
    tag: "FAST POWER & AUDIO",
    title: "Crystal Sound & Rapid Charge",
    highlight: "Rapid",
    subtitle: "Engineered for Everyday Performance.",
  },
  {
    tag: "EXCLUSIVE BUNDLES",
    title: "Smart Tech For Daily Life",
    highlight: "Smart",
    subtitle: "Official Warranty • Fast UAE Delivery.",
  },
];

function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

export default function HeroBanner({
  bannerImage,
  bannerTitle,
  bannerSubtitle,
  isSupabaseConfigured,
}: HeroBannerProps) {
  const [slideIdx, setSlideIdx] = useState(0);

  const resolvedBanner = resolveMediaUrl(bannerImage, "/banner.png");
  const isCustomR2Banner =
    resolvedBanner.startsWith("http") || resolvedBanner !== "/banner.png";

  const currentSlide = SLIDES[slideIdx % SLIDES.length];
  const displayTitle =
    slideIdx === 0 && bannerTitle ? bannerTitle : currentSlide.title;
  const displaySubtitle =
    slideIdx === 0 && bannerSubtitle
      ? bannerSubtitle
      : currentSlide.subtitle;

  const prevSlide = () =>
    setSlideIdx((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  const nextSlide = () =>
    setSlideIdx((prev) => (prev + 1) % SLIDES.length);

  return (
    <section
      id="hero-section"
      style={{
        background:
          "linear-gradient(115deg, #09071A 0%, #24125E 42%, #4C1D95 78%, #1E1B4B 100%)",
      }}
      className="relative w-full min-h-[340px] sm:min-h-[410px] rounded-[28px] overflow-hidden text-white flex items-center shadow-md"
    >
      {/* Subtle Neon Glow Accents */}
      <div
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.45) 0%, rgba(139,92,246,0) 70%)",
        }}
        className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full"
      />

      {/* Custom R2 Image / Video if uploaded */}
      {isCustomR2Banner &&
        (isVideoUrl(resolvedBanner) ? (
          <video
            src={resolvedBanner}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <img
            src={resolvedBanner}
            alt={displayTitle}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ))}

      {/* Left Typography & CTA (Always crisp when default banner is active) */}
      {!isCustomR2Banner && (
        <div className="relative z-10 w-full px-7 sm:px-14 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span
              style={{ backgroundColor: "#7C3AED" }}
              className="inline-block text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full"
            >
              {currentSlide.tag}
            </span>

            <h1 className="text-3xl sm:text-5xl font-black leading-[1.08] tracking-tight">
              {displayTitle}
            </h1>

            <p className="text-sm sm:text-base text-purple-100/90 font-medium">
              {displaySubtitle}
            </p>

            <div className="pt-2">
              <a
                href="#products-section"
                style={{ backgroundColor: "#7C3AED" }}
                className="inline-flex items-center gap-2 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full shadow-lg hover:opacity-95 transition"
              >
                <span>Shop Now</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Right Tech Showcase Visual */}
          <div className="hidden md:flex items-center justify-center gap-4 select-none">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center w-28">
              <div className="text-3xl mb-1">🎧</div>
              <div className="text-[11px] font-bold text-purple-100">
                AirPods Pro
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center w-28">
              <div className="text-3xl mb-1">📱</div>
              <div className="text-[11px] font-bold text-purple-100">
                MagSafe Cases
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center w-28">
              <div className="text-3xl mb-1">⌚</div>
              <div className="text-[11px] font-bold text-purple-100">
                Smart Watch
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Center Carousel Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Slide ${idx + 1}`}
            onClick={() => setSlideIdx(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              slideIdx === idx
                ? "w-5 bg-[#8B5CF6]"
                : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Bottom Right Prev / Next Arrows */}
      <div className="absolute bottom-4 right-5 z-20 flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous Banner"
          onClick={prevSlide}
          className="w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 border border-white/15 text-white text-xs font-bold flex items-center justify-center cursor-pointer transition"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next Banner"
          onClick={nextSlide}
          className="w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 border border-white/15 text-white text-xs font-bold flex items-center justify-center cursor-pointer transition"
        >
          ›
        </button>
      </div>

      {isSupabaseConfigured && (
        <span
          style={{ backgroundColor: "#059669" }}
          className="hidden sm:inline-block absolute top-4 right-4 z-20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full"
        >
          Live Sync
        </span>
      )}
    </section>
  );
}