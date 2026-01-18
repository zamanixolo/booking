import { NextRequest, NextResponse } from "next/server";
import { getUserByClerkId, createUser, updateUserByClerkId } from "@/app/libs/users/user";

// ✅ Edge runtime
// export const runtime = 'nodejs';

interface UserRequestBody {
  clerkId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  imageurl?: string;
}
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();

  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.type !== "user.created") {
    return NextResponse.json({ message: "Ignored event type" }, { status: 200 });
  }

  const userData = body.data;

  const clerkId = userData.id;
  const firstName = userData.first_name || "";
  const lastName = userData.last_name || "";
  const email = userData.email_addresses?.[0]?.email_address || "";
  const imageurl = userData.image_url || userData.profile_image_url || "";

  if (!clerkId) {
    return NextResponse.json({ error: "No clerkId in payload" }, { status: 400 });
  }

  try {
    // Check if user already exists
    let user = await getUserByClerkId(clerkId);
    
    if (!user) {
      // Create user in your DB
      user = await createUser({
        clerkId,
        firstName,
        lastName,
        email,
        imageurl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("Failed to create/get user:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const body =  (await req.json()) as UserRequestBody; 
  const { clerkId, email, firstName, lastName, phone, imageurl } = body;
  if (!clerkId || !email || !firstName || !lastName)
    return NextResponse.json({ error: "clerkId, email, firstName, lastName required" }, { status: 400 });

  const existing = await getUserByClerkId(clerkId);
  const user = existing
    ? await updateUserByClerkId(clerkId, { email, firstName, lastName, phone, imageurl })
    : await createUser({ clerkId, email, firstName, lastName, phone, imageurl });

  return NextResponse.json(user);
}
