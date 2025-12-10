"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sanitizeSanityStrings } from "@/sanity/lib/utils";

// Dynamically import the map component with SSR disabled
const StoreMap = dynamic(() => import("./store-map"), {
	ssr: false,
	loading: () => (
		<div className="w-full h-full flex items-center justify-center bg-muted/30">
			<Icon icon="lucide:loader-2" className="size-8 animate-spin text-muted-foreground" />
		</div>
	),
});

export type StoreInput = {
	_id: string;
	name: string;
	storeType: "distributor" | "rep" | "retailer";
	address: string;
	city: string;
	state: string | null;
	zipCode: string | null;
	country: string;
	phone: string | null;
	email: string | null;
	website: string | null;
	location: {
		lat: number;
		lng: number;
	} | null;
};

export type StoreWithCoords = StoreInput & {
	coords: { lat: number; lng: number } | null;
};

type StoreLocatorProps = {
	stores: StoreInput[];
};

export const storeTypeLabels: Record<string, string> = {
	distributor: "Distributor",
	rep: "Sales Rep",
	retailer: "Retailer",
};

export const storeTypeColors: Record<string, string> = {
	distributor: "#fdc700",
	rep: "#00c950",
	retailer: "#ad46ff",
	user: "#fb2c36",
};

function haversineDistance(
	lat1: number,
	lng1: number,
	lat2: number,
	lng2: number
): number {
	const R = 3959; // Earth's radius in miles
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLng = ((lng2 - lng1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

// Geocode an address using our API route (uses LocationIQ with Nominatim fallback)
async function geocodeAddress(
	address: string,
	city: string,
	state: string | null,
	zipCode: string | null,
	country: string
): Promise<{ lat: number; lng: number } | null> {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		const response = await fetch("/api/geocode", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ address, city, state, zipCode, country }),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) return null;

		const data = await response.json();
		if (data?.lat && data?.lng) {
			return { lat: data.lat, lng: data.lng };
		}
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			console.warn("Geocoding request timed out");
		}
	}

	return null;
}

type ViewMode = "list" | "map";

