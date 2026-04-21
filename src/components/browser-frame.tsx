interface BrowserFrameProps {
  children: React.ReactNode;
  /** Mocked URL shown in the address bar. Defaults to a Sheets-like URL. */
  url?: string;
  /** "browser" renders Chrome-ish chrome; "app" renders a compact window frame. */
  variant?: "browser" | "app";
  className?: string;
}

/**
 * Wraps product imagery in a realistic browser/app chrome so generic stock
 * photos read as real screenshots. Use inside a relative/aspect container —
 * children fill the viewport area via absolute inset-0.
 */
export function BrowserFrame({
  children,
  url = "docs.google.com/spreadsheets",
  variant = "browser",
  className = "",
}: BrowserFrameProps) {
  return (
    <div
      className={`relative flex flex-col w-full h-full overflow-hidden rounded-t-md bg-cream border border-navy/10 shadow-[0_10px_40px_-20px_rgba(15,42,34,0.35)] ${className}`}
    >
      {/* Chrome bar */}
      <div className="flex-none flex items-center gap-2 px-3 py-2 bg-cream-2 border-b border-navy/10">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        {variant === "browser" && (
          <div className="ml-2 flex-1 min-w-0 px-3 py-1 rounded bg-cream border border-navy/10 flex items-center gap-2">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-navy/40 flex-none" aria-hidden="true">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 1 1 8 0v4" />
            </svg>
            <span className="font-mono text-[10px] text-navy/50 truncate">{url}</span>
          </div>
        )}
      </div>
      {/* Content area */}
      <div className="relative flex-1 min-h-0 bg-white">{children}</div>
    </div>
  );
}
