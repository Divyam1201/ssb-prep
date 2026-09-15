import Link from "next/link";
import { MODULE_CONFIG } from "@/lib/modules";
import { listSets } from "@/lib/sets-service";
import { SetList } from "@/components/modules/set-list";
import { Button } from "@/components/ui/button";
import type { ModuleId } from "@/lib/types";

/**
 * TAT, WAT, and SRT all share the same landing-page shape: a list of
 * existing shared sets, plus a way to submit a new one. Lecturette's
 * landing page looks different (a flip-card deck) so it has its own
 * component instead of using this one.
 */
export async function ModuleLanding({ moduleId }: { moduleId: ModuleId }) {
  const moduleConfig = MODULE_CONFIG[moduleId];
  const sets = await listSets(moduleId);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16">
      <header className="mb-10 border-b border-gold/25 pb-6">
        <p className="font-sans text-xs uppercase tracking-[2px] text-gold-dim">
          {moduleConfig.fullName}
        </p>
        <h1 className="mt-2 text-3xl font-normal text-parchment">{moduleConfig.label}</h1>
        <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-muted">
          {moduleConfig.description}
        </p>
      </header>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-sans text-xs uppercase tracking-[2px] text-muted">
          Shared sets
        </h2>
        <Link href={`${moduleConfig.route}/submit`}>
          <Button variant="gold">Submit a set</Button>
        </Link>
      </div>

      <SetList moduleConfig={moduleConfig} sets={sets} />
    </main>
  );
}
