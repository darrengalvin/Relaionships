"use client";

import { useEffect, useMemo, useState } from "react";
import { AlarmStage } from "@/components/alarm-stage";
import type { ResolutionStage, SolutionSuggestion, Technique } from "@/types/alarm";

const TECHNIQUES: Technique[] = [
  {
    id: "breathing",
    label: "Box breathing",
    description: "Inhale for 4, hold for 4, exhale for 4, hold for 4.",
  },
  {
    id: "body-check",
    label: "Body check",
    description: "Drop your shoulders and unclench your jaw before speaking.",
  },
  {
    id: "validation",
    label: "Validation script",
    description: "Start with: 'I hear that this feels important to you.'",
  },
  {
    id: "slow-voice",
    label: "Slow voice",
    description: "Lower your volume and slow pace to signal safety.",
  },
];

const MIN_LISTENING_CHARACTERS = 12;

const stageRank: Record<ResolutionStage, number> = {
  idle: 0,
  redTerritory: 1,
  pause: 2,
  listen: 3,
  solutions: 4,
};

function hasKeywordMatch(source: string, keywords: string[]): boolean {
  return keywords.some((keyword) => source.includes(keyword));
}

function buildSuggestions(
  partnerAStory: string,
  partnerBStory: string,
  selectedTechniques: Technique[],
): SolutionSuggestion[] {
  const lowerSource = `${partnerAStory} ${partnerBStory}`.toLowerCase();
  const suggestions: SolutionSuggestion[] = [];

  const addSuggestion = (suggestion: SolutionSuggestion) => {
    if (!suggestions.some((item) => item.id === suggestion.id)) {
      suggestions.push(suggestion);
    }
  };

  addSuggestion({
    id: "mirror-first",
    title: "Mirror both sides before solving",
    details:
      "Each person repeats the other person's main concern before offering an opinion.",
    actions: [
      "Partner A mirrors Partner B in one sentence.",
      "Partner B confirms or corrects it.",
      "Switch roles before discussing next steps.",
    ],
  });

  if (hasKeywordMatch(lowerSource, ["money", "budget", "cost", "bill", "spend"])) {
    addSuggestion({
      id: "money-plan",
      title: "Use a shared money decision rule",
      details:
        "When money tension appears, agree on a threshold that requires both yes votes.",
      actions: [
        "Set a spending threshold together.",
        "Schedule a 15-minute budget review this week.",
        "Document one shared priority for the next month.",
      ],
    });
  }

  if (
    hasKeywordMatch(lowerSource, [
      "time",
      "late",
      "schedule",
      "busy",
      "calendar",
      "plan",
    ])
  ) {
    addSuggestion({
      id: "time-block",
      title: "Time-box the unresolved issue",
      details:
        "Move from circular debate to a defined decision window with a clear agenda.",
      actions: [
        "Book a 20-minute follow-up conversation.",
        "Write one sentence goal for that conversation.",
        "Limit each response to 90 seconds during the follow-up.",
      ],
    });
  }

  if (hasKeywordMatch(lowerSource, ["trust", "ignored", "hurt", "respect", "tone"])) {
    addSuggestion({
      id: "repair",
      title: "Run a repair conversation",
      details:
        "Focus first on impact and emotional safety before discussing behavior changes.",
      actions: [
        "Name one moment that hurt without blame.",
        "State what reassurance is needed right now.",
        "Agree on one boundary for the next 24 hours.",
      ],
    });
  }

  if (selectedTechniques.some((technique) => technique.id === "breathing")) {
    addSuggestion({
      id: "breathing-reset",
      title: "Use breath resets during difficult moments",
      details:
        "Add a short shared reset if either partner notices escalation signs.",
      actions: [
        "Choose a shared reset word.",
        "Pause and do one full box-breathing cycle.",
        "Resume with one 'I feel' sentence each.",
      ],
    });
  }

  addSuggestion({
    id: "close-loop",
    title: "Close with a concrete next step",
    details:
      "Resolution is stronger when each partner leaves with one clear commitment.",
    actions: [
      "Partner A states one action they will take today.",
      "Partner B states one action they will take today.",
      "Set a quick check-in time to review progress.",
    ],
  });

  return suggestions.slice(0, 4);
}

function formatNotificationTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function AlarmFlow() {
  const [stage, setStage] = useState<ResolutionStage>("idle");
  const [notifiedAt, setNotifiedAt] = useState<string | null>(null);
  const [pauseSecondsRemaining, setPauseSecondsRemaining] = useState(90);
  const [selectedTechniqueIds, setSelectedTechniqueIds] = useState<string[]>([]);
  const [partnerAStory, setPartnerAStory] = useState("");
  const [partnerBStory, setPartnerBStory] = useState("");
  const [suggestions, setSuggestions] = useState<SolutionSuggestion[]>([]);

  useEffect(() => {
    if (stage !== "pause" || pauseSecondsRemaining === 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPauseSecondsRemaining((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [stage, pauseSecondsRemaining]);

  const selectedTechniques = useMemo(
    () =>
      TECHNIQUES.filter((technique) => selectedTechniqueIds.includes(technique.id)),
    [selectedTechniqueIds],
  );

  const hasReached = (targetStage: ResolutionStage): boolean =>
    stageRank[stage] >= stageRank[targetStage];

  const canFindSolutions =
    partnerAStory.trim().length >= MIN_LISTENING_CHARACTERS &&
    partnerBStory.trim().length >= MIN_LISTENING_CHARACTERS;

  const triggerAlarm = () => {
    setStage("redTerritory");
    setNotifiedAt(formatNotificationTime(new Date()));
    setPauseSecondsRemaining(90);
    setSelectedTechniqueIds([]);
    setPartnerAStory("");
    setPartnerBStory("");
    setSuggestions([]);
  };

  const handleTechniqueToggle = (techniqueId: string) => {
    setSelectedTechniqueIds((currentIds) =>
      currentIds.includes(techniqueId)
        ? currentIds.filter((id) => id !== techniqueId)
        : [...currentIds, techniqueId],
    );
  };

  const handleFindSolutions = () => {
    const generatedSuggestions = buildSuggestions(
      partnerAStory,
      partnerBStory,
      selectedTechniques,
    );
    setSuggestions(generatedSuggestions);
    setStage("solutions");
  };

  return (
    <div className="flow-grid">
      {stage === "idle" ? (
        <AlarmStage
          title="Relationship Alarm"
          subtitle="If either partner feels escalation, trigger the alarm and pause the conflict."
        >
          <button className="alarm-button" type="button" onClick={triggerAlarm}>
            Trigger alarm 🚨
          </button>
        </AlarmStage>
      ) : null}

      {hasReached("redTerritory") ? (
        <AlarmStage
          title="Red territory reached"
          subtitle="One partner hit the alarm and both partners were notified immediately."
          tone="alert"
        >
          <p className="meta-copy">
            {notifiedAt
              ? `Both partners notified at ${notifiedAt}.`
              : "Both partners have been notified."}
          </p>
          <div className="inline-actions">
            {stage === "redTerritory" ? (
              <button
                className="primary-button"
                type="button"
                onClick={() => setStage("pause")}
              >
                Begin pause
              </button>
            ) : null}
          </div>
        </AlarmStage>
      ) : null}

      {hasReached("pause") ? (
        <AlarmStage
          title="Pause and regulate"
          subtitle="Take a short cooldown and choose techniques before discussing details."
          tone="calm"
        >
          <p className="meta-copy">
            {pauseSecondsRemaining > 0
              ? `Pause timer: ${pauseSecondsRemaining}s`
              : "Pause complete."}
          </p>

          <ul className="technique-list">
            {TECHNIQUES.map((technique) => (
              <li key={technique.id}>
                <label>
                  <input
                    checked={selectedTechniqueIds.includes(technique.id)}
                    onChange={() => handleTechniqueToggle(technique.id)}
                    type="checkbox"
                  />
                  <span>
                    <strong>{technique.label}:</strong> {technique.description}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          {stage === "pause" ? (
            <button
              className="primary-button"
              type="button"
              onClick={() => setStage("listen")}
              disabled={pauseSecondsRemaining > 0}
            >
              Continue to listening mode
            </button>
          ) : null}
        </AlarmStage>
      ) : null}

      {hasReached("listen") ? (
        <AlarmStage
          title="Listen to both sides"
          subtitle="Capture both perspectives clearly before moving to solutions."
          tone="action"
        >
          <div className="story-grid">
            <label>
              Partner A perspective
              <textarea
                value={partnerAStory}
                onChange={(event) => setPartnerAStory(event.target.value)}
                placeholder="Describe what happened and what matters most to you."
              />
            </label>
            <label>
              Partner B perspective
              <textarea
                value={partnerBStory}
                onChange={(event) => setPartnerBStory(event.target.value)}
                placeholder="Describe your experience and what you need next."
              />
            </label>
          </div>

          {stage === "listen" ? (
            <button
              className="primary-button"
              type="button"
              onClick={handleFindSolutions}
              disabled={!canFindSolutions}
            >
              Find solutions
            </button>
          ) : null}
          {!canFindSolutions && stage === "listen" ? (
            <p className="helper-copy">
              Add at least {MIN_LISTENING_CHARACTERS} characters for each side.
            </p>
          ) : null}
        </AlarmStage>
      ) : null}

      {stage === "solutions" ? (
        <AlarmStage
          title="Suggested solutions"
          subtitle="Choose one or two options you can both commit to right now."
          tone="action"
        >
          <ul className="solution-list">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id}>
                <h3>{suggestion.title}</h3>
                <p>{suggestion.details}</p>
                <ol>
                  {suggestion.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>

          <div className="inline-actions">
            <button className="primary-button" type="button" onClick={triggerAlarm}>
              Restart alarm flow
            </button>
          </div>
        </AlarmStage>
      ) : null}
    </div>
  );
}
