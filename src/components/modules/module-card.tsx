import Link from "next/link";
import type { ModuleConfig } from "@/lib/modules";

export function ModuleCard({ moduleConfig }: { moduleConfig: ModuleConfig }) {
  return (
    <Link
      href={moduleConfig.route}
      className="group block rounded-md border border-gold/20 bg-ink-2 p-6 transition-colors duration-150 hover:border-gold/50 hover:bg-[#1d242c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-parchment focus-visible:outline-offset-2"
    >
      <h2 className="text-2xl text-parchment group-hover:text-gold transition-colors duration-150">
        {moduleConfig.label}
      </h2>
      <p className="mt-1 font-sans text-xs uppercase tracking-[2px] text-gold-dim">
        {moduleConfig.fullName}
      </p>
      <p className="mt-4 font-sans text-sm leading-relaxed text-muted">
        {moduleConfig.description}
      </p>
    </Link>
  );
}
