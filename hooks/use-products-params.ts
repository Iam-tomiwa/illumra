import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useProductsParams() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const applyParams = useCallback(
		(updates: Record<string, any>) => {
			const params = new URLSearchParams(searchParams.toString());

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

			const query = params.toString();

			startTransition(() => {
				router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
			});
		},
		[searchParams, pathname, router]
	);

	return { applyParams, isPending, startTransition };
}
