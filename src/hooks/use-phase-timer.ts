"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TimerPhase } from "@/lib/types";

export type PhaseTimerStatus = "idle" | "running" | "paused" | "finished";

interface UsePhaseTimerOptions {
  /** Called once, synchronously, when a phase's countdown reaches zero —
   *  before the timer advances to the next phase (or finishes). */
  onPhaseComplete?: (phase: TimerPhase, phaseIndex: number) => void;
  /** Called once, after the final phase completes. */
  onAllComplete?: () => void;
}

interface UsePhaseTimerResult {
  status: PhaseTimerStatus;
  currentPhase: TimerPhase | null;
  currentPhaseIndex: number;
  remainingSeconds: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

/**
 * Drives an ordered list of timed phases, one at a time, ticking down every
 * second and advancing automatically when a phase hits zero.
 *
 * This is the one timing primitive every module builds on: TAT and WAT feed
 * it many short per-item phases (swapping the displayed image/word as the
 * phase index advances), SRT feeds it a single long phase (static content,
 * only the corner clock moves), and Lecturette feeds it a two-phase
 * prep-then-narrate run for whichever topic the user drew.
 *
 * Design note: all ticking state (remaining seconds, current phase index) is
 * mirrored into refs alongside the React state that drives rendering. The
 * interval callback reads and advances those refs directly — it's a
 * subscription to an external clock, not an effect reacting to component
 * state — which keeps a single 1-second interval alive for an entire run
 * instead of tearing down and recreating one on every tick or phase change.
 */
export function usePhaseTimer(
  phases: TimerPhase[],
  { onPhaseComplete, onAllComplete }: UsePhaseTimerOptions = {}
): UsePhaseTimerResult {
  const [status, setStatus] = useState<PhaseTimerStatus>("idle");
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(phases[0]?.durationSeconds ?? 0);

  // Whenever the phase list itself changes identity (e.g. a set's items
  // finished loading from the API), start over at phase zero. Adjusting
  // state during render — rather than in an effect — is the pattern React
  // recommends for "reset state when a prop changes."
  const [phasesAtLastReset, setPhasesAtLastReset] = useState(phases);
  if (phases !== phasesAtLastReset) {
    setPhasesAtLastReset(phases);
    setStatus("idle");
    setPhaseIndex(0);
    setRemainingSeconds(phases[0]?.durationSeconds ?? 0);
  }

  const phasesRef = useRef(phases);
  const phaseIndexRef = useRef(phaseIndex);
  const remainingSecondsRef = useRef(remainingSeconds);
  const onPhaseCompleteRef = useRef(onPhaseComplete);
  const onAllCompleteRef = useRef(onAllComplete);

  useEffect(() => {
    phasesRef.current = phases;
  }, [phases]);

  useEffect(() => {
    phaseIndexRef.current = phaseIndex;
  }, [phaseIndex]);

  useEffect(() => {
    remainingSecondsRef.current = remainingSeconds;
  }, [remainingSeconds]);

  useEffect(() => {
    onPhaseCompleteRef.current = onPhaseComplete;
  }, [onPhaseComplete]);

  useEffect(() => {
    onAllCompleteRef.current = onAllComplete;
  }, [onAllComplete]);

  useEffect(() => {
    if (status !== "running") return;

    const intervalId = setInterval(() => {
      const prevRemaining = remainingSecondsRef.current;

      if (prevRemaining > 1) {
        const next = prevRemaining - 1;
        remainingSecondsRef.current = next;
        setRemainingSeconds(next);
        return;
      }

      const completedIndex = phaseIndexRef.current;
      const completedPhase = phasesRef.current[completedIndex];
      if (completedPhase) {
        onPhaseCompleteRef.current?.(completedPhase, completedIndex);
      }

      const nextIndex = completedIndex + 1;
      const nextPhase = phasesRef.current[nextIndex];

      if (!nextPhase) {
        remainingSecondsRef.current = 0;
        setRemainingSeconds(0);
        setStatus("finished");
        onAllCompleteRef.current?.();
        return;
      }

      phaseIndexRef.current = nextIndex;
      remainingSecondsRef.current = nextPhase.durationSeconds;
      setPhaseIndex(nextIndex);
      setRemainingSeconds(nextPhase.durationSeconds);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status]);

  const start = useCallback(() => {
    if (phases.length === 0) return;
    phaseIndexRef.current = 0;
    remainingSecondsRef.current = phases[0].durationSeconds;
    setPhaseIndex(0);
    setRemainingSeconds(phases[0].durationSeconds);
    setStatus("running");
  }, [phases]);

  const pause = useCallback(() => {
    setStatus((prev) => (prev === "running" ? "paused" : prev));
  }, []);

  const resume = useCallback(() => {
    setStatus((prev) => (prev === "paused" ? "running" : prev));
  }, []);

  const reset = useCallback(() => {
    const initialSeconds = phases[0]?.durationSeconds ?? 0;
    phaseIndexRef.current = 0;
    remainingSecondsRef.current = initialSeconds;
    setStatus("idle");
    setPhaseIndex(0);
    setRemainingSeconds(initialSeconds);
  }, [phases]);

  return {
    status,
    currentPhase: phases[phaseIndex] ?? null,
    currentPhaseIndex: phaseIndex,
    remainingSeconds,
    start,
    pause,
    resume,
    reset,
  };
}
