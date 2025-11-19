import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CTASection() {
	return (
		<section className="py-20 bg-card/50">
			<div className="container mx-auto px-4">
				<Card className="max-w-4xl mx-auto bg-linear-to-br from-card to-accent/20 border-accent">
					<CardContent className="pt-12 pb-12 text-center">
						<h2 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4">
							Ready to Transform Your Facility?
						</h2>
						<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
							Schedule a free consultation with our experts to discover how much you
							can save with wireless control
						</p>
						<Button size="lg">
							<Icon icon="solar:phone-bold" className="size-5" />
							Schedule Consultation
						</Button>
						<div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<Icon icon="solar:check-circle-bold" className="size-5 text-primary" />
								<span>No obligation</span>
							</div>
							<div className="flex items-center gap-2">
								<Icon icon="solar:check-circle-bold" className="size-5 text-primary" />
								<span>Free site assessment</span>
							</div>
							<div className="flex items-center gap-2">
								<Icon icon="solar:check-circle-bold" className="size-5 text-primary" />
								<span>Custom proposal</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
