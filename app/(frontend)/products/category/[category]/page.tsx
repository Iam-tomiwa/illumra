import ProductsWrapper from "@/components/products/products-wrapper";
import { FilterState } from "@/components/products/filter-sidebar";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  FILTERED_PRODUCTS_COUNT_QUERY,
  categoryQuery,
  productFrequencyQuery,
  productProtocolQuery,
  productVoltageQuery,
  productsPageQuery,
  productsQuery,
  settingsQuery,
} from "@/sanity/lib/queries";
import type {
  CategoryType,
  ProductType,
} from "@/components/home-widgets/featured-products-section";
import type {
  MediaAsset,
  ProductFrequency,
  ProductProtocol,
  ProductVoltage,
} from "@/sanity.types";
import {
  cleanString,
  resolveMediaAsset,
  seoToMetadata,
} from "@/sanity/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildFilterParams, PAGE_SIZE } from "../../_utils";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateStaticParams() {
  const categories = await sanityFetch({
    query: categoryQuery,
    perspective: "published",
    stega: false,
  });

  if (!Array.isArray(categories)) {
    return [];
  }

  return categories
    .filter((cat) => cat?.slug)
    .map((cat) => ({
      category: cleanString(cat.slug) || "",
    }))
    .filter((p) => p.category);
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const [categories, settings] = await Promise.all([
    sanityFetch({
      query: categoryQuery,
      revalidate: 3600,
    }),
    sanityFetch({
      query: settingsQuery,
      revalidate: 3600,
    }),
  ]);

  const category = Array.isArray(categories)
    ? categories.find(
        (cat) => cleanString(cat?.slug) === cleanString(categorySlug)
      )
    : null;

  if (!category) {
    return {};
  }

  const metadata = seoToMetadata(settings?.seo);

  const categoryTitle = category.title || "Products";
  const categoryDescription =
    category.description ||
    `Browse ${categoryTitle} products from ILLUMRA. Wireless lighting control solutions.`;

  return {
    ...metadata,
    title: `${categoryTitle} | ILLUMRA Products`,
    description: categoryDescription,
    openGraph: {
      ...metadata.openGraph,
      title: `${categoryTitle} | ILLUMRA Products`,
      description: categoryDescription,
    },
    twitter: {
      ...metadata.twitter,
      title: `${categoryTitle} | ILLUMRA Products`,
      description: categoryDescription,
    },
  } satisfies Metadata;
}

export default async function CategoryProductsPage(props: CategoryPageProps) {
  const { category: categorySlug } = await props.params;
  const searchParams = (await props.searchParams) ?? {};

  const {
    search,
    searchWildcard,
    category,
    voltages: voltagesFilter,
    frequencies: frequenciesFilter,
    protocols: protocolsFilter,
    sort,
    page,
    offset,
    end,
  } = buildFilterParams(searchParams, categorySlug);

  // Verify category exists
  const [categories] = await Promise.all([
    sanityFetch({ query: categoryQuery, revalidate: 3600 }),
  ]);

  const categoryData = Array.isArray(categories)
    ? categories.find(
        (cat) => cleanString(cat?.slug) === cleanString(categorySlug)
      )
    : null;

  if (!categoryData) {
    return notFound();
  }

  const sortMap: Record<string, string> = {
    "top-selling-asc": `select(topSelling == "yes" => 1, 0) desc, title asc`,
    "name-asc": "title asc",
    "name-desc": "title desc",
    "sku-asc": "sku asc",
    "sku-desc": "sku desc",
  };

  const orderClause = sortMap[sort] || sortMap["top-selling-asc"];

  const FILTERED_PRODUCTS_QUERY = `
		*[
			_type == "product" &&
			(!defined($search) || $search == "" || coalesce(title, "") match $searchWildcard || coalesce(sku, "") match $searchWildcard) &&
			(!defined($category) || $category == "" || count((categories[]->slug.current)[@ == $category]) > 0) &&
			(!defined($voltages) || count($voltages) == 0 || voltage->value in $voltages) &&
			(!defined($frequencies) || count($frequencies) == 0 || frequency->value in $frequencies) &&
			(!defined($protocols) || count($protocols) == 0 || count((protocols[]->value)[@ in $protocols]) > 0)
		]
		| order(${orderClause})
		[$offset...$end]{
			${productsQuery}
		}
	`;

  const [
    products,
    total,
    productsPageData,
    allCategories,
    frequencyOptions,
    protocolOptions,
    voltageOptions,
  ] = await Promise.all([
    sanityFetch({
      query: FILTERED_PRODUCTS_QUERY,
      params: {
        search,
        searchWildcard,
        category,
        voltages: voltagesFilter,
        frequencies: frequenciesFilter,
        protocols: protocolsFilter,
        offset,
        end,
      },
    }),
    sanityFetch({
      query: FILTERED_PRODUCTS_COUNT_QUERY,
      params: {
        search,
        searchWildcard,
        category,
        voltages: voltagesFilter,
        frequencies: frequenciesFilter,
        protocols: protocolsFilter,
      },
    }),
    sanityFetch({ query: productsPageQuery, revalidate: 3600 }),
    sanityFetch({ query: categoryQuery }),
    sanityFetch({ query: productFrequencyQuery }),
    sanityFetch({ query: productProtocolQuery }),
    sanityFetch({ query: productVoltageQuery }),
  ]);

  const productsList = Array.isArray(products)
    ? (products.filter(Boolean) as ProductType[])
    : [];

  const totalCount = typeof total === "number" ? total : 0;

  const categoryOptions = Array.isArray(allCategories)
    ? (allCategories.filter(Boolean) as CategoryType[])
    : [];

  const frequencyOptionsList = Array.isArray(frequencyOptions)
    ? (frequencyOptions.filter(Boolean) as ProductFrequency[])
    : [];

  const protocolOptionsList = Array.isArray(protocolOptions)
    ? (protocolOptions.filter(Boolean) as ProductProtocol[])
    : [];

  const voltageOptionsList = Array.isArray(voltageOptions)
    ? (voltageOptions.filter(Boolean) as ProductVoltage[])
    : [];

  const initialFilters: FilterState = {
    category,
    voltages: voltagesFilter,
    frequencies: frequenciesFilter,
    protocols: protocolsFilter,
  };

  // Resolve background image for hero section
  const backgroundImage = productsPageData?.backgroundImage
    ? resolveMediaAsset(
        {
          ...(productsPageData.backgroundImage as MediaAsset),
          _type: "mediaAsset",
        },
        {
          width: 1920,
          height: 1080,
          fit: "crop",
        }
      )
    : undefined;

  return (
    <ProductsWrapper
      heroTitle={productsPageData?.title || "All Products"}
      heroDescription={productsPageData?.description || ""}
      backgroundImage={backgroundImage}
      products={productsList}
      total={totalCount}
      page={page}
      pageSize={PAGE_SIZE}
      initialFilters={initialFilters}
      initialSearch={search}
      initialSort={sort}
      categories={categoryOptions.sort(
        (a, b) => a?.title?.localeCompare(b?.title ?? "") ?? 0
      )}
      frequencies={frequencyOptionsList.sort(
        (a, b) => a?.value?.localeCompare(b?.value ?? "") ?? 0
      )}
      protocols={protocolOptionsList.sort(
        (a, b) => a?.value?.localeCompare(b?.value ?? "") ?? 0
      )}
      voltages={voltageOptionsList.sort(
        (a, b) => a?.value?.localeCompare(b?.value ?? "") ?? 0
      )}
    />
  );
}
