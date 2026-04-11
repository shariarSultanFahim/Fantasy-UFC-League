"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/home" },
        { label: "Rankings", href: "/rankings" },
        { label: "Leagues", href: "/leagues-directory" },
        { label: "Leaderboard", href: "/leaderboard" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "About", href: "/about" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" }
      ]
    }
  ];

  return (
    <footer className="border-t border-slate-800 bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 text-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="mb-4 flex items-center space-x-2 text-lg font-bold text-[#FFD700]">
              MMA <span className="ml-1 text-white"> Fantasy</span>
            </div>
            <p className="text-sm text-slate-400">The ultimate MMA fantasy experience.</p>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold text-white">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <p className="text-sm text-slate-500">
              &copy; {currentYear} Fantasy MMA League Manager. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-4 sm:mt-0">
              <Link
                href="/privacy"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
              <span className="text-slate-700">•</span>
              <Link
                href="/terms"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
