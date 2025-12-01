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
import { cleanString } from "@/sanity/lib/utils";

const PAGE_SIZE = 12;
const DEFAULT_SORT = "name-asc";
const SORT_VALUES = new Set(["name-asc", "name-desc", "sku-asc", "sku-desc"]);

type ProductsPageProps = {
	searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const getParam = (value: string | string[] | undefined): string => {
	if (Array.isArray(value)) {
		return value[0] ?? "";
	}

	return value ?? "";
};

const getProtocolsParam = (value: string | string[] | undefined): string[] => {
	if (Array.isArray(value)) {
		return value
			.map(protocol => cleanString(protocol))
			.filter((protocol): protocol is string => protocol !== "");
	}

	if (value === undefined || value === null) {
		return [];
	}

	const sanitized = cleanString(value);
	return sanitized !== "" ? [sanitized] : [];
};

const buildSearchWildcard = (search: string): string => {
	const cleaned = cleanString(search);
	if (!cleaned) {
		return "";
	}

	return `*${cleaned.replace(/\s+/g, "*")}*`;
};

export default async function ProductsPage(props: ProductsPageProps) {
	const searchParams = (await props.searchParams) ?? {};

	const searchParam = cleanString(getParam(searchParams.search));
	const categoryParam = cleanString(getParam(searchParams.category));
	const voltageParam = cleanString(getParam(searchParams.voltage));
	const frequencyParam = cleanString(getParam(searchParams.frequency));
	const sortParam = cleanString(getParam(searchParams.sort));
	const protocolsParam = getProtocolsParam(searchParams.protocol);
	// Debug: uncomment to see what's being parsed
	// console.log("Raw protocol param:", searchParams.protocol);
	// console.log("Parsed protocols:", protocolsParam);
	const sort = SORT_VALUES.has(sortParam) ? sortParam : DEFAULT_SORT;

	const pageParam = cleanString(getParam(searchParams.page));
	const parsedPage = Number.parseInt(pageParam || "1", 10);
	const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

	const search = searchParam;
	const searchWildcard = buildSearchWildcard(search);

	const offset = (page - 1) * PAGE_SIZE;
	const end = offset + PAGE_SIZE;

	const sharedParams = {
		search,
		searchWildcard,
		category: categoryParam,
		voltage: voltageParam,
		frequency: frequencyParam,
		protocols: protocolsParam,
	};

	const sortMap: Record<string, string> = {
		"name-asc": "title asc",
		"name-desc": "title desc",
		"sku-asc": "sku asc",
		"sku-desc": "sku desc",
	};

	const orderClause = sortMap[sort] || "title asc";

	const FILTERED_PRODUCTS_QUERY = `
		*[
			_type == "product" &&
			(!defined($search) || $search == "" || coalesce(title, "") match $searchWildcard || coalesce(sku, "") match $searchWildcard) &&
			(!defined($category) || $category == "" || count((categories[]->slug.current)[@ == $category]) > 0) &&
			(!defined($voltage) || $voltage == "" || voltage->value == $voltage) &&
			(!defined($frequency) || $frequency == "" || frequency->value == $frequency) &&
			(!defined($protocols) || count($protocols) == 0 || count((protocols[]->value)[@ in $protocols]) > 0)
		]
		[$offset...$end]
		| order(${orderClause})
		{
			${productsQuery}
		}
	`;

	const [products, total, categories, frequencies, protocols, voltages] =
		await Promise.all([
			sanityFetch({
				query: FILTERED_PRODUCTS_QUERY,
				params: {
					...sharedParams,
					sort,
					offset,
					end,
				},
			}),
			sanityFetch({
				query: FILTERED_PRODUCTS_COUNT_QUERY,
				params: sharedParams,
			}),
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

	const frequencyOptions = Array.isArray(frequencies)
		? (frequencies.filter(Boolean) as ProductFrequency[])
		: [];

	const protocolOptions = Array.isArray(protocols)
		? (protocols.filter(Boolean) as ProductProtocol[])
		: [];

	const voltageOptions = Array.isArray(voltages)
		? (voltages.filter(Boolean) as ProductVoltage[])
		: [];

	const initialFilters: FilterState = {
		category: categoryParam,
		voltage: voltageParam,
		frequency: frequencyParam,
		protocols: protocolsParam,
	};

	return (
		<ProductsWrapper
			products={productsList}
			total={totalCount}
			page={page}
			pageSize={PAGE_SIZE}
			initialFilters={initialFilters}
			initialSearch={search}
			initialSort={sort}
			categories={categoryOptions}
			frequencies={frequencyOptions}
			protocols={protocolOptions}
			voltages={voltageOptions}
		/>
	);
}
