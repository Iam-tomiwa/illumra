import React from "react";
import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function BecomeARep({ className }: { className?: string }) {
	return (
		<section id="rep" className={cn("py-20 bg-accent/30", className)}>
			<div className="container mx-auto px-4 max-w-4xl">
				<div className="space-y-8">
					<div>
						<h2 className="font-heading text-3xl font-semibold tracking-tight mb-4">
							Become a Rep
						</h2>
						<p className="text-lg text-foreground/90 mb-6">
							ILLUMRA is looking for qualified manufacturer representatives.
						</p>
						<p className="text-lg text-foreground/90 mb-8">
							If you are interested please click the button below and indicate your interest in becoming a rep in the request field.
						</p>
						<Button asChild size="lg">
							<Link href="/contact" >
								Contact Us to Become a Rep <Icon icon="lucide:arrow-right" className="size-5" />
							</Link>
						</Button>
					</div>

					{/* <Card className="border-2">
						<CardContent className="pt-6">
							<div className="space-y-6">
								<div>
									<h3 className="text-xl font-semibold mb-2">Jan Finlinson</h3>
									<p className="text-foreground/80">Sales Manager</p>
								</div>

								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<Icon
											icon="lucide:phone"
											className="size-5 text-primary mt-1 shrink-0"
										/>
										<div>
											<p className="font-medium">Phone</p>
											<a href="tel:+18012252226" className="underline">
												(801) 225-2226 x 4400
											</a>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Icon
											icon="lucide:printer-check"
											className="size-5 text-primary mt-1 shrink-0"
										/>
										<div>
											<p className="font-medium">Fax</p>
											<a href="tel:+18016147100" className="underline">
												(801) 614-7100
											</a>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Icon
											icon="lucide:mail"
											className="size-5 text-primary mt-1 shrink-0"
										/>
										<div>
											<p className="font-medium">Email</p>
											<a href="mailto:sales@illumra.com" className="underline">
												sales@illumra.com
											</a>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card> */}
				</div>
			</div>
		</section>
	);
}
