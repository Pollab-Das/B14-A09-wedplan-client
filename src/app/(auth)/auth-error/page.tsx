import Link from "next/link";

const messages: Record<string, string> = {
  state_mismatch:
    "Your sign-in request expired or was already used. Please try again from a fresh tab.",
  state_not_found: "We could not verify your sign-in request. Please try again.",
  no_code: "Google did not return an authorization code. Please try again.",
  invalid_code: "The authorization code is invalid or expired. Please try again.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message =
    (error && messages[error]) ||
    "We could not complete your sign-in. Please try again.";

  return (
    <div className="w-full text-center">
      <h1 className="font-heading text-4xl font-bold text-[#FDFBF7] mb-2">
        Sign In Interrupted
      </h1>
      <p className="text-slate-400 mb-8">{message}</p>
      <div className="flex justify-center gap-4">
        <Link
          href="/sign-in"
          className="h-12 px-6 inline-flex items-center justify-center rounded-lg bg-[#d4af37] hover:bg-[#e6c86e] text-[#0f172a] font-bold"
        >
          Back to Sign In
        </Link>
        <Link
          href="/"
          className="h-12 px-6 inline-flex items-center justify-center rounded-lg border border-slate-700 text-slate-300 hover:border-slate-500"
        >
          Go Home
        </Link>
      </div>
      {error ? (
        <p className="mt-6 text-xs text-slate-600">Reference: {error}</p>
      ) : null}
    </div>
  );
}
