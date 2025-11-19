export const usePaginationItems = (page: number, totalPages: number) => {
	const items = new Set([1, totalPages]);

	for (let i = page - 1; i <= page + 1; i++) {
		if (i >= 1 && i <= totalPages) items.add(i);
	}

	const sorted = [...items].sort((a, b) => a - b);
	const output = [];

	for (let i = 0; i < sorted.length; i++) {
		if (i > 0 && sorted[i] - sorted[i - 1] > 1) output.push("ellipsis");
		output.push(sorted[i]);
	}

	return output;
};
