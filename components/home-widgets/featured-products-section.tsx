"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import {
	CategoryQueryResult,
	FeaturedProductsQueryResult,
} from "@/sanity.types";
import { AnimatedElement } from "@/components/animated-element";

export type ProductType = NonNullable<
	NonNullable<FeaturedProductsQueryResult>[number]
>;

export type CategoryType = NonNullable<
	NonNullable<CategoryQueryResult>[number]
>;

export function FeaturedProductsSection({
	products = [],
}: {
	products: ProductType[];
}) {
	const [selectedCategory, setSelectedCategory] = useState("all-products");

	const filteredProducts =
		selectedCategory === "all-products"
			? products
			: products.filter(p => p.category === selectedCategory);

	return (
		<section className="pt-20 pb-10 bg-background">
			<div className="container mx-auto px-4">
				<div className="flex flex-wrap items-center justify-between gap-6 mb-12">
						<AnimatedElement delay={0.1}>
							<h2 className="text-4xl md:text-5xl font-bold tracking-tight">
								Featured Products
							</h2>
						</AnimatedElement>
					<div className="shrink-0">
						<AnimatedElement delay={0.2}>
							<Button
								asChild
								variant="outline"
								className="rounded-full hover:bg-[#fbce03]"
							>
								<Link href="/products" className="flex items-center gap-2">
									<span>See All Products</span>
									<Icon icon="solar:arrow-right-bold" className="size-4" />
								</Link>
							</Button>
						</AnimatedElement>
					</div>
				</div>

				<AnimatedElement>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
						{filteredProducts.map((product) => (
							<ProductCard
								key={product.slug}
								id={product.slug ?? ""}
								name={product.title ?? ""}
								sku={product.sku ?? ""}
								image={product.image}
								topSelling={product.topSelling ?? undefined}
							/>
						))}
					</div>
				</AnimatedElement>
			</div>
		</section>
	);
}
