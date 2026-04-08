import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  const { purchaseId } = await params;
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  // Verify user with their token
  const userClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const {
    data: { user },
    error: authError,
  } = await userClient.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch purchase with service role (bypasses RLS)
  const supabase = createServiceRoleClient();

  const { data: purchase } = await supabase
    .from("purchases")
    .select("*, product:products(*)")
    .eq("id", purchaseId)
    .single();

  if (!purchase || purchase.user_id !== user.id) {
    return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
  }

  const filePath = purchase.product?.file_path;
  if (!filePath) {
    return NextResponse.json({ error: "File not available" }, { status: 404 });
  }

  // Generate signed URL
  const { data: signedUrl, error: storageError } = await supabase.storage
    .from("products")
    .createSignedUrl(filePath, 300); // 5 minutes

  if (storageError || !signedUrl) {
    console.error("Storage error:", storageError);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }

  return NextResponse.json({ url: signedUrl.signedUrl });
}
