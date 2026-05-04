import Link from "next/link";
import { LegalPageRenderer } from "../components/LegalPageRenderer";

const PRIVACY_SECTIONS = [
  {
    title: "Information We Collect",
    body: [
      "To provide the fantasy experience, we collect only the data needed to run your account and league activity.",
      "That may include account details such as your name, email address, and profile settings.",
      "We also collect platform activity such as league entries, drafts, roster moves, and leaderboard interactions.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "We use your data to maintain the integrity of the platform and improve your experience.",
      "This includes account management, league participation, leaderboard accuracy, platform updates, and performance improvements.",
    ],
  },
  {
    title: "Cookies and Tracking",
    body: [
      "We use essential cookies to keep you logged in and functional cookies to remember your preferences.",
      "Analytics cookies may be used to understand how users navigate the platform so we can optimize the experience.",
    ],
  },
  {
    title: "Data Protection",
    body: [
      "We apply standard encryption and security controls to help protect your account and personal data.",
      "Access to sensitive information is limited to authorized personnel and trusted service providers only.",
    ],
    quote: "We treat your data like championship-level defense: carefully, consistently, and with layered protection.",
  },
  {
    title: "Third-Party Services",
    body: [
      "Some product features rely on trusted providers for hosting, analytics, and email delivery.",
      "Those services only receive the data necessary to perform their role and are expected to follow their own privacy obligations.",
    ],
  },
  {
    title: "User Rights",
    body: [
      "You can request access, correction, export, or deletion of your data at any time.",
      "If you need help with your account or privacy settings, contact our support team and we will respond promptly.",
    ],
  },
  {
    title: "Policy Updates",
    body: [
      "We may update this policy from time to time to reflect product changes or legal requirements.",
      "When the changes are material, we will update the page and notify users through the platform or email.",
    ],
  },
];

function PrivacyFallback() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <ol className="space-y-10">
        {PRIVACY_SECTIONS.map((section, index) => (
          <li key={section.title} className="space-y-4 border-l-2 border-amber-400 pl-5">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {index + 1}. {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 sm:text-base">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            {section.quote ? (
              <blockquote className="border-l-4 border-[#EC5B13] bg-[#FFF7F2] px-4 py-3 text-sm leading-7 text-slate-700 italic sm:text-base">
                {section.quote}
              </blockquote>
            ) : null}
          </li>
        ))}
      </ol>
    </article>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-[#F3F4F6] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-amber-500 uppercase">
            Last Updated: June 2024
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            At Fantasy Fight League, your privacy is part of the game plan. This policy explains how
            we collect, use, and protect the information you share while using our MMA fantasy
            sports platform.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <LegalPageRenderer type="PRIVACY_POLICY" fallback={<PrivacyFallback />} />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <hr className="my-12 border-slate-200" />

        <p className="text-center text-sm leading-7 text-slate-600 sm:text-base">
          Have questions about your data?{" "}
          <Link
            href="/contact"
            className="font-semibold text-[#EC5B13] underline-offset-4 hover:underline"
          >
            Contact Privacy Support
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
