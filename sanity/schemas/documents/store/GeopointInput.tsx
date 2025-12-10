"use client";

import { useCallback, useState } from "react";
import { set, unset, useFormValue, type ObjectInputProps } from "sanity";
import { Button, Card, Flex, Stack, Text, TextInput, useToast } from "@sanity/ui";
import { EarthGlobeIcon, SyncIcon } from "@sanity/icons";

type GeopointValue = {
	_type: "geopoint";
	lat?: number;
	lng?: number;
	alt?: number;
};

export function GeopointInput(props: ObjectInputProps<GeopointValue>) {
	const { value, onChange } = props;
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();

	// Use useFormValue to access sibling field values from the document
	const address = useFormValue(["address"]) as string | undefined;
	const city = useFormValue(["city"]) as string | undefined;
	const state = useFormValue(["state"]) as string | undefined;
	const zipCode = useFormValue(["zipCode"]) as string | undefined;
	const country = useFormValue(["country"]) as string | undefined;

	const handleGeocodeFromAddress = useCallback(async () => {
		if (!city || !country) {
			toast.push({
				status: "warning",
				title: "Missing address",
				description: "Please fill in at least the city and country fields first.",
			});
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/geocode", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					address,
					city,
					state,
					zipCode,
					country,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to geocode address");
			}

			onChange(
				set({
					_type: "geopoint",
					lat: data.lat,
					lng: data.lng,
				})
			);

			toast.push({
				status: "success",
				title: "Coordinates found",
				description: `Lat: ${data.lat.toFixed(6)}, Lng: ${data.lng.toFixed(6)}`,
			});
		} catch (error) {
			toast.push({
				status: "error",
				title: "Geocoding failed",
				description: error instanceof Error ? error.message : "Could not find coordinates for this address",
			});
		} finally {
			setIsLoading(false);
		}
	}, [address, city, state, zipCode, country, onChange, toast]);

	const handleLatChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const lat = parseFloat(event.target.value);
			if (isNaN(lat)) {
				if (!value?.lng) {
					onChange(unset());
				}
				return;
			}
			onChange(
				set({
					_type: "geopoint",
					lat,
					lng: value?.lng ?? 0,
				})
			);
		},
		[onChange, value]
	);

	const handleLngChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const lng = parseFloat(event.target.value);
			if (isNaN(lng)) {
				if (!value?.lat) {
					onChange(unset());
				}
				return;
			}
			onChange(
				set({
					_type: "geopoint",
					lat: value?.lat ?? 0,
					lng,
				})
			);
		},
		[onChange, value]
	);

	const handleClear = useCallback(() => {
		onChange(unset());
	}, [onChange]);

	return (
		<Stack space={3}>
			<Card padding={3} radius={2} shadow={1} tone="primary">
				<Flex align="center" gap={3}>
					<EarthGlobeIcon />
					<Stack space={2} flex={1}>
						<Text size={1} weight="semibold">
							Auto-fill from address
						</Text>
						<Text size={1} muted>
							Click the button to automatically get coordinates from the address fields above.
						</Text>
					</Stack>
					<Button
						icon={SyncIcon}
						text={isLoading ? "Finding..." : "Get Coordinates"}
						tone="primary"
						onClick={handleGeocodeFromAddress}
						disabled={isLoading}
					/>
				</Flex>
			</Card>

			<Flex gap={3}>
				<Stack space={2} flex={1}>
					<Text size={1} weight="semibold">
						Latitude
					</Text>
					<TextInput
						type="number"
						step="any"
						value={value?.lat ?? ""}
						onChange={handleLatChange}
						placeholder="e.g., 40.7128"
					/>
				</Stack>
				<Stack space={2} flex={1}>
					<Text size={1} weight="semibold">
						Longitude
					</Text>
					<TextInput
						type="number"
						step="any"
						value={value?.lng ?? ""}
						onChange={handleLngChange}
						placeholder="e.g., -74.0060"
					/>
				</Stack>
			</Flex>

			{value?.lat && value?.lng && (
				<Flex justify="space-between" align="center">
					<Text size={1} muted>
						<a
							href={`https://www.google.com/maps?q=${value.lat},${value.lng}`}
							target="_blank"
							rel="noopener noreferrer"
							style={{ color: "inherit", textDecoration: "underline" }}
						>
							View on Google Maps ↗
						</a>
					</Text>
					<Button text="Clear" mode="ghost" tone="critical" onClick={handleClear} />
				</Flex>
			)}
		</Stack>
	);
}
