import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/server";
import { Product } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const supabase = createAnonClient();
    const { data: product } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("is_active", true)
      .single();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const typedProduct = product as Product;
    const origin = request.nextUrl.origin;

    // Use native fetch instead of Stripe SDK to avoid connection issues in serverless
    const params = new URLSearchParams({
      mode: "payment",
      "payment_method_types[0]": "card",
      "line_items[0][price_data][currency]": "brl",
      "line_items[0][price_data][product_data][name]": typedProduct.name,
      "line_items[0][price_data][unit_amount]": String(typedProduct.price_cents),
      "line_items[0][quantity]": "1",
      success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancelado`,
      "metadata[productId]": typedProduct.id,
    });

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const err = await res.json();
      const stripeMsg = err.error?.message ?? "Stripe error";
      console.error("Stripe API error:", JSON.stringify(err));
      return NextResponse.json({ error: stripeMsg }, { status: 500 });
    }

    const session = await res.json();
    return NextResponse.json({ url: session.url });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Checkout error:", msg);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
