"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Plus,
  Heart,
  Smile,
  HandHeart,
  Flame,
  Zap,
  Star,
  Leaf,
  Gift,
} from "lucide-react";
import {
  getAppreciations,
  saveAppreciation,
  getPartnerNames,
  savePartnerNames,
  generateId,
} from "@/lib/storage";
import type { AppreciationNote, AppreciationCategory } from "@/types";

const categoryConfig: Record<
  AppreciationCategory,
  { label: string; icon: typeof Heart; gradient: string }
> = {
  kindness: {
    label: "Kindness",
    icon: HandHeart,
    gradient: "from-soft-pink to-soft-pink/40",
  },
  support: {
    label: "Support",
    icon: HandHeart,
    gradient: "from-calm-blue to-calm-blue/40",
  },
  humor: {
    label: "Humor",
    icon: Smile,
    gradient: "from-warm-yellow to-warm-yellow/40",
  },
  effort: {
    label: "Effort",
    icon: Zap,
    gradient: "from-accent to-accent-light",
  },
  love: {
    label: "Love",
    icon: Heart,
    gradient: "from-danger to-soft-pink",
  },
  growth: {
    label: "Growth",
    icon: Leaf,
    gradient: "from-success to-success/40",
  },
  patience: {
    label: "Patience",
    icon: Star,
    gradient: "from-primary to-primary-light",
  },
  other: {
    label: "Other",
    icon: Gift,
    gradient: "from-muted to-muted/40",
  },
};

export default function AppreciatePage() {
  const [notes, setNotes] = useState<AppreciationNote[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [names, setNames] = useState({ partner1: "Partner 1", partner2: "Partner 2" });
  const [editingNames, setEditingNames] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<AppreciationCategory>("kindness");

  useEffect(() => {
    setNotes(getAppreciations());
    setNames(getPartnerNames());
  }, []);

  useEffect(() => {
    if (names.partner1 !== "Partner 1" || names.partner2 !== "Partner 2") {
      if (!from) setFrom(names.partner1);
      if (!to) setTo(names.partner2);
    }
  }, [names, from, to]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    saveAppreciation({
      id: generateId(),
      date: new Date().toISOString(),
      from: from || names.partner1,
      to: to || names.partner2,
      message: message.trim(),
      category,
    });
    setNotes(getAppreciations());
    setMessage("");
    setShowForm(false);
  }

  function handleSaveNames() {
    savePartnerNames(names);
    setEditingNames(false);
  }

  function swapFromTo() {
    setFrom(to);
    setTo(from);
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Appreciation Wall
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Remember the Good Stuff
          </h1>
          <p className="text-muted max-w-md mx-auto">
            It&apos;s easy to focus on what&apos;s wrong. This space is for what&apos;s
            right. Leave notes of gratitude, appreciation, and love for each
            other.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            {editingNames ? (
              <div className="flex items-center gap-2">
                <input
                  value={names.partner1}
                  onChange={(e) =>
                    setNames({ ...names, partner1: e.target.value })
                  }
                  className="w-28 px-2 py-1 rounded-lg border border-border bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="Name 1"
                />
                <span className="text-muted">&</span>
                <input
                  value={names.partner2}
                  onChange={(e) =>
                    setNames({ ...names, partner2: e.target.value })
                  }
                  className="w-28 px-2 py-1 rounded-lg border border-border bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="Name 2"
                />
                <button
                  onClick={handleSaveNames}
                  className="px-3 py-1 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingNames(true)}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {names.partner1} & {names.partner2}{" "}
                <span className="text-xs">(edit)</span>
              </button>
            )}
          </div>
          <span className="text-sm text-muted">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </span>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-primary text-white font-medium hover:shadow-lg hover:shadow-accent/10 transition-all shadow-md mb-6"
        >
          <Plus className="w-5 h-5" />
          Leave a Note of Appreciation
        </button>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="bg-surface rounded-2xl border border-border p-6 mb-8 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-muted mb-1">
                    From
                  </label>
                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface-warm text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    <option value={names.partner1}>{names.partner1}</option>
                    <option value={names.partner2}>{names.partner2}</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={swapFromTo}
                  className="mt-5 p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-warm transition-colors"
                  aria-label="Swap from and to"
                >
                  ⇄
                </button>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-muted mb-1">
                    To
                  </label>
                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface-warm text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    <option value={names.partner2}>{names.partner2}</option>
                    <option value={names.partner1}>{names.partner1}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    Object.entries(categoryConfig) as [
                      AppreciationCategory,
                      (typeof categoryConfig)[AppreciationCategory]
                    ][]
                  ).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setCategory(key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          category === key
                            ? "bg-accent text-white shadow-sm"
                            : "bg-surface-warm text-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Your Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-28 px-4 py-3 rounded-xl border border-border bg-surface-warm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none transition-all"
                  placeholder="What do you appreciate about them? What did they do that made your day? What quality of theirs are you grateful for?"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
                >
                  Post Note
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 rounded-xl border border-border text-muted font-medium hover:text-foreground hover:bg-surface-warm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {notes.length === 0 ? (
          <div className="text-center py-16">
            <Flame className="w-12 h-12 text-border mx-auto mb-4" />
            <p className="text-muted font-medium">No notes yet</p>
            <p className="text-sm text-muted/70 mt-1">
              Be the first to leave a note of appreciation.
            </p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="columns-1 sm:columns-2 gap-4 space-y-4"
          >
            {notes.map((note) => {
              const config = categoryConfig[note.category];
              const Icon = config.icon;

              return (
                <motion.div
                  key={note.id}
                  variants={item}
                  className="break-inside-avoid bg-surface rounded-2xl border border-border p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        {note.from}{" "}
                        <span className="text-muted font-normal">→</span>{" "}
                        {note.to}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(note.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {note.message}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
