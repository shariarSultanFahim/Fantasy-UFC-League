import Link from "next/link";
import { LegalPageRenderer } from "../components/LegalPageRenderer";

const TERMS_SECTIONS = [
  {
    title: "Introduction",
    body: [
      "By accessing or using Fantasy Fight League, you agree to be bound by these Terms of Service and any applicable laws.",
      "If you do not agree to any part of these terms, you are not permitted to use the platform.",
    ],
  },
  {
    title: "User Accounts",
    body: [
      "You must register for an account to participate in leagues.",
      "You are responsible for maintaining the confidentiality of your password and for all activity under your account.",
    ],
  },
  {
    title: "League Participation Rules",
    body: [
      "Users may create private or public leagues depending on the platform tools available at the time.",
      "League commissioners may set join requirements, draft settings, and participation rules for their own leagues.",
    ],
  },
  {
    title: "Fantasy Draft Rules",
    body: [
      "Draft formats, pick windows, and roster construction can vary by league.",
      "It is your responsibility to understand the draft settings before the draft begins.",
    ],
  },
  {
    title: "Fair Play Policy",
    body: [
      "Manipulating rankings, exploiting software issues, or using automated tools to gain an unfair advantage is prohibited.",
      "Any attempt to interfere with the integrity of the platform may result in account suspension or termination.",
    ],
  },
  {
    title: "Content Usage",
    body: [
      "Statistics, images, and information shown on the platform are provided for entertainment and league management purposes only.",
      "You may not copy or redistribute platform content in a way that violates applicable rights or laws.",
    ],
  },
  {
    title: "Account Suspension",
    body: [
      "We reserve the right to suspend or terminate access to the service immediately if these terms are breached.",
      "Where practical, we may notify you before taking action, but that notice is not required in cases of abuse or security risk.",
    ],
  },
  {
    title: "Changes to Terms",
    body: [
      "We may update these terms from time to time.",
      "If the changes are material, we will revise this page and update the Last Updated date above.",
    ],
  },
];

function TermsFallback() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <ol className="space-y-10">
        {TERMS_SECTIONS.map((section, index) => (
          <li key={section.title} className="space-y-4 border-l-2 border-[#EC5B13] pl-5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {index + 1}. {section.title}
            </h2>
            <div className="space-y-3 text-sm leading-7 text-slate-600 sm:text-base">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-[#0E172B] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-orange-400 uppercase">
            Last Updated: June 2024
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Terms <span className="text-[#EC5B13]">&amp; Conditions</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            These terms define the rules and guidelines for using the fantasy league platform.
            Please read them carefully before participating.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <LegalPageRenderer type="TERMS_AND_CONDITIONS" fallback={<TermsFallback />} />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <hr className="my-12 border-slate-200" />

        <p className="text-center text-sm leading-7 text-slate-600 sm:text-base">
          Questions about these terms?{" "}
          <Link
            href="/contact"
            className="font-semibold text-[#EC5B13] underline-offset-4 hover:underline"
          >
            Contact Support
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
