'use client'
import dynamic from 'next/dynamic';

const AutomationFlowBuilder = dynamic(
  () =>
    import("../features/automations").then(
      (mod) => mod.AutomationFlowBuilder
    ),
  { ssr: false }
);

export default function HomePage() {
  return <AutomationFlowBuilder />;
}