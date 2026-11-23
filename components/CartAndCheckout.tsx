"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/data/storeData";

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartAndCheckoutProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (productId: number, delta: number) => void;
  onClearCart: () => void;
}

export default function CartAndCheckout({
  open,
  onClose,
  cart,
  onUpdateQty,
  onClearCart,
}: CartAndCheckoutProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  if (!open) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.salePrice * item.qty,
    0
  );

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmittingOrder(true);
    setOrderMessage("");

    try {
      const firstItem = cart[0];
      const summaryNames = cart
        .map((i) => `${i.product.name} (${i.qty})`)
        .join(", ");
      const orderId = `GM-${Date.now().toString().slice(-6)}`;

      if (supabase) {
        const { error } = await supabase.from("orders").insert({
          id: orderId,
          customer_name: customerName,
          phone,
          city,
          address,
          product_name: summaryNames,
          qty: totalItems,
          unit_price: firstItem.product.salePrice,
          status: "Processing",
        });
        if (error) throw error;
      }

      setOrderMessage(
        `Order ${orderId} confirm ho gaya! Shukriya, ${customerName}.`
      );
      onClearCart();
      setCustomerName("");
      setPhone("");
      setCity("");
      setAddress("");
    } catch (err: unknown) {
      setOrderMessage(
        err instanceof Error ? err.message : "Order place karne mein masla aaya."
      );
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <div className="bg-white w-full max-w-md h-full flex flex-col justify-between p-6 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h3 style={{ color: "#3B0764" }} className="text-lg font-black">
              Your Cart ({totalItems})
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              Close ✕
            </button>
          </div>

          {orderMessage && (
            <div
              style={{ backgroundColor: "#059669" }}
              className="text-white text-xs font-bold p-3.5 rounded-xl"
            >
              {orderMessage}
            </div>
          )}

          {cart.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              Cart abhi khali hai. Kisi product par Add to Cart dabayein.
            </p>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between gap-3 bg-gray-100 p-3 rounded-xl"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-gray-900 truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[11px] font-bold text-[#7C3AED]">
                        AED{" "}
                        {(item.product.salePrice * item.qty).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.product.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold px-1.5">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.product.id, 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handlePlaceOrder}
                className="space-y-3 pt-4 border-t border-gray-200"
              >
                <div
                  style={{ color: "#3B0764" }}
                  className="flex items-center justify-between text-sm font-black"
                >
                  <span>Total</span>
                  <span>AED {totalAmount.toLocaleString()}</span>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Delivery Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs"
                />

                <button
                  type="submit"
                  disabled={submittingOrder}
                  style={{ backgroundColor: "#7C3AED" }}
                  className="w-full text-white font-bold py-3 rounded-xl text-xs sm:text-sm cursor-pointer transition"
                >
                  {submittingOrder ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}