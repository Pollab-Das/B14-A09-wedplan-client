import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const baseURL =
  process.env.BETTER_AUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const mongodbUri = process.env.MONGODB_URI;
if (!mongodbUri) {
  throw new Error("[auth] MONGODB_URI is not set");
}

const client = new MongoClient(mongodbUri);
const db = client.db(process.env.MONGODB_DB_NAME || "wedplan");

export const auth = betterAuth({
  baseURL,
  trustedOrigins: [baseURL, "http://localhost:3000", "http://127.0.0.1:3000" , 
    "https://b14-a09-wedplan-client.vercel.app" ],
  database: mongodbAdapter(db, { client }),
  onAPIError: {
    errorURL: "/auth-error",
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireUppercase: true,
    requireLowercase: true,
  },
  //স্টেট ডাটাবেসে সেভ হবে (Better Auth-এর ডিফল্ট), যা ক্লায়েন্ট এবং মোবাইল উভয় ক্ষেত্রে ভালো কাজ করে
  account: {
    storeStateStrategy: "database", 
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "customer",
        input: true, // সাইন-আপে ক্লায়েন্ট থেকে role নেওয়া যাবে
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      businessName: {
        type: "string",
        required: false,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
      },
    },
  },
});