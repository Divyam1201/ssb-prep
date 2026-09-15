import { MODULE_LIST } from "@/lib/modules";
import { ModuleCard } from "@/components/modules/module-card";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-16">
      <header className="mb-12 border-b border-gold/25 pb-6">
        <h1 className="text-4xl font-normal tracking-[0.3px] text-parchment">
          SSB Prep — Timed Practice
        </h1>
        <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-muted">
          Practice the Psychology round under real timing. Pick a module, use
          a set someone&apos;s already shared, or submit your own material.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {MODULE_LIST.map((moduleConfig) => (
          <ModuleCard key={moduleConfig.id} moduleConfig={moduleConfig} />
        ))}
      </div>
    </main>
  );
}
