"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqSection() {
	return (
		<section id="faq" className="pt-16 pb-8 bg-background">
			<div className="container mx-auto px-4 max-w-3xl text-center">
				<h2 className="text-5xl font-bold mb-4">Need Help?</h2>
				<p className="text-muted-foreground mb-8">
					Find quick answers to common questions or learn how to get started with
					LumiControl.
				</p>

				<Tabs defaultValue="getting-started" className="w-full">
					{/* Tabs Header */}
					<TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
						<TabsTrigger value="getting-started">Getting Started</TabsTrigger>
						<TabsTrigger value="faq">FAQ</TabsTrigger>
					</TabsList>

					{/* Getting Started Tab */}
					<TabsContent value="getting-started">
						<Accordion type="single" collapsible className="w-full text-left">
							<AccordionItem value="item-1">
								<AccordionTrigger>
									How do I install LumiControl devices?
								</AccordionTrigger>
								<AccordionContent>
									Simply connect your LumiControl device to power, open the LumiControl
									app, and follow the in-app pairing guide. Most devices auto-detect
									within 30 seconds.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="item-2">
								<AccordionTrigger>Do I need an internet connection?</AccordionTrigger>
								<AccordionContent>
									An internet connection is required for remote access and firmware
									updates. However, local automation still works without internet once
									configured.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="item-3">
								<AccordionTrigger>
									Can I control multiple devices at once?
								</AccordionTrigger>
								<AccordionContent>
									Yes! You can create groups or scenes in the LumiControl app to control
									multiple devices simultaneously.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</TabsContent>

					{/* FAQ Tab */}
					<TabsContent value="faq">
						<Accordion type="single" collapsible className="w-full text-left">
							<AccordionItem value="item-1">
								<AccordionTrigger>
									Where can I buy LumiControl products?
								</AccordionTrigger>
								<AccordionContent>
									You can find authorized distributors and online stores on our “Where to
									Buy” page, accessible from the top navigation.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="item-2">
								<AccordionTrigger>
									Is there a warranty for LumiControl products?
								</AccordionTrigger>
								<AccordionContent>
									All LumiControl products include a 1-year limited warranty covering
									manufacturer defects and performance issues.
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="item-3">
								<AccordionTrigger>How can I contact support?</AccordionTrigger>
								<AccordionContent>
									Reach our support team via the “Get a Quote” form or by emailing{" "}
									<span className="font-medium">support@lumicontrol.com</span>.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</TabsContent>
				</Tabs>
			</div>
		</section>
	);
}
