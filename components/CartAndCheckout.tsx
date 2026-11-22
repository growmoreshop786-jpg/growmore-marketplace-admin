"use client";

import { useState } from "react";
import { Product } from "@/data/storeData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type CartItem = {
  product: Product;
  qty: number;
};

type CartAndCheckoutProps = {
  cart: CartItem[];
  isCartOpen: boolean;
  onCloseCart: () => void;
  onUpdateQty: (id: number, delta: number) => void;
  onClearCart: () => void;
};

export default function CartAndCheckout({
  cart,
  isCartOpen,
  onCloseCart,
  onUpdateQty,
  onClearCart,
}: CartAndCheckoutProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.product.salePrice * i.qty, 0);
  const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 250;
  const grandTotal = subtotal + shipping;

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isSupabaseConfigured && supabase && cart.length > 0) {
      const rows = cart.map((item, idx) => ({
        id: `GM-${Date.now()}-${idx + 1}`,
        customer_name: customerName,
        phone,
        city: `${city} (${address})`,
        product_name: item.product.name,
        category: item.product.category,
        unit_price: item.product.salePrice,
        qty: item.qty,
        status: "Processing",
        date_label: new Date().toLocaleDateString("en-PK", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));
      await supabase.from("orders").insert(rows);
    }

    setSubmitting(false);
    setOrderPlaced(true);
    onClearCart();
  };

  return (
    <>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-6 flex flex-col justify-between shadow-2xl">
            <div className="overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-lg font-black uppercase">Your Bag ({totalItems})</h3>
                <button
                  onClick={onCloseCart}
                  className="text-neutral-500 hover:text-black text-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="bg-neutral-100 rounded-xl p-3 mt-4 text-xs font-medium text-center">
                {subtotal >= 2000 ? (
                  <span className="text-emerald-700 font-bold">
                    🎉 Congrats! You unlocked FREE Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong>Rs. {(2000 - subtotal).toLocaleString()}</strong> more for{" "}
                    <strong>FREE Shipping</strong>
                  </span>
                )}
              </div>

              {cart.length === 0 ? (
                <p className="text-neutral-500 text-sm mt-16 text-center">
                  Aap ka Grow More bag abhi khali hai.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {cart.map(({ product, qty }) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between border-b pb-4 gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center overflow-hidden text-2xl">
                          {product.imagePath ? (
                            <img
                              src={product.imagePath}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            product.emoji
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{product.name}</p>
                          <p className="text-xs text-neutral-500">
                            Rs. {product.salePrice.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQty(product.id, -1)}
                          className="w-7 h-7 rounded-full border text-sm font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{qty}</span>
                        <button
                          onClick={() => onUpdateQty(product.id, 1)}
                          className="w-7 h-7 rounded-full border text-sm font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `Rs. ${shipping}`}</span>
                </div>
                <div className="flex justify-between font-black text-lg">
                  <span>Total</span>
                  <span>Rs. {grandTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => {
                    onCloseCart();
                    setOrderPlaced(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-black hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition cursor-pointer"
                >
                  Buy Now — Cash on Delivery
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-black text-xl cursor-pointer"
            >
              ✕
            </button>

            {orderPlaced ? (
              <div className="text-center py-8 space-y-4">
                <div className="text-5xl">✅</div>
                <h3 className="text-2xl font-black">Order Confirmed!</h3>
                <p className="text-sm text-neutral-600">
                  Shukriya <strong>{customerName}</strong>! Aap ka Grow More order receive ho gaya hai. Hum jald hi <strong>{phone}</strong> par confirmation call/SMS karenge.
                </p>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="bg-black text-white font-bold px-6 py-3 rounded-xl text-sm cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmOrder} className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase text-emerald-600">
                    Cash On Delivery
                  </span>
                  <h3 className="text-xl font-black">Complete Your Grow More Order</h3>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Apna naam likhein"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="03XX-XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Lahore, Karachi, Islamabad..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Complete Delivery Address</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House #, Street, Area..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition cursor-pointer"
                >
                  {submitting
                    ? "Placing Order..."
                    : `Confirm COD Order • Rs. ${grandTotal.toLocaleString()}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}