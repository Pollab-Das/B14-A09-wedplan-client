import { MongoClient, ObjectId } from "mongodb";
import { getSession } from "@/lib/server-auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "vendor") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await request.json().catch(() => ({}));
  if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
    return Response.json({ message: "Invalid payment session" }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return Response.json({ message: "Payment verification is not configured" }, { status: 500 });
  }

  const stripeResponse = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    {
      headers: { Authorization: `Bearer ${stripeKey}` },
      cache: "no-store",
    }
  );

  if (!stripeResponse.ok) {
    return Response.json({ message: "Payment session could not be verified" }, { status: 502 });
  }

  const paymentSession = await stripeResponse.json();
  const vendorId = paymentSession?.metadata?.vendorId;
  const emailMatches =
    typeof paymentSession?.customer_email === "string" &&
    paymentSession.customer_email.toLowerCase() === session.user.email.toLowerCase();

  if (
    paymentSession?.payment_status !== "paid" ||
    (vendorId !== session.user.id && !emailMatches)
  ) {
    return Response.json({ message: "Payment is not confirmed" }, { status: 402 });
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const filter = { _id: new ObjectId(session.user.id) };

  const client = new MongoClient(process.env.MONGODB_URI as string);

  try {
    const databaseNames = [
      process.env.MONGODB_DB_NAME || "wedplan",
      process.env.DB_NAME || "vowvista",
    ];

    await Promise.all(
      [...new Set(databaseNames)].map((name) =>
        client
          .db(name)
          .collection("user")
          .updateOne(filter, {
            $set: {
              subscriptionPlan: "premium",
              subscriptionExpiresAt: expiresAt,
              premiumActivatedAt: new Date(),
            },
          })
      )
    );

    return Response.json({ premium: true });
  } finally {
    await client.close();
  }
}