export default function StoreLocator({ stores }: StoreLocatorProps) {
	const [viewMode, setViewMode] = useState<ViewMode>("map");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStore, setSelectedStore] = useState<StoreWithCoords | null>(null);
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [filterType, setFilterType] = useState<string>("all");
	const [isLocating, setIsLocating] = useState(false);
	const [geocodedStores, setGeocodedStores] = useState<StoreWithCoords[]>([]);
	const [isGeocoding, setIsGeocoding] = useState(true);

	// Geocode stores without coordinates on mount
	useEffect(() => {
		let isCancelled = false;

		const geocodeStores = async () => {
			setIsGeocoding(true);

			const results: StoreWithCoords[] = [];
			let needsGeocoding = 0;

			// First pass: use existing coordinates and count stores needing geocoding
			for (const rawStore of stores) {
				const store = sanitizeSanityStrings(rawStore);

				if (store.location?.lat && store.location?.lng) {
					results.push({ ...store, coords: store.location });
				} else {
					results.push({ ...store, coords: null });
					needsGeocoding++;
				}
			}

			// Update state immediately with stores that have coordinates
			if (!isCancelled) {
				setGeocodedStores([...results]);
			}

			// If no stores need geocoding, we're done
			if (needsGeocoding === 0) {
				setIsGeocoding(false);
				return;
			}

			// Second pass: geocode stores without coordinates sequentially
			for (let i = 0; i < results.length; i++) {
				if (isCancelled) break;

				const store = results[i];
				if (store.coords) continue; // Already has coordinates

				// Wait 1.1 seconds between requests to respect Nominatim rate limits
				await new Promise(resolve => setTimeout(resolve, 1100));

				if (isCancelled) break;

				const coords = await geocodeAddress(
					store.address,
					store.city,
					store.state,
					store.zipCode,
					store.country
				);

				if (!isCancelled && coords) {
					results[i] = { ...store, coords };
					setGeocodedStores([...results]);
				}
			}

			if (!isCancelled) {
				setIsGeocoding(false);
			}
		};

		if (stores.length > 0) {
			geocodeStores();
		} else {
			setIsGeocoding(false);
		}

		return () => {
			isCancelled = true;
		};
	}, [stores]);

	const filteredStores = useMemo(() => {
		let result = geocodedStores;

		// Filter by type
		if (filterType !== "all") {
			result = result.filter(store => store.storeType === filterType);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				store =>
					store.name.toLowerCase().includes(query) ||
					store.city.toLowerCase().includes(query) ||
					store.state?.toLowerCase().includes(query) ||
					store.zipCode?.toLowerCase().includes(query) ||
					store.country.toLowerCase().includes(query)
			);
		}

		// Sort by distance if user location is available
		if (userLocation) {
			result = [...result].sort((a, b) => {
				if (!a.coords) return 1;
				if (!b.coords) return -1;

				const distA = haversineDistance(
					userLocation.lat,
					userLocation.lng,
					a.coords.lat,
					a.coords.lng
				);
				const distB = haversineDistance(
					userLocation.lat,
					userLocation.lng,
					b.coords.lat,
					b.coords.lng
				);
				return distA - distB;
			});
		}

		return result;
	}, [geocodedStores, searchQuery, filterType, userLocation]);

	const handleLocateMe = () => {
		if (!navigator.geolocation) {
			alert("Geolocation is not supported by your browser");
			return;
		}

		setIsLocating(true);
		navigator.geolocation.getCurrentPosition(
			position => {
				setUserLocation({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
				setIsLocating(false);
			},
			() => {
				alert("Unable to retrieve your location");
				setIsLocating(false);
			}
		);
	};

	const getDistance = (store: StoreWithCoords): string | null => {
		if (!userLocation || !store.coords) return null;
		const distance = haversineDistance(
			userLocation.lat,
			userLocation.lng,
			store.coords.lat,
			store.coords.lng
		);
		return `${distance.toFixed(1)} mi`;
	};

	const openInMaps = (store: StoreWithCoords) => {
		const query = encodeURIComponent(
			`${store.address}, ${store.city}, ${store.state || ""} ${store.zipCode || ""}, ${store.country}`
		);
		window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
	};

	return (
		<div className="bg-background rounded-xl shadow-lg overflow-hidden">
			{/* Search, Filters, and View Toggle */}
			<div className="p-4 border-b space-y-4">
				<div className="flex gap-2">
					<div className="relative flex-1">
						<Icon
							icon="lucide:search"
							className="absolute left-3 top-5 -translate-y-1/2 size-4 text-muted-foreground"
						/>
						<Input
							type="text"
							placeholder="Search by city, state, or ZIP code..."
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Button
						variant="outline"
						onClick={handleLocateMe}
						disabled={isLocating || isGeocoding}
						className="shrink-0 h-10"
					>
						<Icon
							icon={isLocating ? "lucide:loader-2" : "lucide:locate"}
							className={cn("size-4", isLocating && "animate-spin")}
						/>
						<span className="hidden sm:inline">
							{isLocating ? "Locating..." : "Near Me"}
						</span>
					</Button>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-4">
					{/* Type Filters */}
					<div className="flex flex-wrap gap-2">
						{[
							{ value: "all", label: "All" },
							{ value: "distributor", label: "Distributors" },
							{ value: "rep", label: "Sales Reps" },
							{ value: "retailer", label: "Retailers" },
						].map(type => (
							<Button
								key={type.value}
								variant={filterType === type.value ? "default" : "outline"}
								size="sm"
								onClick={() => setFilterType(type.value)}
							>
								{type.label}
							</Button>
						))}
					</div>

					{/* View Toggle */}
					<div className="flex rounded-lg border p-1 bg-muted/30">
						<button
							onClick={() => setViewMode("map")}
							className={cn(
								"flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
								viewMode === "map"
									? "bg-background shadow-sm text-foreground"
									: "text-muted-foreground hover:text-foreground"
							)}
						>
							<Icon icon="lucide:map" className="size-4" />
							Map
						</button>
						<button
							onClick={() => setViewMode("list")}
							className={cn(
								"flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
								viewMode === "list"
									? "bg-background shadow-sm text-foreground"
									: "text-muted-foreground hover:text-foreground"
							)}
						>
							<Icon icon="lucide:list" className="size-4" />
							List
						</button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="h-[600px]">
				{isGeocoding ? (
					<div className="w-full h-full flex items-center justify-center bg-muted/30">
						<div className="text-center">
							<Icon
								icon="lucide:loader-2"
								className="size-12 mx-auto mb-4 animate-spin text-muted-foreground"
							/>
							<p className="text-muted-foreground">Loading store locations...</p>
						</div>
					</div>
				) : (
					<div className="flex flex-col lg:flex-row h-full">
						{/* Store List - Always visible */}
						<div className="w-full lg:w-80 h-1/2 lg:h-full overflow-auto border-b lg:border-b-0 lg:border-r shrink-0">
							{filteredStores.length === 0 ? (
								<div className="p-8 text-center text-muted-foreground">
									<Icon icon="lucide:map-pin-off" className="size-12 mx-auto mb-4 opacity-50" />
									<p>No stores found matching your criteria.</p>
								</div>
							) : (
								<ul className="divide-y">
									{filteredStores.map(store => (
										<li
											key={store._id}
											className={cn(
												"p-4 cursor-pointer transition-colors hover:bg-accent/50",
												selectedStore?._id === store._id && "bg-accent"
											)}
											onClick={() => setSelectedStore(store)}
										>
											<div className="flex items-start justify-between gap-2">
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-1">
														<span
															className={cn(
																"inline-block size-2 rounded-full"
															)}
															style={{ backgroundColor: storeTypeColors[store.storeType] }}

														/>
														<h3 className="font-semibold truncate">{store.name}</h3>
													</div>
													<p className="text-sm text-muted-foreground">
														{store.address}
													</p>
													<p className="text-sm text-muted-foreground">
														{[store.city, store.state, store.zipCode]
															.filter(Boolean)
															.join(", ")}
													</p>
													<p className="text-xs text-muted-foreground mt-1">
														{storeTypeLabels[store.storeType]}
													</p>
												</div>
												{userLocation && store.coords && (
													<span className="text-sm font-medium text-primary shrink-0">
														{getDistance(store)}
													</span>
												)}
											</div>
										</li>
									))}
								</ul>
							)}
						</div>

						{/* Right Panel - Map or Details based on view mode */}
						{viewMode === "map" ? (
							<div className="flex-1 h-1/2 lg:h-full">
								<StoreMap
									stores={filteredStores}
									selectedStore={selectedStore}
									onSelectStore={setSelectedStore}
									userLocation={userLocation}
								/>
							</div>
						) : (
							<div className="flex-1 h-1/2 lg:h-full bg-muted/30 relative">
								{selectedStore ? (
									<div className="absolute inset-0 p-6 overflow-auto">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setSelectedStore(null)}
											className="mb-4"
										>
											<Icon icon="lucide:arrow-left" className="size-4 mr-2" />
											Back to list
										</Button>

									<div className="bg-background rounded-lg p-6 shadow-sm">
										<div className="flex items-center gap-2 mb-2">
											<span
												className={cn(
													"inline-block size-3 rounded-full"
												)}
												style={{ backgroundColor: storeTypeColors[selectedStore.storeType] }}
											/>
											<span className="text-sm font-medium text-muted-foreground">
												{storeTypeLabels[selectedStore.storeType]}
											</span>
										</div>

										<h2 className="text-2xl font-bold mb-4">{selectedStore.name}</h2>

										<div className="space-y-4">
											{/* Address */}
											<div className="flex items-start gap-3">
												<Icon
													icon="lucide:map-pin"
													className="size-5 text-muted-foreground mt-0.5"
												/>
												<div>
													<p>{selectedStore.address}</p>
													<p>
														{[
															selectedStore.city,
															selectedStore.state,
															selectedStore.zipCode,
														]
															.filter(Boolean)
															.join(", ")}
													</p>
													<p>{selectedStore.country}</p>
												</div>
											</div>

											{/* Phone */}
											{selectedStore.phone && (
												<div className="flex items-center gap-3">
													<Icon
														icon="lucide:phone"
														className="size-5 text-muted-foreground"
													/>
													<a
														href={`tel:${selectedStore.phone}`}
														className="text-primary hover:underline"
													>
														{selectedStore.phone}
													</a>
												</div>
											)}

											{/* Email */}
											{selectedStore.email && (
												<div className="flex items-center gap-3">
													<Icon
														icon="lucide:mail"
														className="size-5 text-muted-foreground"
													/>
													<a
														href={`mailto:${selectedStore.email}`}
														className="text-primary hover:underline"
													>
														{selectedStore.email}
													</a>
												</div>
											)}

											{/* Website */}
											{selectedStore.website && (
												<div className="flex items-center gap-3">
													<Icon
														icon="lucide:globe"
														className="size-5 text-muted-foreground"
													/>
													<a
														href={selectedStore.website}
														target="_blank"
														rel="noopener noreferrer"
														className="text-primary hover:underline"
													>
														Visit Website
													</a>
												</div>
											)}

											{/* Distance */}
											{userLocation && selectedStore.coords && (
												<div className="flex items-center gap-3">
													<Icon
														icon="lucide:navigation"
														className="size-5 text-muted-foreground"
													/>
													<span>{getDistance(selectedStore)} away</span>
												</div>
											)}
										</div>

										<Button
											className="w-full mt-6"
											onClick={() => openInMaps(selectedStore)}
										>
											<Icon icon="lucide:external-link" className="size-4 mr-2" />
											Get Directions
										</Button>
									</div>
								</div>
							) : (
								<div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
									<div className="text-center p-8">
										<Icon
											icon="lucide:map"
											className="size-16 mx-auto mb-4 opacity-30"
										/>
										<p className="text-lg font-medium mb-2">
											Select a store to view details
										</p>
										<p className="text-sm">
											Click on a store from the list to see contact information and
											get directions.
										</p>
									</div>
								</div>
							)}
						</div>
						)}
					</div>
				)}
			</div>

			{/* Results count */}
			<div className="p-3 border-t bg-muted/30 text-sm text-muted-foreground">
				{isGeocoding ? (
					"Loading locations..."
				) : (
					<>Showing {filteredStores.length} of {stores.length} locations</>
				)}
			</div>
		</div>
	);
}
