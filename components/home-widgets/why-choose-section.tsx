import { Icon } from "@iconify/react";
import { Zap, Wrench, Settings, ShieldCheck } from "lucide-react";
import Image from "next/image";

const features = [
	{
		icon: <Zap className="h-6 w-6 text-primary" />,
		title: "Energy Savings",
		description:
			"Reduce your energy costs by 20% with our reliable solar power and motion sensors. Experience the efficiency of automatic light dimming and take control of your energy usage!",
	},
	{
		icon: <Wrench className="h-6 w-6 text-primary" />,
		title: "Quick Installation",
		description:
			"Innovative controls offer quick, hassle-free installation. Implement them during off hours without disrupting, and enjoy the convenience of wireless functionality—no additional wiring needed!",
	},
	{
		icon: <Settings className="h-6 w-6 text-primary" />,
		title: "Flexible Solutions",
		description:
			"Easy configuration via our Android or iOS app & integrate with building management systems using BACnet. We also provide wireless solutions for EnOcean, ZigBee, and Bluetooth.",
	},
	{
		icon: <ShieldCheck className="h-6 w-6 text-primary" />,
		title: "Energy Code Compliance",
		description:
			"Our self-powered wireless switches and sensors effortlessly comply with current government energy codes: California Title 24 and ASHRAE 90.1.",
	},
];

export function WhyChooseSection() {
	return (
		<section className="pb-10 pt-20">
			<div className="container mx-auto px-4">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<Image
						src="https://static.wixstatic.com/media/1411ab_dc60d8ad8f524536b052d0adb97287a8~mv2.png/v1/fill/w_977,h_886,al_c,q_90,enc_avif,quality_auto/1411ab_dc60d8ad8f524536b052d0adb97287a8~mv2.png"
						alt="Warehouse control system"
						width={500}
						height={500}
						className="rounded-2xl w-full h-full shadow-xl border border-border"
					/>
					<div className="space-y-6">
						<h2 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight">
							Energy Features That Power Reliable Performance
						</h2>
						<p className="text-lg text-muted-foreground">
							Industry-leading wireless control technology designed for the most
							demanding environments
						</p>
						<div className="space-y-4">
							{features.map(feature => (
								<div key={feature.title} className="flex gap-4">
									<div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
										{feature.icon}
									</div>
									<div>
										<h3 className="font-semibold mb-1">{feature.title}</h3>
										<p className="text-sm text-muted-foreground">{feature.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
