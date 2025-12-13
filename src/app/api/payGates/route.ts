import { NextResponse } from "next/server";
import { getUserByClerkId } from "@/app/libs/users/user";
import crypto from "crypto";

const generatePayfastSignature = (data: Record<string, string>, passPhrase?: string) => {
  const sortedKeys = Object.keys(data)
    .filter(k => k !== "signature")   // exclude signature only
    .sort();

  const paramString = sortedKeys
    .map(k => `${k}=${encodeURIComponent(data[k].trim()).replace(/%20/g, "+")}`)
    .join("&");

  const stringToHash = passPhrase
    ? `${paramString}&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`
    : paramString;

  console.log("String to hash:", stringToHash); // copy this exactly into PayFast sandbox debug
  return crypto.createHash("md5").update(stringToHash).digest("hex");
};


export async function POST(req: Request) {
  try {
    const body: any = await req.json();
    const { id, price, clientId, serviceId } = body.res;

    if (!clientId || !price || !id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await getUserByClerkId(clientId);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const payfastData: Record<string, string> = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID!,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY!,
    //   return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
    //   notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/api/payfast/notify`,
      email_address: client.email,
      name_first: client.firstName,
      name_last: client.lastName,
      m_payment_id: id.replace(/[^a-zA-Z0-9_-]/g, ""),
      amount: Number(price).toFixed(2),
      item_name: serviceId,
    };

    if (client.phone) {
      payfastData.cell_number = client.phone;
    }

    const signature = generatePayfastSignature(payfastData, process.env.PAYFAST_PASSPHRASE);
    payfastData.signature = signature;

    return NextResponse.json({
      success: true,
      payfastUrl: "https://sandbox.payfast.co.za/eng/process",
      payload: payfastData,
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
