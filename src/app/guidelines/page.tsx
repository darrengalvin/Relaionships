"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Check,
  X,
  ChevronDown,
  AlertTriangle,
  Heart,
  Clock,
  MessageCircle,
  Ear,
  Ban,
  Handshake,
  Target,
  Pause,
  ThumbsUp,
} from "lucide-react";
import type { Guideline } from "@/types";

const guidelines: (Guideline & { icon: typeof Shield })[] = [
  {
    id: 1,
    title: "Attack the Problem, Not the Person",
    description:
      "Focus on the specific behavior or situation that's bothering you, not your partner's character. There's a world of difference between criticizing an action and criticizing a person.",
    doExample: '"I feel stressed when the kitchen is left messy after cooking."',
    dontExample: '"You\'re such a slob. You never clean up after yourself."',
    icon: Target,
  },
  {
    id: 2,
    title: "Use 'I' Statements, Not 'You' Accusations",
    description:
      "Starting with 'you' puts your partner on the defensive immediately. Starting with 'I' invites empathy and keeps the focus on your experience.",
    doExample: '"I feel unheard when I\'m talking and you look at your phone."',
    dontExample: '"You never listen to me. You don\'t care about what I say."',
    icon: MessageCircle,
  },
  {
    id: 3,
    title: "Listen to Understand, Not to Respond",
    description:
      "When your partner is speaking, focus on truly understanding their perspective rather than preparing your counterargument. Repeat back what you heard before responding.",
    doExample:
      '"So what I\'m hearing is that you felt excluded when I made that decision alone. Is that right?"',
    dontExample:
      '"Yeah but that\'s not what happened, let me tell you what actually--"',
    icon: Ear,
  },
  {
    id: 4,
    title: 'Avoid "Always" and "Never"',
    description:
      "Absolute words like always and never are almost never accurate and immediately make your partner feel unfairly judged. They escalate rather than resolve.",
    doExample: '"Sometimes I feel like my input isn\'t valued in decisions about our plans."',
    dontExample:
      '"You ALWAYS make plans without asking me. You NEVER consider my feelings."',
    icon: Ban,
  },
  {
    id: 5,
    title: "Take a Break When Things Get Too Hot",
    description:
      "If either person feels flooded with emotion, it's okay to pause. Research shows that after 20 minutes in fight-or-flight, productive conversation becomes impossible. Agree to revisit within 24 hours.",
    doExample:
      '"I\'m feeling too overwhelmed to talk about this well right now. Can we take a 30-minute break and come back to this?"',
    dontExample:
      '"Fine! I\'m done talking about this. Do whatever you want."',
    icon: Pause,
  },
  {
    id: 6,
    title: "Stay on Topic",
    description:
      "Resist the urge to bring up past grievances or pile on additional complaints. Deal with one issue at a time. Kitchen-sinking (throwing everything in) overwhelms and prevents resolution.",
    doExample: '"Let\'s focus on the budget issue right now. We can talk about the other thing separately."',
    dontExample:
      '"And while we\'re at it, you also forgot my birthday AND you were rude to my mother AND--"',
    icon: Target,
  },
  {
    id: 7,
    title: "No Name-Calling, Contempt, or Stonewalling",
    description:
      'Relationship researcher John Gottman calls contempt the #1 predictor of divorce. Eye-rolling, mocking, insults, and the silent treatment are destructive. If you catch yourself doing these, stop and reset.',
    doExample: '"I disagree with that, and here\'s why it concerns me..."',
    dontExample: '"That\'s the dumbest thing I\'ve ever heard. [eye roll]"',
    icon: AlertTriangle,
  },
  {
    id: 8,
    title: "Acknowledge Their Feelings, Even If You Disagree",
    description:
      "Validation doesn't mean agreement. You can acknowledge that your partner's feelings are real and valid while still having a different perspective.",
    doExample:
      '"I can see why that would feel hurtful to you. That wasn\'t my intention, and I want to understand more."',
    dontExample: '"You shouldn\'t feel that way. You\'re overreacting."',
    icon: Heart,
  },
  {
    id: 9,
    title: "Seek Resolution, Not Victory",
    description:
      "An argument isn't a competition. If one person wins and the other loses, you both lose. Look for solutions where both people's needs are met.",
    doExample: '"What would work for both of us? How can we find a middle ground?"',
    dontExample: '"I told you I was right. You finally see it my way."',
    icon: Handshake,
  },
  {
    id: 10,
    title: "End with Repair",
    description:
      "After a difficult conversation, reconnect. A repair attempt can be a hug, an apology, humor, or simply acknowledging that the conversation was hard but you're glad you had it.",
    doExample:
      '"That was tough, but I\'m glad we talked about it. I love you and I want to do better."',
    dontExample: "[walks away in silence, doesn't speak for the rest of the day]",
    icon: ThumbsUp,
  },
];

export default function GuidelinesPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Fair Fighting Rules
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            The Ground Rules for Healthy Conflict
          </h1>
          <p className="text-muted max-w-md mx-auto">
            Read these together and agree to follow them before your next
            difficult conversation. These aren&apos;t just nice ideas -- they&apos;re
            backed by decades of relationship research.
          </p>
        </div>

        <div className="bg-surface-warm rounded-2xl border border-border p-5 mb-8 flex items-start gap-3">
          <Clock className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Before You Start Arguing
            </p>
            <p className="text-sm text-muted mt-1">
              Review these rules together. Both partners should agree: &quot;These
              are our ground rules.&quot; If either person breaks a rule, the other
              can gently say: &quot;Can we try that again using our fair fighting
              rules?&quot;
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {guidelines.map((guideline, index) => {
            const Icon = guideline.icon;
            const isExpanded = expandedId === guideline.id;

            return (
              <motion.div
                key={guideline.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-surface rounded-2xl border border-border overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : guideline.id)
                  }
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-surface-warm/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success to-success/40 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">
                      <span className="text-muted mr-2">
                        {guideline.id}.
                      </span>
                      {guideline.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted flex-shrink-0 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-muted text-sm mb-4 ml-14">
                      {guideline.description}
                    </p>

                    <div className="ml-14 space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-success/5 border border-success/10">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-success mb-1">
                            DO say:
                          </p>
                          <p className="text-sm text-foreground italic">
                            {guideline.doExample}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-xl bg-danger/5 border border-danger/10">
                        <X className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-danger mb-1">
                            DON&apos;T say:
                          </p>
                          <p className="text-sm text-foreground italic">
                            {guideline.dontExample}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
