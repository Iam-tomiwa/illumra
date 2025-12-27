import { cleanString } from "@/sanity/lib/utils";

export const PAGE_SIZE = 20;
export const DEFAULT_SORT = "name-asc";
export const SORT_VALUES = new Set([
  "name-asc",
  "name-desc",
  "sku-asc",
  "sku-desc",
]);

export const getParam = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
};

export const getArrayParam = (
  value: string | string[] | undefined
): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((v) => cleanString(v))
      .filter((v): v is string => v !== "");
  }

  if (value === undefined || value === null) {
    return [];
  }

  const sanitized = cleanString(value);
  return sanitized !== "" ? [sanitized] : [];
};

export const buildSearchWildcard = (search: string): string => {
  const cleaned = cleanString(search);
  if (!cleaned) {
    return "";
  }
  return `*${cleaned.replace(/\s+/g, "*")}*`;
};

export const buildFilterParams = (
  searchParams: Record<string, string | string[] | undefined>,
  categorySlug?: string
) => {
  const searchParam = cleanString(getParam(searchParams.search));
  const categoryParam =
    categorySlug || cleanString(getParam(searchParams.category));
  const voltagesParam = getArrayParam(searchParams.voltages);
  const frequenciesParam = getArrayParam(searchParams.frequencies);
  const sortParam = cleanString(getParam(searchParams.sort));
  const protocolsParam = getArrayParam(searchParams.protocols);
  const sort = SORT_VALUES.has(sortParam) ? sortParam : DEFAULT_SORT;

  const pageParam = cleanString(getParam(searchParams.page));
  const parsedPage = Number.parseInt(pageParam || "1", 10);
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const search = searchParam;
  const searchWildcard = buildSearchWildcard(search);

  const offset = (page - 1) * PAGE_SIZE;
  const end = offset + PAGE_SIZE;

  return {
    search,
    searchWildcard,
    category: categoryParam,
    voltages: voltagesParam,
    frequencies: frequenciesParam,
    protocols: protocolsParam,
    sort,
    page,
    offset,
    end,
  };
};
