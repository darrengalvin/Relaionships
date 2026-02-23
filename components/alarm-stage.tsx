import type { ReactNode } from "react";

type StageTone = "neutral" | "alert" | "calm" | "action";

interface AlarmStageProps {
  title: string;
  subtitle: string;
  tone?: StageTone;
  children?: ReactNode;
}

const toneClassMap: Record<StageTone, string> = {
  neutral: "stage-card tone-neutral",
  alert: "stage-card tone-alert",
  calm: "stage-card tone-calm",
  action: "stage-card tone-action",
};

export function AlarmStage({
  title,
  subtitle,
  tone = "neutral",
  children,
}: AlarmStageProps) {
  return (
    <section className={toneClassMap[tone]}>
      <header>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </header>
      {children}
    </section>
  );
}
