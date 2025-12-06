"use client";

import { Map, Marker, Overlay, ZoomControl } from "pigeon-maps";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {type StoreWithCoords, storeTypeColors, storeTypeLabels } from "./store-locator";
import { cn } from "@/lib/utils";

type StoreMapProps = {
	stores: StoreWithCoords[];
	selectedStore: StoreWithCoords | null;
	onSelectStore: (store: StoreWithCoords | null) => void;
	userLocation: { lat: number; lng: number } | null;
};



export default function StoreMap({
	stores,
	selectedStore,
	onSelectStore,
	userLocation,
}: StoreMapProps) {
	// Filter stores that have coordinates
	const storesWithCoords = stores.filter(store => store.coords !== null);

	// Calculate center based on stores or user location
	const getCenter = (): [number, number] => {
		if (selectedStore?.coords) {
			return [selectedStore.coords.lat, selectedStore.coords.lng];
		}
		if (userLocation) {
			return [userLocation.lat, userLocation.lng];
		}
		if (storesWithCoords.length > 0) {
			const avgLat =
				storesWithCoords.reduce((sum, s) => sum + (s.coords?.lat || 0), 0) /
				storesWithCoords.length;
			const avgLng =
				storesWithCoords.reduce((sum, s) => sum + (s.coords?.lng || 0), 0) /
				storesWithCoords.length;
			return [avgLat, avgLng];
		}
		// Default to USA center
		return [39.8283, -98.5795];
	};

	const openInMaps = (store: StoreWithCoords) => {
		const query = encodeURIComponent(
			`${store.address}, ${store.city}, ${store.state || ""} ${store.zipCode || ""}, ${store.country}`
		);
		window.open(
			`https://www.google.com/maps/search/?query=${query}`,
			"_blank"
		);
	};

	return (
		<div className="relative w-full h-full">
			<Map
				center={getCenter()}
				zoom={selectedStore?.coords ? 14 : userLocation ? 10 : 5}
				animate={true}
			>
				<ZoomControl />

				{/* User location marker */}
				{userLocation && (
					<Marker
						anchor={[userLocation.lat, userLocation.lng]}
						color={storeTypeColors.user}
					/>
				)}

				{/* Store markers */}
				{storesWithCoords.map(store => (
					<Marker
						key={store._id}
						anchor={[store.coords!.lat, store.coords!.lng]}
						color={storeTypeColors[store.storeType]}
						onClick={() => onSelectStore(store)}
					/>
				))}

				{/* Selected store popup */}
				{selectedStore?.coords && (
					<Overlay
						anchor={[selectedStore.coords.lat, selectedStore.coords.lng]}
						offset={[0, -40]}
					>
						<div className="bg-background rounded-lg shadow-lg p-4 min-w-[280px] max-w-[320px] border">
							<button
								onClick={() => onSelectStore(null)}
								className="absolute top-2 right-2 p-1 hover:bg-muted rounded"
							>
								<Icon icon="lucide:x" className="size-4" />
							</button>

							<div className="flex items-center gap-2 mb-2">
								<span
									className="inline-block size-3 rounded-full"
									style={{
										backgroundColor: storeTypeColors[selectedStore.storeType],
									}}
								/>
								<span className="text-xs font-medium text-muted-foreground">
									{storeTypeLabels[selectedStore.storeType]}
								</span>
							</div>

							<h3 className="font-bold text-lg mb-2">{selectedStore.name}</h3>

							<div className="space-y-2 text-sm">
								<div className="flex items-start gap-2">
									<Icon
										icon="lucide:map-pin"
										className="size-4 text-muted-foreground mt-0.5 shrink-0"
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
									</div>
								</div>

								{selectedStore.phone && (
									<div className="flex items-center gap-2">
										<Icon
											icon="lucide:phone"
											className="size-4 text-muted-foreground shrink-0"
										/>
										<a
											href={`tel:${selectedStore.phone}`}
											className="text-primary hover:underline"
										>
											{selectedStore.phone}
										</a>
									</div>
								)}

								{selectedStore.website && (
									<div className="flex items-center gap-2">
										<Icon
											icon="lucide:globe"
											className="size-4 text-muted-foreground shrink-0"
										/>
										<a
											href={selectedStore.website}
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary hover:underline truncate"
										>
											Website
										</a>
									</div>
								)}
							</div>

							<Button
								size="sm"
								className="w-full mt-3"
								onClick={() => openInMaps(selectedStore)}
							>
								<Icon icon="lucide:navigation" className="size-4 mr-2" />
								Get Directions
							</Button>
						</div>
					</Overlay>
				)}
			</Map>

			{/* Legend */}
			<div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur rounded-lg p-3 shadow-lg text-xs">
				<p className="font-medium mb-2">Legend</p>
				<div className="space-y-1">
					{Object.entries(storeTypeLabels).map(([key, label]) => (
						<div key={key} className="flex items-center gap-2">
							<span
								className={cn("inline-block size-3 rounded-full")}
								style={{ backgroundColor: storeTypeColors[key] }}
							/>
							<span>{label}</span>
						</div>
					))}
					{userLocation && (
						<div className="flex items-center gap-2">
							<span
								className="inline-block size-3 rounded-full"
								style={{ backgroundColor: storeTypeColors.user }}
							/>
							<span>Your Location</span>
						</div>
					)}
				</div>
			</div>

			{/* Store count */}
			<div className="absolute top-4 left-4 bg-background/90 backdrop-blur rounded-lg px-3 py-2 shadow-lg text-sm">
				{storesWithCoords.length} locations on map
			</div>
		</div>
	);
}
