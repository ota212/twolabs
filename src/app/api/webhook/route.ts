import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email;
    const productId = session.metadata?.productId;

    if (!email || !productId) {
      console.error("Missing email or productId in session", session.id);
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Find or create user
    let userId: string;

    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email === email
    );

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUser, error: createError } =
        await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
        });

      if (createError || !newUser.user) {
        console.error("Error creating user:", createError);
        return NextResponse.json({ error: "User creation failed" }, { status: 500 });
      }
      userId = newUser.user.id;
    }

    // Record purchase
    const { error: purchaseError } = await supabase.from("purchases").insert({
      user_id: userId,
      product_id: productId,
      stripe_session_id: session.id,
      status: "completed",
    });

    if (purchaseError) {
      console.error("Error recording purchase:", purchaseError);
      return NextResponse.json({ error: "Purchase recording failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
