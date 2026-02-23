"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Heart,
  Mountain,
  Brain,
} from "lucide-react";

type Phase = "idle" | "inhale" | "hold" | "exhale" | "hold-out";

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdOut: number;
  icon: typeof Wind;
}

const patterns: BreathingPattern[] = [
  {
    id: "box",
    name: "Box Breathing",
    description:
      "Equal counts for all phases. Used by Navy SEALs to stay calm under extreme stress.",
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdOut: 4,
    icon: Wind,
  },
  {
    id: "calm",
    name: "4-7-8 Calming",
    description:
      'Dr. Weil\'s relaxation technique. Called a "natural tranquilizer for the nervous system."',
    inhale: 4,
    hold: 7,
    exhale: 8,
    holdOut: 0,
    icon: Heart,
  },
  {
    id: "energize",
    name: "Resonance Breathing",
    description:
      "Slow, balanced breathing at 5 breaths per minute. Maximizes heart rate variability and calms the mind.",
    inhale: 6,
    hold: 0,
    exhale: 6,
    holdOut: 0,
    icon: Mountain,
  },
];

const groundingPrompts = [
  "Name 5 things you can see right now.",
  "Name 4 things you can physically feel.",
  "Name 3 things you can hear.",
  "Name 2 things you can smell.",
  "Name 1 thing you can taste.",
  "Remember a moment when you and your partner laughed together.",
  "Think of one quality you genuinely admire in your partner.",
  "Remember why you fell in love.",
  "What is one kind thing your partner did for you recently?",
  "What would you want your partner to know you feel right now?",
];

export default function CooldownPage() {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(
    patterns[0]
  );
  const [phase, setPhase] = useState<Phase>("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [showGrounding, setShowGrounding] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getPhaseLabel = (p: Phase) => {
    switch (p) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "hold-out":
        return "Hold";
      default:
        return "Ready";
    }
  };

  const getPhaseDuration = useCallback(
    (p: Phase) => {
      switch (p) {
        case "inhale":
          return selectedPattern.inhale;
        case "hold":
          return selectedPattern.hold;
        case "exhale":
          return selectedPattern.exhale;
        case "hold-out":
          return selectedPattern.holdOut;
        default:
          return 0;
      }
    },
    [selectedPattern]
  );

  const getNextPhase = useCallback(
    (current: Phase): Phase => {
      switch (current) {
        case "idle":
          return "inhale";
        case "inhale":
          return selectedPattern.hold > 0 ? "hold" : "exhale";
        case "hold":
          return "exhale";
        case "exhale":
          return selectedPattern.holdOut > 0 ? "hold-out" : "inhale";
        case "hold-out":
          return "inhale";
        default:
          return "inhale";
      }
    },
    [selectedPattern]
  );

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
      setPhaseTime((prev) => {
        const duration = getPhaseDuration(phase);
        if (prev + 1 >= duration) {
          const next = getNextPhase(phase);
          if (phase === "exhale" || (phase === "hold-out" && next === "inhale")) {
            setCycleCount((c) => c + 1);
          }
          setPhase(next);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, phase, getPhaseDuration, getNextPhase]);

  function start() {
    setIsRunning(true);
    setPhase("inhale");
    setPhaseTime(0);
  }

  function togglePause() {
    setIsRunning(!isRunning);
  }

  function reset() {
    setIsRunning(false);
    setPhase("idle");
    setPhaseTime(0);
    setElapsed(0);
    setCycleCount(0);
  }

  const phaseDuration = getPhaseDuration(phase);
  const progress = phaseDuration > 0 ? phaseTime / phaseDuration : 0;
  const circleSize = phase === "inhale" ? 1.3 : phase === "exhale" ? 0.85 : 1;

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-calm-blue/10 text-calm-blue text-sm font-medium mb-4">
            <Wind className="w-4 h-4" />
            Cool Down Zone
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Take a Breath Before You Speak
          </h1>
          <p className="text-muted max-w-md mx-auto">
            When emotions are high, your brain goes into fight-or-flight. These
            exercises bring you back to a place where real conversation can
            happen.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {patterns.map((pattern) => {
            const Icon = pattern.icon;
            return (
              <button
                key={pattern.id}
                onClick={() => {
                  if (!isRunning) {
                    setSelectedPattern(pattern);
                    reset();
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  selectedPattern.id === pattern.id
                    ? "bg-calm-blue text-white shadow-md"
                    : "bg-surface border border-border text-muted hover:text-foreground hover:bg-surface-warm"
                }`}
              >
                <Icon className="w-4 h-4" />
                {pattern.name}
              </button>
            );
          })}
        </div>

        <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 mb-8">
          <div className="text-center mb-4">
            <p className="text-sm text-muted">{selectedPattern.description}</p>
          </div>

          <div className="flex items-center justify-center my-12">
            <motion.div
              animate={{ scale: circleSize }}
              transition={{ duration: phaseDuration, ease: "easeInOut" }}
              className="relative"
            >
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-calm-blue/20 to-calm-blue/5 flex items-center justify-center">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-calm-blue/30 to-calm-blue/10 flex items-center justify-center">
                  <div className="text-center">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={phase}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="text-xl sm:text-2xl font-semibold text-calm-blue"
                      >
                        {getPhaseLabel(phase)}
                      </motion.p>
                    </AnimatePresence>
                    {phase !== "idle" && (
                      <p className="text-3xl font-bold text-foreground mt-1">
                        {Math.max(0, phaseDuration - phaseTime)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {phase !== "idle" && (
                <svg
                  className="absolute inset-0 -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-calm-blue/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-calm-blue"
                    strokeDasharray={`${progress * 289} 289`}
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            {phase === "idle" ? (
              <button
                onClick={start}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-calm-blue text-white font-medium hover:bg-calm-blue/90 transition-colors shadow-md"
              >
                <Play className="w-5 h-5" />
                Begin
              </button>
            ) : (
              <>
                <button
                  onClick={togglePause}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-calm-blue text-white font-medium hover:bg-calm-blue/90 transition-colors"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Resume
                    </>
                  )}
                </button>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted font-medium hover:text-foreground hover:bg-surface-warm transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
            <span className="flex items-center gap-1.5">
              <Wind className="w-4 h-4" />
              {cycleCount} cycles
            </span>
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8">
          <button
            onClick={() => setShowGrounding(!showGrounding)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-soft-pink to-soft-pink/40 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">
                  Grounding & Reflection
                </h3>
                <p className="text-sm text-muted">
                  Prompts to bring you back to the present
                </p>
              </div>
            </div>
            <span className="text-muted text-xl">
              {showGrounding ? "−" : "+"}
            </span>
          </button>

          {showGrounding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6"
            >
              <div className="bg-surface-warm rounded-xl p-6 text-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentPrompt}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-lg text-foreground font-medium mb-4"
                  >
                    {groundingPrompts[currentPrompt]}
                  </motion.p>
                </AnimatePresence>
                <button
                  onClick={() =>
                    setCurrentPrompt(
                      (prev) => (prev + 1) % groundingPrompts.length
                    )
                  }
                  className="text-sm text-calm-blue font-medium hover:text-calm-blue/80 transition-colors"
                >
                  Next prompt →
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
