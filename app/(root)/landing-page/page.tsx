import AISearchSection from "./components/AISearchSection"
import HowItWorksSection from "./components/HowItWorksSection"
import LandingCTA from "./components/LandingCTA"
import LandingHero from "./components/LandingHero"
import MissionSection from "./components/MissionSection"

export default function LandingPage() {
	return (
		<main className="flex w-full flex-col overflow-hidden">
			<LandingHero />
			<AISearchSection />
			<HowItWorksSection />
			<MissionSection />
			<LandingCTA />
		</main>
	)
}
