"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  getConflicts,
  saveConflict,
  deleteConflict,
  generateId,
} from "@/lib/storage";
import type { ConflictEntry } from "@/types";

const statusConfig = {
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
    color: "text-warm-yellow",
    bg: "bg-warm-yellow/10",
  },
  unresolved: {
    label: "Unresolved",
    icon: AlertCircle,
    color: "text-danger",
    bg: "bg-danger/10",
  },
};

export default function JournalPage() {
  const [conflicts, setConflicts] = useState<ConflictEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    topic: "",
    partner1Perspective: "",
    partner2Perspective: "",
    commonGround: "",
    resolution: "",
    status: "unresolved" as ConflictEntry["status"],
  });

  useEffect(() => {
    setConflicts(getConflicts());
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const entry: ConflictEntry = {
      id: generateId(),
      date: new Date().toISOString(),
      ...formData,
      emotionsBefore: {
        anger: 0,
        sadness: 0,
        frustration: 0,
        hurt: 0,
        anxiety: 0,
      },
    };
    saveConflict(entry);
    setConflicts(getConflicts());
    setFormData({
      topic: "",
      partner1Perspective: "",
      partner2Perspective: "",
      commonGround: "",
      resolution: "",
      status: "unresolved",
    });
    setShowForm(false);
  }

  function handleDelete(id: string) {
    deleteConflict(id);
    setConflicts(getConflicts());
  }

  function handleStatusChange(id: string, status: ConflictEntry["status"]) {
    const conflict = conflicts.find((c) => c.id === id);
    if (!conflict) return;
    saveConflict({ ...conflict, status });
    setConflicts(getConflicts());
  }

  const resolvedCount = conflicts.filter((c) => c.status === "resolved").length;
  const totalCount = conflicts.length;
  const resolutionRate =
    totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warm-yellow/10 text-warm-yellow text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Conflict Journal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Track Your Conflicts & Growth
          </h1>
          <p className="text-muted max-w-md mx-auto">
            Log disagreements, track how you resolved them, and spot patterns
            over time. Every resolved conflict is proof you&apos;re growing
            together.
          </p>
        </div>

        {totalCount > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-surface rounded-xl border border-border p-4 text-center">
              <BarChart3 className="w-5 h-5 text-muted mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{totalCount}</p>
              <p className="text-xs text-muted">Total Logged</p>
            </div>
            <div className="bg-surface rounded-xl border border-border p-4 text-center">
              <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-1" />
              <p className="text-2xl font-bold text-success">{resolvedCount}</p>
              <p className="text-xs text-muted">Resolved</p>
            </div>
            <div className="bg-surface rounded-xl border border-border p-4 text-center">
              <TrendingUp className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-2xl font-bold text-accent">
                {resolutionRate}%
              </p>
              <p className="text-xs text-muted">Resolution Rate</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent/90 transition-colors shadow-md mb-6"
        >
          <Plus className="w-5 h-5" />
          Log a Conflict
        </button>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="bg-surface rounded-2xl border border-border p-6 mb-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  What was it about?
                </label>
                <input
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-warm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                  placeholder="Brief description of the disagreement"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Partner 1&apos;s Side
                  </label>
                  <textarea
                    value={formData.partner1Perspective}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        partner1Perspective: e.target.value,
                      })
                    }
                    className="w-full h-24 px-4 py-2.5 rounded-xl border border-border bg-surface-warm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none transition-all"
                    placeholder="How they see it..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Partner 2&apos;s Side
                  </label>
                  <textarea
                    value={formData.partner2Perspective}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        partner2Perspective: e.target.value,
                      })
                    }
                    className="w-full h-24 px-4 py-2.5 rounded-xl border border-border bg-surface-warm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none transition-all"
                    placeholder="How they see it..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Common Ground
                </label>
                <textarea
                  value={formData.commonGround}
                  onChange={(e) =>
                    setFormData({ ...formData, commonGround: e.target.value })
                  }
                  className="w-full h-20 px-4 py-2.5 rounded-xl border border-border bg-surface-warm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none transition-all"
                  placeholder="What do you both agree on?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Resolution / Next Steps
                </label>
                <textarea
                  value={formData.resolution}
                  onChange={(e) =>
                    setFormData({ ...formData, resolution: e.target.value })
                  }
                  className="w-full h-20 px-4 py-2.5 rounded-xl border border-border bg-surface-warm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none transition-all"
                  placeholder="How did you resolve it, or what's the plan?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <div className="flex gap-2">
                  {(
                    Object.keys(statusConfig) as ConflictEntry["status"][]
                  ).map((status) => {
                    const config = statusConfig[status];
                    return (
                      <button
                        type="button"
                        key={status}
                        onClick={() => setFormData({ ...formData, status })}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.status === status
                            ? `${config.bg} ${config.color} ring-2 ring-current/20`
                            : "bg-surface-warm text-muted hover:text-foreground"
                        }`}
                      >
                        <config.icon className="w-4 h-4" />
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
                >
                  Save Entry
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

        <div className="space-y-3">
          {conflicts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-border mx-auto mb-4" />
              <p className="text-muted font-medium">No entries yet</p>
              <p className="text-sm text-muted/70 mt-1">
                Your conflict journal is empty. Entries from the resolution flow
                will appear here automatically.
              </p>
            </div>
          ) : (
            conflicts.map((conflict) => {
              const config = statusConfig[conflict.status];
              const isExpanded = expandedId === conflict.id;

              return (
                <div
                  key={conflict.id}
                  className="bg-surface rounded-2xl border border-border overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : conflict.id)
                    }
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-surface-warm/50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}
                    >
                      <config.icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {conflict.topic}
                      </h3>
                      <p className="text-xs text-muted">
                        {new Date(conflict.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.color}`}
                      >
                        {config.label}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-4 pb-4 space-y-3"
                    >
                      {conflict.partner1Perspective && (
                        <div className="p-3 rounded-xl bg-surface-warm">
                          <p className="text-xs font-medium text-muted mb-1">
                            Partner 1&apos;s Perspective
                          </p>
                          <p className="text-sm text-foreground">
                            {conflict.partner1Perspective}
                          </p>
                        </div>
                      )}

                      {conflict.partner2Perspective && (
                        <div className="p-3 rounded-xl bg-surface-warm">
                          <p className="text-xs font-medium text-muted mb-1">
                            Partner 2&apos;s Perspective
                          </p>
                          <p className="text-sm text-foreground">
                            {conflict.partner2Perspective}
                          </p>
                        </div>
                      )}

                      {conflict.commonGround && (
                        <div className="p-3 rounded-xl bg-success/5 border border-success/10">
                          <p className="text-xs font-medium text-success mb-1">
                            Common Ground
                          </p>
                          <p className="text-sm text-foreground">
                            {conflict.commonGround}
                          </p>
                        </div>
                      )}

                      {conflict.resolution && (
                        <div className="p-3 rounded-xl bg-accent/5 border border-accent/10">
                          <p className="text-xs font-medium text-accent mb-1">
                            Resolution
                          </p>
                          <p className="text-sm text-foreground">
                            {conflict.resolution}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex gap-2">
                          {(
                            Object.keys(
                              statusConfig
                            ) as ConflictEntry["status"][]
                          ).map((status) => {
                            const sc = statusConfig[status];
                            return (
                              <button
                                key={status}
                                onClick={() =>
                                  handleStatusChange(conflict.id, status)
                                }
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  conflict.status === status
                                    ? `${sc.bg} ${sc.color}`
                                    : "text-muted hover:bg-surface-warm"
                                }`}
                              >
                                <sc.icon className="w-3 h-3" />
                                {sc.label}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => handleDelete(conflict.id)}
                          className="p-2 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                          aria-label="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
