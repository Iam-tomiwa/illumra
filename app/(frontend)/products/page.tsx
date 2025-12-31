import ProductsWrapper from "@/components/products/products-wrapper";
import { FilterState } from "@/components/products/filter-sidebar";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  FILTERED_PRODUCTS_COUNT_QUERY,
  categoryQuery,
  productFrequencyQuery,
  productProtocolQuery,
  productVoltageQuery,
  productsQuery,
  productsPageQuery,
  settingsQuery,
} from "@/sanity/lib/queries";
import type {
  CategoryType,
  ProductType,
} from "@/components/home-widgets/featured-products-section";
import type {
  ProductFrequency,
  ProductProtocol,
  ProductVoltage,
} from "@/sanity.types";
import { mergeSeo, resolveMediaAsset, seoToMetadata } from "@/sanity/lib/utils";
import { Metadata } from "next";
import { buildFilterParams, PAGE_SIZE } from "./_utils";
import type { MediaAsset } from "@/sanity.types";

type ProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const [productsPage, settings] = await Promise.all([
    sanityFetch({
      query: productsPageQuery,
      revalidate: 3600,
    }),
    sanityFetch({
      query: settingsQuery,
      revalidate: 3600,
    }),
  ]);

  // Merge products page SEO with settings SEO
  const mergedSeo = mergeSeo(productsPage?.seo, settings?.seo);
  const metadata = seoToMetadata(mergedSeo);

  return {
    ...metadata,
    title: productsPage?.seo?.title
      ? {
          template:
            productsPage.seo.titleTemplate ||
            mergedSeo?.titleTemplate ||
            "%s | Illumra",
          default: productsPage.seo.title,
        }
      : "Wireless Lighting Control Products | Switches, Sensors, Controllers",
    description:
      productsPage?.seo?.description ||
      productsPage?.description ||
      "Browse ILLUMRA's complete line of self-powered wireless switches, occupancy sensors, and controllers. EnOcean, ZigBee & Bluetooth compatible.",
  } satisfies Metadata;
}

export default async function ProductsPage(props: ProductsPageProps) {
  const searchParams = (await props.searchParams) ?? {};

  const {
    search,
    searchWildcard,
    category,
    voltages,
    frequencies,
    protocols,
    sort,
    page,
    offset,
    end,
  } = buildFilterParams(searchParams);

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
    categories,
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
        voltages,
        frequencies,
        protocols,
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
        voltages,
        frequencies,
        protocols,
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

  const categoryOptions = Array.isArray(categories)
    ? (categories.filter(Boolean) as CategoryType[])
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
    category: "",
    voltages,
    frequencies,
    protocols,
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
    <div className="min-h-screen bg-background">
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
    </div>
  );
}
