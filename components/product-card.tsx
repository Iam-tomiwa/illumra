"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "./ui/button-group";
import { resolveMediaAsset } from "@/sanity/lib/utils";
import { FeaturedProductsQueryResult, MediaAsset } from "@/sanity.types";

export interface ProductCardProps {
  id: string;
  name: string;
  image: FeaturedProductsQueryResult[number]["image"];
  sku?: string;
  datasheetUrl?: string;
  installationGuideUrl?: string;
  detailsUrl?: string;
  showActions?: boolean;
}

export function ProductCard({
  id,
  name,
  image,
  sku,
  detailsUrl = `/products/${id}`,
}: ProductCardProps) {
  const imageResolved = resolveMediaAsset({
    ...(image as MediaAsset),
    _type: "mediaAsset",
  });

  return (
    <div className="bg-white rounded-lg border hover:border-primary transition-shadow p-4 flex flex-col">
      {/* Product Image */}
      <Link
        href={detailsUrl}
        className="relative aspect-square w-full mb-4 bg-gray-50 rounded-lg overflow-hidden"
      >
        <Image
          src={imageResolved?.url ?? "/images/product-placeholder.png"}
          alt={imageResolved?.alt ?? name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>

      {/* Product Name */}
      <h3 className="text-sm font-semibold text-[#565856] mb-2 line-clamp-2 flex-1">
        {name}
      </h3>

      {/* SKU if provided */}
      {sku && <p className="text-xs text-muted-foreground font-mono">{sku}</p>}

      <ButtonGroup className="w-full mt-4">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="grow rounded-full border-primary text-xs hover:bg-[#fbce03]"
        >
          <Link href={detailsUrl}>View Details</Link>
        </Button>
      </ButtonGroup>
    </div>
  );
}
