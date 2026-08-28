"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { FiX, FiHome, FiPlay, FiClock, FiAward } from "react-icons/fi";
import { toast } from "sonner";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/game", label: "Game", icon: FiPlay },
  { href: "/history", label: "History", icon: FiClock },
  { href: "/leaderboard", label: "Leaderboard", icon: FiAward },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      onClose();
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sidebar drawer */}
      <aside className="fixed left-0 top-0 z-50 h-full w-72 bg-background border-r shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/" onClick={onClose} className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight text-primary">
              TypePulse
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={onClose}
            aria-label="Close menu"
          >
            <FiX className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col p-4 space-y-1 flex-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth status on mobile drawer */}
        <div className="border-t p-4 space-y-3 bg-muted/20">
          {user ? (
            <div className="space-y-3">
              <div className="px-1 text-xs text-muted-foreground truncate">
                Signed in as <span className="font-semibold text-foreground">{user.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="sm" onClick={onClose}>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" onClick={onClose}>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}