"use client";

import Image from "next/image";
import Link from "next/link";

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Header() {
  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/rankings", label: "Rankings" },
    { href: "/leagues-directory", label: "Leagues" },
    { href: "/scoring", label: "Scoring" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" }
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" }
  ];

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-slate-800 bg-linear-to-r from-slate-950 via-slate-900 to-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/home" className="flex shrink-0 items-center space-x-2">
            <Image src="/logo.png" alt="Fantasy MMA Logo" width={40} height={40} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section - Social + Auth */}
          <div className="flex items-center space-x-4">
            {/* Social Icons - Desktop */}
            <div className="hidden items-center space-x-2 md:flex">
              <span className="text-xs text-slate-400">Follow us:</span>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-slate-400 transition-colors hover:text-white"
                    aria-label={social.label}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-[#144045] bg-[#144045] hover:bg-[#144045]/80 hover:text-white"
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
              <Button asChild size="sm" className="bg-[#2F3969] hover:bg-[#2F3969]/80">
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="mt-4 border-t border-slate-800 pb-4 lg:hidden">
          <nav className="flex flex-wrap gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
