"use client";

import { useState } from "react";

export default function StoreFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterMsg("Subscribed! Latest GrowMore offers aapko milengi.");
    setNewsletterEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="footer-section"
      style={{
        background:
          "linear-gradient(180deg, #090414 0%, #130726 65%, #070310 100%)",
      }}
      className="mt-10 text-white pt-10 pb-6 px-4 sm:px-8 relative border-t border-purple-950/60"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Row: Brand + Quick Links + Customer Service + Newsletter + Payment Badges */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-8 border-b border-white/10">
          {/* 1. GrowMore Brand & Social Icons */}
          <div className="space-y-3.5 shrink-0">
            <a href="#hero-section" className="inline-flex items-center gap-2.5">
              <div
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #A855F7 0%, #6D28D9 65%, #3B0764 100%)",
                }}
                className="w-11 h-11 rounded-2xl text-white font-black text-2xl flex items-center justify-center shadow-md shadow-purple-900/50"
              >
                G
              </div>
              <div>
                <div className="font-black text-xl leading-none tracking-tight text-white">
                  Grow<span className="text-[#A78BFA]">More</span>
                </div>
                <div className="text-[11px] text-gray-300 mt-1">
                  Smart Accessories. Better Life.
                </div>
              </div>
            </a>

            <div className="flex items-center gap-4 text-xs text-gray-300 pt-0.5">
              <a
                href="#footer-section"
                aria-label="Facebook"
                className="hover:text-white font-bold transition"
              >
                f
              </a>
              <a
                href="#footer-section"
                aria-label="Instagram"
                className="hover:text-white transition"
              >
                ◎
              </a>
              <a
                href="#footer-section"
                aria-label="YouTube"
                className="hover:text-white transition"
              >
                ▶
              </a>
              <a
                href="#footer-section"
                aria-label="TikTok"
                className="hover:text-white transition"
              >
                ♪
              </a>
              <a
                href="#footer-section"
                aria-label="X"
                className="hover:text-white font-bold transition"
              >
                𝕏
              </a>
            </div>
          </div>

          {/* 2 & 3. Quick Links + Customer Service */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12 text-xs">
            <div>
              <h4 className="font-bold text-white mb-2.5">Quick Links</h4>
              <ul className="space-y-1.5 text-gray-300">
                <li>
                  <a href="#hero-section" className="hover:text-white transition">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#products-section"
                    className="hover:text-white transition"
                  >
                    Shop
                  </a>
                </li>
                <li>
                  <a
                    href="#collections-section"
                    className="hover:text-white transition"
                  >
                    Collections
                  </a>
                </li>
                <li>
                  <a
                    href="#products-section"
                    className="hover:text-white transition"
                  >
                    Best Sellers
                  </a>
                </li>
                <li>
                  <a href="#trust-section" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#footer-section"
                    className="hover:text-white transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-2.5">Customer Service</h4>
              <ul className="space-y-1.5 text-gray-300">
                <li>
                  <a href="#footer-section" className="hover:text-white transition">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#footer-section" className="hover:text-white transition">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="#footer-section" className="hover:text-white transition">
                    Return Policy
                  </a>
                </li>
                <li>
                  <a href="#footer-section" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#footer-section" className="hover:text-white transition">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* 4. Newsletter + Payment Badges */}
          <div className="flex flex-col sm:flex-row lg:items-center gap-6 justify-between">
            <div className="w-full sm:w-72">
              <h4 className="font-bold text-xs text-white">
                Subscribe to Our Newsletter
              </h4>
              <p className="text-[11px] text-gray-300 mt-0.5 mb-2.5">
                Get the latest updates and exclusive offers!
              </p>

              <form onSubmit={handleNewsletter} className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-white text-gray-900 rounded-lg px-3 py-2 text-xs placeholder:text-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  style={{ backgroundColor: "#7C3AED" }}
                  className="text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-[#6D28D9] transition shrink-0"
                >
                  Subscribe
                </button>
              </form>

              {newsletterMsg && (
                <p className="text-[11px] text-amber-300 mt-1.5">
                  {newsletterMsg}
                </p>
              )}
            </div>

            {/* Payment Method Pills */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              <span className="bg-white text-[#1E3A8A] font-black italic text-[11px] px-2.5 py-1 rounded">
                VISA
              </span>
              <span className="bg-white px-2.5 py-1 rounded inline-flex items-center">
                <span className="w-3 h-3 rounded-full bg-[#EB001B] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#F79E1B] -ml-1.5 inline-block opacity-90" />
              </span>
              <span className="bg-black text-white border border-white/25 font-bold text-[11px] px-2.5 py-1 rounded">
                 Pay
              </span>
              <span className="bg-white text-gray-900 font-bold text-[11px] px-2.5 py-1 rounded">
                <span className="text-[#4285F4]">G</span> Pay
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-300">
          <span>© 2026 GrowMore. All rights reserved.</span>
          <span>
            Made with <span className="text-red-500">♥</span> for Tech Lovers
          </span>
        </div>
      </div>

      {/* Floating Scroll-to-Top Purple Circle Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        style={{ backgroundColor: "#7C3AED" }}
        className="fixed bottom-5 right-5 z-40 w-9 h-9 rounded-full text-white text-sm font-bold shadow-lg flex items-center justify-center cursor-pointer hover:bg-[#6D28D9] transition"
      >
        ↑
      </button>
    </footer>
  );
}