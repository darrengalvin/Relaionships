"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircleHeart,
  Ear,
  Handshake,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Heart,
  AlertTriangle,
} from "lucide-react";
import { saveConflict, generateId } from "@/lib/storage";

const steps = [
  {
    id: 1,
    title: "What's This About?",
    description: "Name the issue without blame. Describe the situation, not the person.",
    prompt: "Describe the disagreement in one or two neutral sentences. Focus on the situation, not who's at fault.",
    icon: AlertTriangle,
    tip: 'Try to start with "We disagree about..." instead of "You always..."',
  },
  {
    id: 2,
    title: "Partner 1's Perspective",
    description: "First partner shares their feelings and experience without interruption.",
    prompt: "Partner 1: Share how this situation makes you feel and why it matters to you. Speak from your own experience.",
    icon: Ear,
    tip: 'Use "I feel..." and "I need..." rather than "You never..." or "You always..."',
  },
  {
    id: 3,
    title: "Partner 2's Perspective",
    description: "Second partner shares their feelings and experience without interruption.",
    prompt: "Partner 2: Now share how this same situation makes you feel and why it matters to you.",
    icon: Ear,
    tip: "Listen to understand, not to respond. Repeat back what you heard before sharing.",
  },
  {
    id: 4,
    title: "Find Common Ground",
    description: "What do you both agree on? What values or goals do you share?",
    prompt: "Together: What do you both want out of this? Where do your needs overlap? What matters to both of you?",
    icon: Handshake,
    tip: "You probably both want to feel respected, heard, and loved. Start there.",
  },
  {
    id: 5,
    title: "Agree on a Path Forward",
    description: "Create a specific, actionable resolution you can both commit to.",
    prompt: "What's one concrete step you'll both take? Be specific about what changes and by when.",
    icon: Lightbulb,
    tip: "A good resolution is specific, fair, and something you're both willing to do -- not just willing to agree to.",
  },
];

export default function ResolvePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<string[]>(
    new Array(steps.length).fill("")
  );
  const [isComplete, setIsComplete] = useState(false);
  const [direction, setDirection] = useState(1);

  const step = steps[currentStep];

  function handleNext() {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      saveConflict({
        id: generateId(),
        date: new Date().toISOString(),
        topic: responses[0],
        partner1Perspective: responses[1],
        partner2Perspective: responses[2],
        commonGround: responses[3],
        resolution: responses[4],
        status: "resolved",
        emotionsBefore: {
          anger: 0,
          sadness: 0,
          frustration: 0,
          hurt: 0,
          anxiety: 0,
        },
      });
      setIsComplete(true);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  }

  function handleReset() {
    setCurrentStep(0);
    setResponses(new Array(steps.length).fill(""));
    setIsComplete(false);
    setDirection(1);
  }

  function updateResponse(value: string) {
    const newResponses = [...responses];
    newResponses[currentStep] = value;
    setResponses(newResponses);
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-success to-success/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Resolution Reached
          </h1>
          <p className="text-muted text-lg mb-8 leading-relaxed">
            You did it. You listened, you shared, and you found a way forward
            together. This conversation has been saved to your journal.
          </p>

          <div className="bg-surface rounded-2xl border border-border p-6 mb-8 text-left">
            <h3 className="font-semibold text-foreground mb-2">
              Your Agreement:
            </h3>
            <p className="text-muted italic">
              &quot;{responses[4] || "No specific resolution noted"}&quot;
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              New Conversation
            </button>
            <a
              href="/journal"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-surface-warm transition-colors"
            >
              View Journal
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <MessageCircleHeart className="w-4 h-4" />
            Guided Resolution
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Let&apos;s Work Through This Together
          </h1>
        </div>

        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex-1 flex items-center gap-2">
              <div
                className={`w-full h-2 rounded-full transition-all duration-500 ${
                  i < currentStep
                    ? "bg-success"
                    : i === currentStep
                    ? "bg-accent"
                    : "bg-border"
                }`}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted mb-6">
          <span>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-soft-pink" fill="currentColor" />
            Take your time
          </span>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">
                    {step.title}
                  </h2>
                  <p className="text-muted text-sm">{step.description}</p>
                </div>
              </div>

              <label className="block text-sm font-medium text-foreground mb-2">
                {step.prompt}
              </label>
              <textarea
                value={responses[currentStep]}
                onChange={(e) => updateResponse(e.target.value)}
                className="w-full h-36 px-4 py-3 rounded-xl border border-border bg-surface-warm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none transition-all"
                placeholder="Take turns writing here, or discuss out loud and note the key points..."
              />

              <div className="mt-4 p-3 rounded-xl bg-accent-light/20 border border-accent-light/30">
                <p className="text-sm text-primary-dark flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" />
                  <span>
                    <strong>Tip:</strong> {step.tip}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-muted font-medium hover:text-foreground hover:bg-surface-warm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent/90 transition-all shadow-md shadow-accent/10"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Complete
                <CheckCircle2 className="w-4 h-4" />
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
