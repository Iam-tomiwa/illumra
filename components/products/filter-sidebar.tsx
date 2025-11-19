import { Button } from "@/components/ui/button";
import ComboBox from "@/components/ui/combo-box-2";
import { CategoryType } from "../home-widgets/featured-products-section";
import {
	ProductFrequency,
	ProductProtocol,
	ProductVoltage,
} from "@/sanity.types";
import { cleanString } from "@/sanity/lib/utils";

export type FilterState = {
	category: string;
	voltage: string;
	frequency: string;
	protocols: string[];
};

// Filter Sidebar Component
export default function FilterSidebar({
	filters,
	handleReset,
	categories,
	frequencies,
	protocols,
	voltages,
	onFiltersChange,
}: {
	filters: FilterState;
	handleReset: () => void;
	categories: CategoryType[];
	frequencies: ProductFrequency[];
	protocols: ProductProtocol[];
	voltages: ProductVoltage[];
	onFiltersChange: (next: FilterState) => void;
}) {
	const toggleProtocol = (protocol: string) => {
		if (!protocol) {
			return;
		}

		const cleanProtocol = cleanString(protocol);
		const nextProtocols = filters.protocols.includes(cleanProtocol)
			? filters.protocols.filter(p => p !== cleanProtocol)
			: [...filters.protocols, cleanProtocol];

		onFiltersChange({ ...filters, protocols: nextProtocols });
	};

	const categoryOptions = [
		{ _id: "all-categories", slug: "", title: "All Categories" },
		...categories.map(category => ({
			...category,
			slug: cleanString(category.slug),
			title: cleanString(category.title) || category.title,
		})),
	];

	const voltageOptions = [
		{ _id: "all-voltages", value: "", label: "All Voltages" },
		...voltages.map(voltage => ({
			...voltage,
			value: cleanString(voltage.value),
			label: cleanString(voltage.label) || voltage.label,
		})),
	];

	const frequencyOptions = [
		{ _id: "all-frequencies", value: "", label: "All Frequencies" },
		...frequencies.map(frequency => ({
			...frequency,
			value: cleanString(frequency.value),
			label: cleanString(frequency.label) || frequency.label,
		})),
	];

	const protocolOptions = protocols.map(protocol => ({
		...protocol,
		value: cleanString(protocol.value),
		label: cleanString(protocol.label) || protocol.label,
	}));

	return (
		<div className="space-y-6">
			{/* Search Bar */}

			{/* Category Filter */}
			<div>
				<label className="block text-sm font-medium mb-2">Category</label>
				<div className="space-y-2">
					{categoryOptions.map((category, i) => {
						const slug = cleanString(category.slug);
						return (
							<label
								key={category._id ?? `category-${i}`}
								className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 p-2 rounded-md"
							>
								<input
									type="radio"
									name="category"
									checked={filters.category === slug}
									className="w-4 h-4"
									onChange={() =>
										onFiltersChange({ ...filters, category: cleanString(slug) })
									}
								/>
								<span className="text-sm">{cleanString(category.title) || ""}</span>
							</label>
						);
					})}
				</div>
			</div>

			{/* Voltage Filter */}
			<div>
				<label className="block text-sm font-medium mb-2">Voltage</label>
				<ComboBox
					options={voltageOptions.map((voltage, index) => ({
						label: cleanString(voltage.label),
						value: cleanString(voltage.value),
						id: voltage._id ?? `voltage-${index}`,
					}))}
					showSearch={false}
					className="w-full h-10"
					value={filters.voltage}
					onValueChange={value =>
						onFiltersChange({ ...filters, voltage: cleanString(value) })
					}
				/>
			</div>

			{/* Frequency Filter */}
			<div>
				<label className="block text-sm font-medium mb-2">Frequency</label>
				<ComboBox
					options={frequencyOptions.map((frequency, index) => ({
						label: cleanString(frequency.label),
						value: cleanString(frequency.value),
						id: frequency._id ?? `frequency-${index}`,
					}))}
					showSearch={false}
					className="w-full h-10"
					value={filters.frequency}
					onValueChange={value =>
						onFiltersChange({ ...filters, frequency: cleanString(value) })
					}
				/>
			</div>

			{/* Protocol Checkboxes */}
			<div>
				<label className="block text-sm font-medium mb-2">Protocols</label>
				<div className="space-y-2">
					{protocolOptions.map((protocol, index) => {
						const value = cleanString(protocol.value);
						return (
							<label
								key={protocol._id ?? `protocol-${index}`}
								className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 p-2 rounded-md"
							>
								<input
									type="checkbox"
									checked={value !== "" && filters.protocols.includes(value)}
									onChange={() => toggleProtocol(value)}
									className="w-4 h-4 rounded border-gray-300"
								/>
								<span className="text-sm">{cleanString(protocol.label) || ""}</span>
							</label>
						);
					})}
				</div>
			</div>

			{/* Reset Button */}
			<Button variant="outline" onClick={handleReset} className="w-full">
				Reset Filters
			</Button>
		</div>
	);
}
