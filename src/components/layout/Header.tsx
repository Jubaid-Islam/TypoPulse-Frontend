"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { FiMenu } from "react-icons/fi";
import { toast } from "sonner";

interface HeaderProps {
  onMenuClick?: () => void;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/game", label: "Game" },
  { href: "/history", label: "History" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="max-w-5xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Hamburger (mobile) + Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 -ml-1 text-foreground hover:bg-muted"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <FiMenu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Type<span className="text-primary">Pulse</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Auth buttons (Desktop & Mobile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {getInitials(user.name)}
                </span>
                <span className="text-sm text-muted-foreground max-w-[120px] truncate">
                  {user.name}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="h-8 sm:h-9 text-xs sm:text-sm"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-8 sm:h-9 text-xs sm:text-sm px-2.5 sm:px-3",
                )}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "h-8 sm:h-9 text-xs sm:text-sm px-2.5 sm:px-3 shadow-sm",
                )}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
