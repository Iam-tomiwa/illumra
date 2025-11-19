import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function ProductLoading() {
	return (
		<div className="min-h-screen bg-background">
			{/* Breadcrumb Skeleton */}
			<div className="pt-10">
				<div className="container mx-auto px-4">
					<nav className="flex flex-wrap items-center gap-2">
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-4 w-4 rounded-full" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-4 rounded-full" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-4 rounded-full" />
						<Skeleton className="h-4 w-48" />
					</nav>
				</div>
			</div>

			<div className="container mx-auto px-4 py-12">
				<div className="flex flex-col lg:flex-row gap-12 mb-16">
					{/* Image Slider Skeleton */}
					<div className="w-full lg:w-1/2">
						<Skeleton className="aspect-square w-full rounded-lg" />
						<div className="mt-4 flex gap-2">
							{Array.from({ length: 4 }).map((_, idx) => (
								<Skeleton key={`thumbnail-${idx}`} className="h-20 w-20 rounded-md" />
							))}
						</div>
					</div>

					{/* Product Details Skeleton */}
					<div className="w-full lg:w-1/2 space-y-8">
						<div className="space-y-4">
							{/* Title */}
							<Skeleton className="h-12 w-3/4" />
							{/* SKU */}
							<Skeleton className="h-4 w-32" />
							{/* Body content */}
							<div className="space-y-2 pt-4">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-5/6" />
							</div>
						</div>

						{/* Key Features Skeleton */}
						<div>
							<Skeleton className="mb-4 h-8 w-40" />
							<div className="space-y-3">
								{Array.from({ length: 4 }).map((_, idx) => (
									<div key={`feature-${idx}`} className="flex items-center gap-3">
										<Skeleton className="h-5 w-5 shrink-0 rounded" />
										<div className="flex-1 space-y-1">
											<Skeleton className="h-4 w-24" />
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-8">
					{/* Specifications Skeleton */}
					<div>
						<Skeleton className="mb-4 h-8 w-48" />
						<div className="space-y-3">
							{Array.from({ length: 6 }).map((_, idx) => (
								<div
									key={`spec-${idx}`}
									className="flex items-center justify-between border-b border-border pb-3"
								>
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-40" />
								</div>
							))}
						</div>
					</div>

					{/* Resources Skeleton */}
					<div>
						<Skeleton className="mb-4 h-8 w-32" />
						<div className="grid gap-4 md:grid-cols-3">
							{Array.from({ length: 3 }).map((_, idx) => (
								<div key={`resource-${idx}`} className="space-y-2">
									<Skeleton className="mb-2 h-5 w-24" />
									{Array.from({ length: 3 }).map((_, linkIdx) => (
										<Skeleton key={`resource-link-${linkIdx}`} className="h-10 w-full" />
									))}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
