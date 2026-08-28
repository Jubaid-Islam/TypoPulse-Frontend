export function Footer() {
  return (
    <footer className="border-t py-4  bg-muted/20">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 sm:flex-row text-center sm:text-left">
        <div className="text-xs sm:text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} TypePulse. All rights reserved.
        </div>
        <div className="hidden md:block flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
          <span>Precision Typing Challenge</span>
        </div>
      </div>
    </footer>
  );
}