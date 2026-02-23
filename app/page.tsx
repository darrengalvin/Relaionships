import { AlarmFlow } from "@/components/alarm-flow";

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">Relationship App</p>
        <h1>Conflict alarm and resolution</h1>
        <p>
          Trigger once, notify both people, de-escalate quickly, hear each side,
          and end with realistic next steps.
        </p>
      </header>
      <AlarmFlow />
    </main>
  );
}
