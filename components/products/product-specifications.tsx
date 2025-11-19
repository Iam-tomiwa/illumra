import type { SpecificationEntry } from "@/sanity.types";

type ProductSpecificationsProps = {
	specifications: SpecificationEntry[] | null | undefined;
};

export function ProductSpecifications({
	specifications,
}: ProductSpecificationsProps) {
	if (!specifications || specifications.length === 0) {
		return null;
	}

	return (
		<div className="border rounded-lg overflow-hidden">
			<table className="w-full">
				<tbody>
					{specifications.map((spec, index) => (
						<tr
							key={index}
							className="border-b last:border-b-0 hover:bg-muted/50 transition-colors"
						>
							<td className="px-4 py-3 font-semibold text-sm w-1/3 bg-muted/30">
								{spec.label || "—"}
							</td>
							<td className="px-4 py-3 text-sm">{spec.value || "—"}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
