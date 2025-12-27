"use client";
import React, { useState } from "react";
import { PortableTextBlock } from "next-sanity";
import Link from "next/link";
import {
	cleanString,
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
import { MediaAsset, PRODUCT_QUERYResult, ProductColor } from "@/sanity.types";
import { Button } from "../ui/button";
import GetQuoteModal from "../get-quote-modal";
import { ProductCard } from "../product-card";
import { ProductType } from "../home-widgets/featured-products-section";
import { toast } from "sonner";

export default function SingleProductWrapper({
	product,
	relevantProducts = [],
}: {
	product: NonNullable<PRODUCT_QUERYResult>;
	relevantProducts?: ProductType[];
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

	// Access colors directly from product to preserve type
	const productColors = product.colors;

	const [open, setOpen] = useState(false);
	const [selectedColor, setSelectedColor] = useState<ProductColor | undefined>(
		undefined
	);

	const handleShare = async () => {
		const productUrl = `${window.location.origin}/products/${normalizedProduct.slug}`;
		const shareData = {
			title: normalizedProduct.title || "Product",
			text: `Check out ${normalizedProduct.title}${normalizedProduct.sku ? ` (SKU: ${normalizedProduct.sku})` : ""}`,
			url: productUrl,
			image: resolvedImages[0]?.url,
		};

		// Check if Web Share API is supported
		if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
			try {
				await navigator.share(shareData);
				toast.success("Shared successfully!");
			} catch (error) {
				// User cancelled or error occurred
				if ((error as Error).name !== "AbortError") {
					// Fallback to copy if share fails
					await copyToClipboard(productUrl);
				}
			}
		} else {
			// Fallback to copying to clipboard
			await copyToClipboard(productUrl);
		}
	};

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success("Product link copied to clipboard!");
		} catch (error) {
			// Fallback for older browsers
			const textArea = document.createElement("textarea");
			textArea.value = text;
			textArea.style.position = "fixed";
			textArea.style.opacity = "0";
			document.body.appendChild(textArea);
			textArea.select();
			try {
				document.execCommand("copy");
				toast.success("Product link copied to clipboard!");
			} catch (err) {
				toast.error("Failed to copy link");
			}
			document.body.removeChild(textArea);
		}
	};

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
									href={`/products/category/${normalizedProduct.category.slug}`}
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
					<div className="relative md:max-w-[45%]">
						<ProductImageSlider
							images={resolvedImages}
							videos={normalizedProduct.videos}
						/>
						<Button
							variant="outline"
							onClick={handleShare}
							size="icon"
							className="shrink-0 absolute top-4 right-4 z-10"
							aria-label="Share product aspect-square"
						>
							<Icon icon="lucide:share-2" className="size-4" />
						</Button>
					</div>

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
								{normalizedProduct.categories &&
									normalizedProduct.categories.length > 0 && (
										<div className="flex items-center gap-3">
											<Icon icon="lucide:tag" className="size-5 text-primary shrink-0" />
											<div>
												<span className="text-sm text-muted-foreground">Categories:</span>
												<span className="ml-2 font-medium">
													{normalizedProduct.categories
														.map(category => category.title)
														.join(", ")}
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

						{/* Color Variants */}
						{productColors && productColors.length > 0 && (
							<div>
								<h2 className="text-2xl font-semibold mb-4">
									Select From Available Colors
								</h2>
								<div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
									{productColors.map((color, index: number) => {
										const hex = cleanString(color.hex);
										const name = cleanString(color.name);
										return (
											<div
												key={index}
												className={`flex flex-col items-center gap-2 p-3 rounded-lg border border-border/70 bg-card  transition-colors cursor-pointer ${
													selectedColor?.name === color.name &&
													selectedColor?.partNumber === color.partNumber
														? "border-primary"
														: ""
												}`}
												onClick={() => setSelectedColor(color as ProductColor)}
											>
												<div
													className="w-16 h-16 rounded-md border-2 border-border shadow-sm"
													style={{
														backgroundColor: hex ? hex : name ? name : "#000000",
													}}
													aria-label={color.name || "Color swatch"}
												/>
												<div className="text-center">
													<p className="text-sm font-medium text-foreground">
														{color.name || "Unnamed"}
													</p>
													{color.partNumber && (
														<p className="text-xs text-muted-foreground font-mono mt-1">
															{color.partNumber}
														</p>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}

						<div className="flex gap-3">
							<Button className="flex-1" onClick={() => setOpen(true)}>
								<Icon icon="lucide:contact" className="size-4" /> Get A Quote
							</Button>
						</div>
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
					productSlug={normalizedProduct.slug}
					productTitle={normalizedProduct.title}
					productColors={productColors}
					productSku={normalizedProduct.sku}
					selectedColor={selectedColor}
					open={open}
					setOpen={setOpen}
				/>

				{/* Relevant Products */}
				{relevantProducts.length > 0 && (
					<div className="mt-16">
						<h2 className="text-2xl font-semibold mb-6">Relevant Products</h2>
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
							{relevantProducts.map(product => {
								return (
									<ProductCard
										key={product?.slug}
										id={product?._id}
										name={product?.title ?? ""}
										sku={product?.sku ?? undefined}
										image={product?.image}
										detailsUrl={`/products/${product?.slug}`}
									/>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
