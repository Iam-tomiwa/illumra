"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";
import {
	CategoryQueryResult,
	FeaturedProductsQueryResult,
} from "@/sanity.types";

export type ProductType = NonNullable<
	NonNullable<FeaturedProductsQueryResult>[number]
>;

export type CategoryType = NonNullable<
	NonNullable<CategoryQueryResult>[number]
>;

export function FeaturedProductsSection({
	products = [],
	categories = [],
}: {
	products: ProductType[];
	categories: CategoryType[];
}) {
	const [selectedCategory, setSelectedCategory] = useState("all-products");

	console.log(products.map(p => p.category));
	const filteredProducts =
		selectedCategory === "all-products"
			? products
			: products.filter(p => p.category === selectedCategory);

	return (
		<section className="pt-20 pb-10 bg-background">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
					<div className="flex-1">
						<h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
							Featured Products
						</h2>
						<div className="flex flex-wrap gap-3">
							{[{ slug: "all-products", title: "All Products" }, ...categories].map(
								category => (
									<button
										key={category.slug}
										onClick={() => setSelectedCategory(category.slug ?? "")}
										className={cn(
											"px-4 py-2 min-w-max rounded-full text-sm font-medium transition-all",
											selectedCategory === category.slug
												? "bg-[#fbce03]"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200"
										)}
									>
										{category.title}
									</button>
								)
							)}
						</div>
					</div>
					<div className="shrink-0">
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
					</div>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6">
					{filteredProducts.map(product => (
						<ProductCard
							key={product.slug}
							id={product.slug ?? ""}
							name={product.title ?? ""}
							sku={product.sku ?? ""}
							image={product.image}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
