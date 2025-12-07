import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

const GOOGLE_KEY = process.env.GOOGLE_API_KEY!;
const SUPABASE_URL = env.supabaseUrl
const SUPABASE_SERVICE_ROLE = env.supabaseServiceRoleKey

// Supabase client (dùng service role, để bypass RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// ==================== TYPES =====================
interface GoogleTextSearchResult {
    place_id: string;
    name: string;
}
interface GoogleTextSearchResponse {
    results?: GoogleTextSearchResult[];
}

interface GooglePhotoRef {
    photo_reference: string;
}
interface GoogleDetailsGeometry {
    location: { lat: number; lng: number };
}
interface GoogleDetailsResult {
    name: string;
    rating?: number;
    user_ratings_total?: number;
    geometry: GoogleDetailsGeometry;
    photos?: GooglePhotoRef[];
    types?: string[];
    formatted_address?: string;
}
interface GoogleDetailsResponse {
    result: GoogleDetailsResult;
}

interface WikiSummary {
    extract?: string;
}

// ==================== GOOGLE PLACES =====================
async function searchPlace(name: string) {
    // Prefer Find Place from Text; add language/region for Vietnamese names
    const url =
        "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
        encodeURIComponent(name) +
        "&inputtype=textquery&language=vi&region=vn&fields=place_id,name" +
        "&key=" +
        GOOGLE_KEY;

    const res = await fetch(url);
    const json = (await res.json()) as unknown as {
        candidates?: GoogleTextSearchResult[];
        status?: string;
        error_message?: string;
    };

    if (json.status !== "OK") {
        console.warn("Google Find Place status:", json.status, json.error_message ?? "");
    }

    return json.candidates?.[0];
}

async function getPlaceDetails(placeId: string) {
    const url =
        "https://maps.googleapis.com/maps/api/place/details/json?place_id=" +
        placeId +
        "&key=" +
        GOOGLE_KEY +
        "&fields=name,rating,user_ratings_total,geometry,photos,types,formatted_address";

    const res = await fetch(url);
    const data = (await res.json()) as unknown as GoogleDetailsResponse;
    return data.result;
}

function getGooglePhotos(photoRefs?: GooglePhotoRef[]) {
    if (!photoRefs) return [];

    return photoRefs.slice(0, 8).map((p: GooglePhotoRef) => {
        return (
            "https://maps.googleapis.com/maps/api/place/photo" +
            `?maxwidth=1200&photo_reference=${p.photo_reference}&key=${GOOGLE_KEY}`
        );
    });
}

// ==================== WIKIPEDIA =====================
async function getWikiSummary(name: string) {
    const title = name.replace(/\s+/g, "_");

    const url =
        "https://en.wikipedia.org/api/rest_v1/page/summary/" +
        encodeURIComponent(title);

    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as unknown as WikiSummary;
}

// ==================== BUILD OBJECT =====================
async function buildPlaceData(name: string) {
    const search = await searchPlace(name);
    if (!search) {
        console.log("❌ Không tìm thấy:", name);
        return null;
    }

    const details = await getPlaceDetails(search.place_id);
    const wiki = await getWikiSummary(name);

    const data = {
        name: details.name,
        slug: details.name.toLowerCase().replace(/\s+/g, "-"),
        location: details.formatted_address ?? "",
        image: getGooglePhotos(details.photos),
        rating: details.rating ?? null,
        categories: details.types ?? [],
        description: wiki?.extract ?? "",
        avg_sentiment_score: null, // sau này thêm AI sentiment
        lat: details.geometry.location.lat,
        lon: details.geometry.location.lng,
        created_at: new Date().toISOString(),
        reviews: details.user_ratings_total ?? 0,
    };

    return data;
}

// ==================== INSERT INTO SUPABASE =====================
async function insertPlace(data: any) {
    const { error } = await supabase.from("places").insert(data);
    if (error) {
        console.error("❌ Lỗi insert:", error);
    } else {
        console.log("✅ Đã thêm:", data.name);
    }
}

// ==================== RUN MULTIPLE =====================
async function run() {
    const names = [
        "Phố cổ Hội An",
        "Cầu Rồng Đà Nẵng",
        "Nhà thờ Đức Bà",
        "Chợ Bến Thành",
    ];

    for (const name of names) {
        console.log("⏳ Fetching:", name);

        const placeData = await buildPlaceData(name);
        if (placeData) {
            await insertPlace(placeData);
        }
    }

    console.log("🎉 DONE");
}

run();
