"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

import { cn, getImageUrl } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { useMe } from "@/lib/actions/auth";
import { cookie } from "@/lib/cookie-client";
import { AUTH_SESSION_COOKIE } from "@/constants/auth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const hasSession = !!cookie.get(AUTH_SESSION_COOKIE);
  const { data: userData, isLoading: isUserLoading } = useMe();
  const user = userData?.data;

  const handleLogout = () => {
    cookie.remove(AUTH_SESSION_COOKIE);
    toast.success("Logged out successfully");
    window.location.href = "/"; // Full reload to clear all states
  };

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

  const isActiveRoute = (href: string) => {
    if (href === "/home") {
      return pathname === "/" || pathname === "/home";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

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
                className={cn(
                  "rounded px-3 py-2 text-sm font-medium transition-colors",
                  isActiveRoute(link.href)
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
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

            {/* Auth Buttons or User Menu */}
            <div className="flex items-center space-x-2">
              {hasSession && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border border-slate-700">
                        <AvatarImage src={getImageUrl(user.avatarUrl)} alt={user.name} />
                        <AvatarFallback className="bg-slate-800 text-slate-200">
                          {user.name?.slice(0, 2).toUpperCase() || "US"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      {user.role === "ADMIN" ? (
                        <Link href="/admin/dashboard" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      ) : (
                        <Link href="/profile" className="cursor-pointer">
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-500 focus:text-red-500" 
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : isUserLoading && hasSession ? (
                <div className="h-10 w-10 animate-pulse rounded-full bg-slate-800" />
              ) : (
                <>
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
                </>
              )}
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
                className={cn(
                  "rounded px-3 py-1 text-xs font-medium transition-colors",
                  isActiveRoute(link.href)
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
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
