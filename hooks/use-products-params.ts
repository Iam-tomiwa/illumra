import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useProductsParams() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Check if we're on a category page (/products/category/[category])
	const isCategoryPage = pathname?.startsWith("/products/category/");
	const currentCategory = isCategoryPage 
		? pathname.replace("/products/category/", "").split("/")[0]
		: null;

	const applyParams = useCallback(
		(updates: Record<string, any>) => {
			const params = new URLSearchParams(searchParams.toString());

			// Handle category separately - it changes the path
			let category = currentCategory || "";
			if ("category" in updates) {
				category = updates.category || "";
				delete updates.category;
			}

			// Handle other params as query strings
			Object.entries(updates).forEach(([key, value]) => {
				if (value === undefined) return;

				if (value === "" || value === null) {
					params.delete(key);
				} else if (Array.isArray(value)) {
					params.delete(key);
					value.forEach(item => params.append(key, item));
				} else {
					params.set(key, value);
				}
			});

			// Build the new path
			const basePath = category ? `/products/category/${category}` : "/products";
			const query = params.toString();
			const newPath = query ? `${basePath}?${query}` : basePath;

			startTransition(() => {
				router.push(newPath, { scroll: false });
			});
		},
		[searchParams, pathname, router, currentCategory]
	);

	return { applyParams, isPending, startTransition };
}
