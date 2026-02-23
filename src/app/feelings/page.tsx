"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenLine,
  Copy,
  Check,
  Sparkles,
  RotateCcw,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { saveFeeling, getFeelings, generateId } from "@/lib/storage";
import type { FeelingStatement } from "@/types";

const feelingWords = [
  { category: "Hurt", words: ["hurt", "betrayed", "dismissed", "ignored", "rejected", "undervalued", "unseen"] },
  { category: "Angry", words: ["frustrated", "irritated", "resentful", "furious", "annoyed", "fed up", "outraged"] },
  { category: "Sad", words: ["disappointed", "lonely", "heartbroken", "discouraged", "hopeless", "empty", "grief"] },
  { category: "Anxious", words: ["worried", "overwhelmed", "insecure", "afraid", "panicked", "uneasy", "nervous"] },
  { category: "Confused", words: ["lost", "unsure", "torn", "conflicted", "puzzled", "doubtful", "uncertain"] },
];

const needWords = [
  "respect", "understanding", "honesty", "safety", "connection",
  "appreciation", "space", "support", "trust", "patience",
  "affection", "equality", "reassurance", "quality time", "communication",
];

export default function FeelingsPage() {
  const [situation, setSituation] = useState("");
  const [feeling, setFeeling] = useState("");
  const [need, setNeed] = useState("");
  const [request, setRequest] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<FeelingStatement[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const fullStatement =
    situation && feeling && need && request
      ? `When ${situation}, I feel ${feeling} because I need ${need}. Would you be willing to ${request}?`
      : "";

  function handleCopy() {
    if (!fullStatement) return;
    navigator.clipboard.writeText(fullStatement);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSave() {
    if (!fullStatement) return;
    saveFeeling({
      id: generateId(),
      date: new Date().toISOString(),
      situation,
      feeling,
      need,
      request,
      fullStatement,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setSituation("");
    setFeeling("");
    setNeed("");
    setRequest("");
  }

  function loadHistory() {
    setHistory(getFeelings());
    setShowHistory(!showHistory);
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-soft-pink/10 text-soft-pink text-sm font-medium mb-4">
            <PenLine className="w-4 h-4" />
            &quot;I Feel&quot; Builder
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Say What You Mean, Without the Blame
          </h1>
          <p className="text-muted max-w-md mx-auto">
            Transform accusatory language into constructive communication. This
            formula helps you express what you feel, why, and what you need.
          </p>
        </div>

        <div className="bg-surface-warm rounded-2xl border border-border p-5 mb-8">
          <p className="text-sm text-primary-dark font-medium mb-1">
            The Formula:
          </p>
          <p className="text-foreground font-medium">
            &quot;When{" "}
            <span className="text-accent">[situation]</span>, I feel{" "}
            <span className="text-soft-pink">[feeling]</span> because I need{" "}
            <span className="text-calm-blue">[need]</span>. Would you be
            willing to{" "}
            <span className="text-success">[request]</span>?&quot;
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                When...{" "}
                <span className="text-muted font-normal">
                  (describe the situation)
                </span>
              </span>
            </label>
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              className="w-full h-20 px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none transition-all"
              placeholder={'e.g., "you come home late without texting" or "we don\'t spend evenings together"'}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-soft-pink text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                I feel...{" "}
                <span className="text-muted font-normal">
                  (name the emotion)
                </span>
              </span>
            </label>
            <input
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-soft-pink/30 focus:border-soft-pink transition-all"
              placeholder="e.g., worried and unimportant"
            />
            <div className="mt-3 space-y-2">
              {feelingWords.map((cat) => (
                <div key={cat.category}>
                  <button
                    onClick={() =>
                      setExpandedCategory(
                        expandedCategory === cat.category
                          ? null
                          : cat.category
                      )
                    }
                    className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
                  >
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        expandedCategory === cat.category ? "rotate-180" : ""
                      }`}
                    />
                    {cat.category}
                  </button>
                  {expandedCategory === cat.category && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5 ml-4">
                      {cat.words.map((word) => (
                        <button
                          key={word}
                          onClick={() =>
                            setFeeling((prev) =>
                              prev ? `${prev} and ${word}` : word
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-soft-pink/10 text-soft-pink text-xs font-medium hover:bg-soft-pink/20 transition-colors"
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-calm-blue text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                Because I need...{" "}
                <span className="text-muted font-normal">
                  (identify the need)
                </span>
              </span>
            </label>
            <input
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-calm-blue/30 focus:border-calm-blue transition-all"
              placeholder="e.g., to feel like a priority in your life"
            />
            <div className="flex flex-wrap gap-1.5 mt-3">
              {needWords.map((word) => (
                <button
                  key={word}
                  onClick={() =>
                    setNeed((prev) => (prev ? `${prev} and ${word}` : word))
                  }
                  className="px-2.5 py-1 rounded-lg bg-calm-blue/10 text-calm-blue text-xs font-medium hover:bg-calm-blue/20 transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-success text-white text-xs flex items-center justify-center font-bold">
                  4
                </span>
                Would you be willing to...{" "}
                <span className="text-muted font-normal">
                  (make a request)
                </span>
              </span>
            </label>
            <textarea
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              className="w-full h-20 px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-success/30 focus:border-success resize-none transition-all"
              placeholder={'e.g., "text me when you\'ll be more than 30 minutes late"'}
            />
          </div>
        </div>

        {fullStatement && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-2xl border-2 border-accent/30 p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">
                Your Statement:
              </h3>
            </div>
            <p className="text-foreground text-lg leading-relaxed italic">
              &quot;{fullStatement}&quot;
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy
                  </>
                )}
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-success/10 text-success text-sm font-medium hover:bg-success/20 transition-colors"
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" /> Saved
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" /> Save
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-muted text-sm font-medium hover:text-foreground hover:bg-surface-warm transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Clear
              </button>
            </div>
          </motion.div>
        )}

        <button
          onClick={loadHistory}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-surface border border-border hover:bg-surface-warm transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <BookOpen className="w-4 h-4 text-muted" />
            Past Statements
          </span>
          <ChevronDown
            className={`w-4 h-4 text-muted transition-transform ${
              showHistory ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-3"
            >
              {history.length === 0 ? (
                <p className="text-center text-muted text-sm py-6">
                  No saved statements yet. Build your first one above.
                </p>
              ) : (
                history.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-xl bg-surface border border-border"
                  >
                    <p className="text-sm text-foreground italic mb-2">
                      &quot;{entry.fullStatement}&quot;
                    </p>
                    <p className="text-xs text-muted">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
