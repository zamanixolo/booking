import { NextResponse } from "next/server";
import { getUserByClerkId } from "@/app/libs/users/user";


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

    // Use hardcoded sandbox values for testing
    const payfastData: Record<string, string> = {
      merchant_id: `${process.env.PAYFAST_MERCHANT_ID}`,
      merchant_key: `${process.env.PAYFAST_MERCHANT_KEY}`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/payment/cancel`,
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/api/payGates/notify`,
      email_address: client.email,
      name_first: client.firstName,
      name_last: client.lastName,
      m_payment_id: id.replace(/[^a-zA-Z0-9_-]/g, ""),
      amount: parseFloat(price).toFixed(2),
      item_name: serviceId,
    };

    if (client.phone) {
      payfastData.cell_number = client.phone;
    }






    return NextResponse.json({
      success: true,
      payfastUrl: "https://sandbox.payfast.co.za/eng/process",
      payload: payfastData,

    }, { status: 200 });

  } catch (error) {
    console.error('PAYFAST ERROR:', error);
    return NextResponse.json({ 
      error: "Server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}