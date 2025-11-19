"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type SkeletonProps = {
	className?: string;
};

export function ProductGridSkeleton({ cards = 12 }: { cards?: number }) {
	return (
		<div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
			{Array.from({ length: cards }).map((_, idx) => (
				<div key={`product-card-skeleton-${idx}`} className="space-y-3">
					<Skeleton className="aspect-square w-full rounded-lg bg-muted/50" />
					<Skeleton className="h-4 w-3/4 bg-muted/60" />
					<Skeleton className="h-4 w-1/3 bg-muted/40" />
					<div className="flex gap-2">
						<Skeleton className="h-8 flex-1 bg-muted/50" />
						<Skeleton className="h-8 flex-1 bg-muted/40" />
					</div>
				</div>
			))}
		</div>
	);
}

export default function ProductsPageSkeleton() {
	return (
		<div className="min-h-screen pb-20">
			<div className="bg-accent pt-10 pb-6">
				<div className="container mx-auto px-4">
					<Skeleton className="h-10 w-40 rounded-lg bg-muted/70" />
					<Skeleton className="mt-4 h-4 w-72 bg-muted/60" />
					<div className="mt-6 flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
						<Skeleton className="h-14 w-full max-w-xl bg-muted/50" />
						<Skeleton className="h-10 w-24 bg-muted/60" />
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 pt-10">
				<div className="flex gap-8">
					<aside className="hidden w-64 shrink-0 lg:block">
						<div className="sticky top-24 space-y-6">
							<div>
								<Skeleton className="mb-3 h-4 w-20 bg-muted/70" />
								<div className="space-y-3">
									{Array.from({ length: 6 }).map((_, idx) => (
										<div
											key={`category-skeleton-${idx}`}
											className="flex items-center gap-3"
										>
											<Skeleton className="h-4 w-4 rounded-full bg-muted/60" />
											<Skeleton className="h-4 flex-1 bg-muted/40" />
										</div>
									))}
								</div>
							</div>

							{["Voltage", "Frequency"].map(label => (
								<div key={label}>
									<Skeleton className="mb-3 h-4 w-24 bg-muted/70" />
									<Skeleton className="h-10 w-full bg-muted/50" />
								</div>
							))}

							<div>
								<Skeleton className="mb-3 h-4 w-20 bg-muted/70" />
								<div className="space-y-3">
									{Array.from({ length: 4 }).map((_, idx) => (
										<div
											key={`protocol-skeleton-${idx}`}
											className="flex items-center gap-3"
										>
											<Skeleton className="h-4 w-4 rounded bg-muted/60" />
											<Skeleton className="h-4 flex-1 bg-muted/40" />
										</div>
									))}
								</div>
							</div>

							<Skeleton className="h-10 w-full bg-muted/60" />
						</div>
					</aside>

					<div className="flex-1 min-w-0">
						<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
							<Skeleton className="h-10 w-24 bg-muted/60 lg:hidden" />
							<Skeleton className="h-10 w-40 bg-muted/60" />
						</div>

						<Skeleton className="mb-6 h-4 w-40 bg-muted/50" />

						<ProductGridSkeleton />
					</div>
				</div>
			</div>
		</div>
	);
}
