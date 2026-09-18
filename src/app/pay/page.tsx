"use client";

import { useEffect, useState } from "react";

/**
 * Custom Bayar.gg checkout page.
 *
 * Bayar.gg hosts the actual checkout UI; this page only hosts their `pay.js`
 * on our own domain so the customer stays on plapod.web.id while paying.
 *
 * Requirements set by Bayar.gg (strictly validated on their side):
 *  - This exact URL must be registered under Developer -> Checkout URL and be ON.
 *  - `NEXT_PUBLIC_BAYARGG_CHECKOUT_KEY` must be that URL's checkout public key.
 *  - The URL must be passed verbatim as `payment_url` when creating a payment,
 *    without a `?invoice=` suffix (the gateway appends it).
 *
 * `pay.js` reads `?invoice=...` from the address bar, renders the checkout, and
 * redirects back to the parent page once payment finishes. No iframe or
 * container element is needed.
 */
export default function PayPage() {
  const checkoutKey = process.env.NEXT_PUBLIC_BAYARGG_CHECKOUT_KEY;
  const [invoice, setInvoice] = useState<string | null>(null);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setInvoice(params.get("invoice"));
  }, []);

  useEffect(() => {
    if (!checkoutKey) return;

    const script = document.createElement("script");
    script.src = `https://www.bayar.gg/api/pay.js?checkout_key=${encodeURIComponent(
      checkoutKey
    )}`;
    script.async = true;
    script.onerror = () => setScriptError(true);
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [checkoutKey]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Pembayaran</h1>
        {invoice && (
          <p className="mt-1 font-mono text-sm text-muted-foreground">{invoice}</p>
        )}
      </div>

      {!invoice && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Invoice tidak ditemukan pada tautan ini. Silakan buka kembali tautan
          pembayaran dari halaman pesanan Anda.
        </p>
      )}

      {invoice && !checkoutKey && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm">
          Halaman checkout belum dikonfigurasi. Hubungi admin untuk mengatur
          checkout key Bayar.gg.
        </p>
      )}

      {scriptError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Gagal memuat halaman pembayaran. Silakan muat ulang halaman ini.
        </p>
      )}

      {invoice && checkoutKey && !scriptError && (
        <p className="text-sm text-muted-foreground">Memuat halaman pembayaran…</p>
      )}
    </main>
  );
}
