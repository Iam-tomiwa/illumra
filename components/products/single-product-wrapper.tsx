"use client";
import React, { useState } from "react";
import { PortableTextBlock } from "next-sanity";
import Link from "next/link";
import {
	normalizeNulls,
	ResolvedMediaAsset,
	resolveMediaAsset,
} from "@/sanity/lib/utils";
import PortableText from "@/components/portable-text";
import { ProductImageSlider } from "@/components/products/product-image-slider";
import { ProductSpecifications } from "@/components/products/product-specifications";
import {
	ProductResources,
	ResourceLinkType,
} from "@/components/products/product-resources";
import { Icon } from "@iconify/react";
import { MediaAsset, PRODUCT_QUERYResult } from "@/sanity.types";
import { Button } from "../ui/button";
import GetQuoteModal from "../get-quote-modal";

export default function SingleProductWrapper({
	product,
}: {
	product: NonNullable<PRODUCT_QUERYResult>;
}) {
	const normalizedProduct = normalizeNulls(product);
	const resolvedImages =
		(normalizedProduct.images
			?.map(img =>
				resolveMediaAsset({
					...(img as MediaAsset),
					_type: "mediaAsset",
				})
			)
			.filter(Boolean) as ResolvedMediaAsset[]) ?? [];

	const [open, setOpen] = useState(false);

	return (
		<div className="min-h-screen bg-background">
			{/* Breadcrumb */}
			<div className="pt-10">
				<div className="container mx-auto px-4">
					<nav className="flex flex-wrap items-center gap-2 text-muted-foreground">
						<Link href="/" className="hover:text-foreground transition-colors">
							Home
						</Link>
						<Icon icon="lucide:chevron-right" className="size-4" />
						<Link
							href="/products"
							className="hover:text-foreground transition-colors"
						>
							Products
						</Link>
						{normalizedProduct.category && (
							<>
								<Icon icon="lucide:chevron-right" className="size-4" />
								<Link
									href={`/products?category=${normalizedProduct.category.slug}`}
									className="hover:text-foreground transition-colors"
								>
									{normalizedProduct.category.title}
								</Link>
							</>
						)}
						<Icon icon="lucide:chevron-right" className="size-4" />
						<span className="text-foreground">{normalizedProduct.title}</span>
					</nav>
				</div>
			</div>

			<div className="container mx-auto px-4 py-12">
				<div className="flex flex-col lg:flex-row gap-12 mb-16">
					{/* Image Slider */}
					<ProductImageSlider images={resolvedImages} />

					{/* Product Details */}
					<div className="space-y-8">
						<div className="flex items-start justify-between gap-8">
							<div className="flex-1">
								<h1 className="text-4xl md:text-5xl font-bold mb-2">
									{normalizedProduct.title}
								</h1>
								{normalizedProduct.sku && (
									<p className="text-muted-foreground font-mono text-sm mt-2 mb-4">
										SKU: {normalizedProduct.sku}
									</p>
								)}
								{normalizedProduct.body && normalizedProduct.body.length && (
									<PortableText value={normalizedProduct.body as PortableTextBlock[]} />
								)}
							</div>
						</div>

						{/* Key Features */}
						<div>
							<h2 className="text-2xl font-semibold mb-4">Key Features</h2>
							<div className="space-y-3">
								{normalizedProduct.category && (
									<div className="flex items-center gap-3">
										<Icon icon="lucide:tag" className="size-5 text-primary shrink-0" />
										<div>
											<span className="text-sm text-muted-foreground">Category:</span>
											<span className="ml-2 font-medium">
												{normalizedProduct.category.title}
											</span>
										</div>
									</div>
								)}
								{normalizedProduct.voltage && (
									<div className="flex items-center gap-3">
										<Icon icon="lucide:zap" className="size-5 text-primary shrink-0" />
										<div>
											<span className="text-sm text-muted-foreground">Voltage:</span>
											<span className="ml-2 font-medium">
												{normalizedProduct.voltage.label}
											</span>
										</div>
									</div>
								)}
								{normalizedProduct.frequency && (
									<div className="flex items-center gap-3">
										<Icon icon="lucide:radio" className="size-5 text-primary shrink-0" />
										<div>
											<span className="text-sm text-muted-foreground">Frequency:</span>
											<span className="ml-2 font-medium">
												{normalizedProduct.frequency.label}
											</span>
										</div>
									</div>
								)}
								{normalizedProduct.protocols &&
									normalizedProduct.protocols.length > 0 && (
										<div className="flex items-center gap-3">
											<Icon
												icon="lucide:network"
												className="size-5 text-primary shrink-0"
											/>
											<div>
												<span className="text-sm text-muted-foreground">Protocols:</span>
												<span className="ml-2 font-medium">
													{normalizedProduct.protocols
														.map((p: { label?: string | null }) => p.label)
														.join(", ")}
												</span>
											</div>
										</div>
									)}
							</div>
						</div>

						<Button className="w-full" onClick={() => setOpen(true)}>
							<Icon icon="lucide:contact" className="size-4" /> Get A Quote
						</Button>
					</div>
				</div>

				<div>
					{/* Specifications */}
					{normalizedProduct.specifications &&
						normalizedProduct.specifications.length > 0 && (
							<div className="mb-8">
								<h2 className="text-2xl font-semibold mb-4">Specifications</h2>
								<ProductSpecifications
									specifications={normalizedProduct.specifications ?? []}
								/>
							</div>
						)}

					{/* Resources */}
					<div>
						<h2 className="text-2xl font-semibold mb-4">Resources</h2>
						<ProductResources
							downloads={normalizedProduct.downloads as ResourceLinkType[]}
							applications={normalizedProduct.applications ?? []}
							wiringDiagrams={normalizedProduct.wiringDiagrams as ResourceLinkType[]}
						/>
					</div>
				</div>
				<GetQuoteModal
					productId={normalizedProduct._id}
					open={open}
					setOpen={setOpen}
				/>
			</div>
		</div>
	);
}
