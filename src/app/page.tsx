"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageCircleHeart,
  Wind,
  PenLine,
  Shield,
  BookOpen,
  Sparkles,
  Heart,
  ArrowRight,
  Handshake,
} from "lucide-react";

const features = [
  {
    href: "/resolve",
    icon: MessageCircleHeart,
    title: "Conflict Resolution",
    description:
      "A guided 5-step process that helps you both feel heard, find common ground, and reach a resolution together.",
    color: "from-accent to-accent-light",
    textColor: "text-accent",
  },
  {
    href: "/cooldown",
    icon: Wind,
    title: "Cool Down Zone",
    description:
      "When emotions run high, take a breather. Guided breathing exercises and grounding techniques to reset before you talk.",
    color: "from-calm-blue to-calm-blue/40",
    textColor: "text-calm-blue",
  },
  {
    href: "/feelings",
    icon: PenLine,
    title: '"I Feel" Builder',
    description:
      'Transform blame into understanding. Build constructive "I feel..." statements that express your needs without accusation.',
    color: "from-soft-pink to-soft-pink/40",
    textColor: "text-soft-pink",
  },
  {
    href: "/guidelines",
    icon: Shield,
    title: "Fair Fighting Rules",
    description:
      "Evidence-based communication guidelines that keep disagreements productive, respectful, and solution-focused.",
    color: "from-success to-success/40",
    textColor: "text-success",
  },
  {
    href: "/journal",
    icon: BookOpen,
    title: "Conflict Journal",
    description:
      "Track your conflicts and resolutions over time. Spot patterns, celebrate progress, and learn from the past.",
    color: "from-warm-yellow to-warm-yellow/40",
    textColor: "text-warm-yellow",
  },
  {
    href: "/appreciate",
    icon: Sparkles,
    title: "Appreciation Wall",
    description:
      "Balance the hard conversations with gratitude. Leave notes of appreciation for each other and remember why you chose this.",
    color: "from-primary to-primary-light",
    textColor: "text-primary",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 sm:py-28 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-warm via-background to-accent-light/20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8">
              <Handshake className="w-4 h-4" />
              Built for couples who choose each other, every day
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6">
              Stop Arguing.
              <br />
              <span className="bg-gradient-to-r from-accent to-soft-pink bg-clip-text text-transparent">
                Start Understanding.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              Every couple disagrees. The difference is how you handle it.
              CoupleCare gives you the tools to navigate conflict with empathy,
              express your needs clearly, and grow stronger together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/resolve"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent to-primary text-white font-semibold text-lg shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <MessageCircleHeart className="w-5 h-5" />
                Start Resolving
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/cooldown"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-surface border border-border text-foreground font-semibold text-lg hover:bg-surface-warm transition-all duration-300"
              >
                <Wind className="w-5 h-5" />
                Need to Cool Down First?
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Fight{" "}
              <span className="italic text-accent">Fair</span>
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Six tools designed by relationship principles to help you move
              from conflict to connection.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.href} variants={item}>
                  <Link
                    href={feature.href}
                    className="group block p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <div
                      className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${feature.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      Open tool <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl bg-gradient-to-br from-surface-warm to-accent-light/30 border border-border p-8 sm:p-12 text-center"
          >
            <Heart
              className="w-8 h-8 text-accent mx-auto mb-6"
              fill="currentColor"
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Remember: You&apos;re on the Same Team
            </h2>
            <p className="text-muted text-lg leading-relaxed max-w-xl mx-auto mb-6">
              Conflict isn&apos;t a sign of failure -- it&apos;s a sign you both
              care. The goal isn&apos;t to win the argument; it&apos;s to
              understand each other better. You chose each other. Now choose to
              listen.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-gentle" />
              Your data stays private, stored only on your device
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-accent" fill="currentColor" />
            <span>CoupleCare -- Because love is worth the work</span>
          </div>
          <p>All data stored locally. Your conversations stay yours.</p>
        </div>
      </footer>
    </div>
  );
}
