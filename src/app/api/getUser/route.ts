import { NextRequest, NextResponse } from "next/server";
import { getUserByClerkId, createUser, updateUserByClerkId } from "@/app/libs/users/user";

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

  const clerkId = body.clerkId;


  if (!clerkId) {
    return NextResponse.json({ error: "No clerkId in payload" }, { status: 400 });
  }

  try {
    // Check if user already exists
    let user = await getUserByClerkId(clerkId);

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("Failed to create/get user:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
