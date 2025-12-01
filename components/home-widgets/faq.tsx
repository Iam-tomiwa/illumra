"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import type { HomePageQueryResult } from "@/sanity.types";
import { faqContent } from "@/sanity/lib/demo";
import { sanitizeSanityData } from "@/sanity/lib/utils";

type FaqSectionProps = {
	faqs?: NonNullable<HomePageQueryResult>["faq"];
};

export default function FaqSection({ faqs = [] }: FaqSectionProps) {
	const normalizedFaqs = faqs ?? faqContent;
	const gettingStartedFaqs =
		normalizedFaqs?.filter(
			faq => sanitizeSanityData(faq?.group) === "gettingStarted"
		) || [];
	const generalFaqs =
		normalizedFaqs?.filter(faq => sanitizeSanityData(faq?.group) === "faq") || [];

	const hasGettingStarted = gettingStartedFaqs.length > 0;
	const hasGeneralFaqs = generalFaqs.length > 0;

	// // Don't render if no FAQs
	if (!hasGettingStarted && !hasGeneralFaqs) {
		return null;
	}

	return (
		<section id="faq" className="pt-16 pb-8 bg-background">
			<div className="container mx-auto px-4 max-w-3xl text-center">
				<h2 className="text-5xl font-bold mb-4">Need Help?</h2>
				<p className="text-muted-foreground mb-8">
					Find quick answers to common questions or learn how to get started with
					LumiControl.
				</p>

				<Tabs
					defaultValue={hasGettingStarted ? "getting-started" : "faq"}
					className="w-full"
				>
					{/* Tabs Header */}
					<TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
						{hasGettingStarted && (
							<TabsTrigger value="getting-started">Getting Started</TabsTrigger>
						)}
						{hasGeneralFaqs && <TabsTrigger value="faq">FAQ</TabsTrigger>}
					</TabsList>

					{/* Getting Started Tab */}
					{hasGettingStarted && (
						<TabsContent value="getting-started">
							<Accordion type="single" collapsible className="w-full text-left">
								{gettingStartedFaqs.map((faq, index) => (
									<AccordionItem key={index} value={`getting-started-${index}`}>
										<AccordionTrigger>{faq?.question}</AccordionTrigger>
										<AccordionContent>{faq?.answer}</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</TabsContent>
					)}

					{/* FAQ Tab */}
					{hasGeneralFaqs && (
						<TabsContent value="faq">
							<Accordion type="single" collapsible className="w-full text-left">
								{generalFaqs.map((faq, index) => (
									<AccordionItem key={index} value={`faq-${index}`}>
										<AccordionTrigger>{faq?.question}</AccordionTrigger>
										<AccordionContent>{faq?.answer}</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</TabsContent>
					)}
				</Tabs>
			</div>
		</section>
	);
}
