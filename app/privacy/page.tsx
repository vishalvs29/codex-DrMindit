import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-10 shadow-2xl shadow-slate-950/10 backdrop-blur-xl text-slate-100">
        <p className="text-sm uppercase tracking-[0.35em] text-cyanGlow">Privacy Policy</p>
        <h1 className="mt-4 text-4xl font-semibold">Your privacy, your care</h1>
        <p className="mt-6 text-base leading-8 text-slate-300">
          DrMindit collects and stores mood entries, chat history, and profile details to personalize your mental wellness experience. We only process this data to help keep your sessions safe, supportive, and aligned with your needs.
        </p>

        <section className="mt-10 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">What we collect</h2>
            <p className="mt-3 text-slate-300">
              We collect mood check-ins, chat messages, session progress, and user profile information such as name and email. This data stays private and is used to personalize care, improve recommendations, and preserve continuity across devices.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">How we use it</h2>
            <p className="mt-3 text-slate-300">
              Personal information is used for sign-in, analytics, and providing your subscription access. Chat and mood history are used to build context for your wellness journey and to support crisis-aware care when needed.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Your rights</h2>
            <p className="mt-3 text-slate-300">
              You can request deletion of your account and personal data, or update your profile at any time. Sensitive information is not shared with third parties except for service providers required to operate the platform.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Safety and crisis support</h2>
            <p className="mt-3 text-slate-300">
              If we detect crisis language, we will surface immediate help resources before any AI response is generated. We also encourage users in distress to contact local emergency services or trusted support networks.
            </p>
          </div>
        </section>

        <div className="mt-10 border-t border-white/10 pt-8 text-sm text-slate-400">
          <p>Last updated: May 2026.</p>
          <p className="mt-3">Need help? Return to the <Link href="/" className="text-cyanGlow underline">home page</Link>.</p>
        </div>
      </div>
    </main>
  );
}
