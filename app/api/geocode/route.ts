import { type NextRequest, NextResponse } from "next/server";

// Use LocationIQ for accurate geocoding (5,000 free requests/day)
// Sign up at https://locationiq.com/ and add LOCATIONIQ_API_KEY to your env
async function geocodeWithLocationIQ(fullAddress: string) {
	const apiKey = process.env.LOCATIONIQ_API_KEY;
	if (!apiKey) return null;

	try {
		const response = await fetch(
			`https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(fullAddress)}&format=json&limit=1`,
			{ headers: { Accept: "application/json" } }
		);
 console.log("location iq")
		if (!response.ok) return null;

		const data = await response.json();
		if (data && data.length > 0) {
			return {
				lat: parseFloat(data[0].lat),
				lng: parseFloat(data[0].lon),
				displayName: data[0].display_name,
			};
		}
	} catch {
		return null;
	}
	return null;
}

// Fallback to Nominatim (less accurate, but free without API key)
async function geocodeWithNominatim(fullAddress: string) {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`,
			{
				headers: {
					"User-Agent": "IllumraStoreLocator/1.0 (contact@illumra.com)",
					Accept: "application/json",
				},
			}
		);
		console.log("nominatim")


		if (!response.ok) return null;

		const data = await response.json();
		if (data && data.length > 0) {
			return {
				lat: parseFloat(data[0].lat),
				lng: parseFloat(data[0].lon),
				displayName: data[0].display_name,
			};
		}
	} catch {
		return null;
	}
	return null;
}

export async function POST(req: NextRequest) {
	try {
		const { address, city, state, zipCode, country } = await req.json();

		if (!city || !country) {
			return NextResponse.json(
				{ error: "City and country are required" },
				{ status: 400 }
			);
		}

		// Try different address combinations for better results
		const addressVariants = [
			[address, city, state, zipCode, country],
			[address, city, state, country],
			[city, state, country],
		];

		for (const variant of addressVariants) {
			const fullAddress = variant.filter(Boolean).join(", ");

			// Try LocationIQ first (more accurate)
			const locationIQResult = await geocodeWithLocationIQ(fullAddress);
			if (locationIQResult) {
				return NextResponse.json(locationIQResult);
			}

			// Fallback to Nominatim
			const nominatimResult = await geocodeWithNominatim(fullAddress);
			if (nominatimResult) {
				return NextResponse.json(nominatimResult);
			}
		}

		return NextResponse.json(
			{ error: "Could not find coordinates for this address. Try simplifying the address or enter coordinates manually." },
			{ status: 404 }
		);
	} catch (error) {
		console.error("Geocoding error:", error);
		return NextResponse.json(
			{ error: "Failed to geocode address" },
			{ status: 500 }
		);
	}
}
