"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FilterSidebar, {
  FilterState,
} from "@/components/products/filter-sidebar";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/products/products-skeletons";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useProductsParams } from "@/hooks/use-products-params";
import { usePaginationItems } from "@/hooks/use-pagination";
import {
  ProductFrequency,
  ProductProtocol,
  ProductVoltage,
} from "@/sanity.types";
import {
  CategoryType,
  ProductType,
} from "../home-widgets/featured-products-section";
import { Skeleton } from "@/components/ui/skeleton";
import PagesHero from "../pages-hero";
import Link from "next/link";
import { ResolvedMediaAsset } from "@/sanity/lib/utils";

const sortOptions = [
  { label: "Top Selling", value: "top-selling-asc" },
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
  { label: "SKU (A-Z)", value: "sku-asc" },
  { label: "SKU (Z-A)", value: "sku-desc" },
];

const emptyFilters: FilterState = {
  category: "",
  voltages: [],
  frequencies: [],
  protocols: [],
};

type ProductsWrapperProps = {
  products: ProductType[];
  total: number;
  page: number;
  pageSize: number;
  initialFilters: FilterState;
  initialSearch: string;
  initialSort: string;
  categories: CategoryType[];
  frequencies: ProductFrequency[];
  protocols: ProductProtocol[];
  voltages: ProductVoltage[];
  heroTitle: string;
  heroDescription: string;
  backgroundImage?: ResolvedMediaAsset | null;
};

export default function ProductsWrapper(props: ProductsWrapperProps) {
  const {
    products,
    total,
    page,
    pageSize,
    initialFilters,
    initialSearch,
    initialSort,
    categories,
    frequencies,
    protocols,
    voltages,
    heroTitle,
    heroDescription,
    backgroundImage,
  } = props;

  const { applyParams, isPending } = useProductsParams();

  const [filters, setFilters] = useState(initialFilters);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [selectedSort, setSelectedSort] = useState(initialSort);

  // Create a stable key to detect filter changes
  const filtersKey = useMemo(
    () =>
      JSON.stringify({
        ...initialFilters,
        voltages: [...initialFilters.voltages].sort(),
        frequencies: [...initialFilters.frequencies].sort(),
        protocols: [...initialFilters.protocols].sort(),
      }),
    [initialFilters]
  );

  // Sync incoming props when filters key changes
  useEffect(() => {
    setFilters(initialFilters);
  }, [filtersKey, initialFilters]);

  useEffect(() => setSearchInput(initialSearch), [initialSearch]);
  useEffect(() => setSelectedSort(initialSort), [initialSort]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paginationItems = usePaginationItems(page, totalPages);
  const currentSortLabel =
    sortOptions.find((o) => o.value === selectedSort)?.label ?? "Sort";

  // Actions
  const updateFilters = (next: FilterState) => {
    setFilters(next);
    applyParams({ ...next, page: "1" });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyParams({ search: searchInput.trim(), page: "1" });
  };

  const handleResetSearch = () => {
    setSearchInput("");
    applyParams({ search: "", page: "1" });
  };

  const handleSort = (s: string) => {
    setSelectedSort(s);
    applyParams({ sort: s, page: "1" });
  };

  const handlePageClick = (nextPage: number) =>
    applyParams({ page: String(nextPage) });

  const displayStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const displayEnd = total === 0 ? 0 : displayStart + products.length - 1;

  return (
    <div className="pb-20">
      {/* --- HEADER + SEARCH --- */}
      <PagesHero backgroundImageUrl={backgroundImage?.url}>
        <div className="flex items-center gap-2 text-sm text-primary mb-4">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Icon icon="lucide:chevron-right" className="size-4" />
          <Link
            href="/products"
            className="hover:text-white transition-colors"
            onClick={(e) => {
              if (filters.category) {
                e.preventDefault();
                updateFilters({ ...filters, category: "" });
              }
            }}
          >
            All Products
          </Link>
          {filters.category && (
            <>
              <Icon icon="lucide:chevron-right" className="size-4" />
              <span className="underline text-white">
                {categories.find((c) => c.slug === filters.category)?.title}
              </span>
            </>
          )}
        </div>
        <h1 className="page-title">
          {filters.category
            ? categories.find((c) => c.slug === filters.category)?.title
            : heroTitle}
        </h1>
        <p>
          {categories.find((c) => c.slug === filters.category)?.description ??
            heroDescription}
        </p>
        <form
          onSubmit={handleSearch}
          className="mt-4 flex w-full h-14 border rounded-md bg-background"
        >
          <input
            className="grow px-4 outline-none text-foreground"
            value={searchInput}
            type="search"
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter SKU or product name..."
            disabled={isPending}
          />
          {/* <button disabled={!searchInput.trim()} onClick={handleResetSearch}>
							<Icon icon="lucide:x" className="size-4" />
						</button> */}
          <button
            className="h-full rounded-r-md bg-primary text-foreground px-4"
            disabled={isPending}
          >
            <Icon icon="lucide:search" className="size-4" />
          </button>
        </form>
      </PagesHero>
      <div className="container mx-auto px-4 pt-10 flex gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-auto">
            <FilterSidebar
              filters={filters}
              categories={categories}
              frequencies={frequencies}
              protocols={protocols}
              voltages={voltages}
              handleReset={() => updateFilters(emptyFilters)}
              onFiltersChange={updateFilters}
            />
          </div>
        </aside>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          {/* Mobile Filters + Sort */}
          <div className="flex justify-between items-center mb-6 gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Icon icon="lucide:filter" className="size-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-80 p-4">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>

                <div className="overflow-auto">
                  <FilterSidebar
                    filters={filters}
                    categories={categories}
                    frequencies={frequencies}
                    protocols={protocols}
                    voltages={voltages}
                    handleReset={() => updateFilters(emptyFilters)}
                    onFiltersChange={updateFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Icon icon="lucide:arrow-up-down" className="size-4" />
                  {currentSortLabel}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleSort(option.value)}
                    className={cn(
                      selectedSort === option.value && "bg-primary/10"
                    )}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mb-6">
            {isPending ? (
              <Skeleton className="h-4 w-40 bg-muted/60" />
            ) : (
              <p className="text-sm text-muted-foreground">
                Showing {displayStart}-{displayEnd} of {total} products
              </p>
            )}
          </div>

          {isPending ? (
            <ProductGridSkeleton cards={pageSize} />
          ) : products.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.slug ?? product._id}
                  id={product?.slug ?? ""}
                  name={product?.title ?? ""}
                  sku={product?.sku ?? undefined}
                  image={product.image}
                  topSelling={product.topSelling ?? undefined}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No products found
            </div>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-10 justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => handlePageClick(page - 1)}
                    className={cn(
                      page <= 1 && "opacity-50 pointer-events-none"
                    )}
                  />
                </PaginationItem>

                {paginationItems.map((item, i) => (
                  <PaginationItem key={i}>
                    {item === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={item === page}
                        onClick={() => handlePageClick(Number(item))}
                      >
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => handlePageClick(page + 1)}
                    className={cn(
                      page >= totalPages && "opacity-50 pointer-events-none"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
