import Link from "next/link";
import { FaKeyboard } from "react-icons/fa";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-8 sm:py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <FaKeyboard className="h-5 w-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
              TypePulse
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Test your typing speed with precision
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}