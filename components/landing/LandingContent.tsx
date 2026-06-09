import { LandingProblems } from "./LandingProblems";
import { LandingHowItWorks } from "./LandingHowItWorks";
import { LandingVisualSteps } from "./LandingVisualSteps";
import { LandingFeatures } from "./LandingFeatures";
import { LandingForWho } from "./LandingForWho";
import { LandingMission } from "./LandingMission";

export default function LandingContent() {
  return (
    <main>
      <LandingProblems />
      <LandingHowItWorks />
      <LandingVisualSteps />
      <LandingFeatures />
      <LandingForWho />
      <LandingMission />
    </main>
  );
}
