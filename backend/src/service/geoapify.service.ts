import fetch from "node-fetch";

const GEOAPIFY_KEY = process.env.GEOAPIFY_API_KEY!;

// ==================== TYPES =====================
interface GeoapifyPlace {
    place_id?: string;
    properties: {
        lat: number;
        lon: number;
        formatted: string;
        categories: string[];
        name?: string;
        place_id?: string;
        datasource?: {
            raw?: {
                wikimedia_commons?: string;
            }
        }
    }
}

interface GeoapifyPlacesResponse {
    features: GeoapifyPlace[];
}

// ==================== GEOAPIFY PLACE SEARCH =====================
export async function searchPlaceGeoapify(name: string): Promise<GeoapifyPlace | null> {
    const url = "https://api.geoapify.com/v1/geocode/search?" + new URLSearchParams({
        text: name,
        apiKey: GEOAPIFY_KEY,
        limit: "1",
        lang: "vi",
        type: "amenity",
    });

    const res = await fetch(url);
    if (!res.ok) {
        const body = await res.text();
        console.warn("Geoapify geocode HTTP error:", res.status, body);
        return null;
    }
    const json = (await res.json()) as GeoapifyPlacesResponse;

    if (!json.features || json.features.length === 0) {
        console.log("❌ Không tìm thấy địa điểm:", name);
        return null;
    }

    const place = json.features[0];
    if (place.place_id) {
        console.log(`[DEBUG] Found Place ID: ${place.place_id}`);
    }

    return place;
}

// ==================== GEOAPIFY PLACE DETAILS =====================
export async function getPlaceDetailsGeoapify(placeId: string): Promise<GeoapifyPlace | null> {
    const url = `https://api.geoapify.com/v2/place-details?id=${placeId}&apiKey=${GEOAPIFY_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
        const body = await res.text();
        console.warn("Geoapify details HTTP error:", res.status, body);
        return null;
    }
    const json = (await res.json()) as GeoapifyPlacesResponse;

    return json.features?.[0] ?? null;
}

export type { GeoapifyPlace };
