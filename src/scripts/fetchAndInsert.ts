import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

const GEOAPIFY_KEY = process.env.GEOAPIFY_API_KEY!;
const SUPABASE_URL = env.supabaseUrl;
const SUPABASE_SERVICE_ROLE = env.supabaseServiceRoleKey;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

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

interface WikiSummary {
    extract?: string;
}

// ==================== HÀM XỬ LÝ DỮ LIỆU MỚI =====================

/**
 * 🧹 Hàm xử lý Categories: Chỉ giữ lại chữ thường (a-z) và khoảng trắng
 * @param categories Mảng chuỗi categories từ Geoapify
 * @returns Mảng chuỗi categories đã được làm sạch
 */
function processCategories(categories: string[]): string[] {
    if (!categories || categories.length === 0) return [];

    // Regex để loại bỏ tất cả ký tự không phải chữ thường (a-z) hoặc khoảng trắng
    // Sau đó loại bỏ các khoảng trắng thừa
    const regex = /[^a-z\s]/g;

    return categories
        .map(cat => cat.toLowerCase().replace(regex, '').trim()) // Lọc ký tự, chuyển thành chữ thường, cắt khoảng trắng
        .filter(cat => cat.length > 0) // Loại bỏ chuỗi rỗng sau khi làm sạch
        .filter((cat, index, self) => self.indexOf(cat) === index); // Loại bỏ các categories trùng lặp
}

/**
 * ⭐ Hàm tính Rating ngẫu nhiên từ 3.5 đến 5.0
 * @returns Số float ngẫu nhiên
 */
function generateRandomRating(): number {
    const min = 3.5;
    const max = 5.0;
    // Làm tròn đến 1 chữ số thập phân
    const randomRating = Math.random() * (max - min) + min;
    return parseFloat(randomRating.toFixed(1));
}


// ==================== GEOAPIFY PLACE SEARCH (BƯỚC 1) =====================
async function searchPlaceGeoapify(name: string) {
    // ĐÃ LOẠI BỎ 'filter: "countrycode:vn"' và 'bias: proximity...'
    const url = "https://api.geoapify.com/v1/geocode/search?" + new URLSearchParams({
        text: name,
        apiKey: GEOAPIFY_KEY,
        limit: "1",
        lang: "vi",
        type: "amenity", // Giữ lại type: amenity để tìm điểm tham quan
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

// ==================== GEOAPIFY PLACE DETAILS (BƯỚC 2) =====================
async function getPlaceDetailsGeoapify(placeId: string) {
    const url =
        `https://api.geoapify.com/v2/place-details?id=${placeId}&apiKey=${GEOAPIFY_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
        const body = await res.text();
        console.warn("Geoapify details HTTP error:", res.status, body);
        return null;
    }
    const json = (await res.json()) as GeoapifyPlacesResponse;

    return json.features?.[0];
}


// ==================== WIKIPEDIA SUMMARY =====================
async function getWikiSummary(name: string) {
    const title = name.replace(/\s+/g, "_");
    const url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(title);

    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as WikiSummary;
}

// ==================== BUILD PLACE DATA =====================
async function buildPlaceData(name: string) {
    // 1. BƯỚC 1: Lấy Place ID (Sử dụng Geocoding Search)
    const searchResult = await searchPlaceGeoapify(name);
    if (!searchResult) return null;

    const placeId = searchResult.place_id ?? searchResult.properties.place_id;

    // 2. BƯỚC 2: Lấy chi tiết (Sử dụng Place Details)
    const details = placeId ? await getPlaceDetailsGeoapify(placeId) : null;

    let finalProps = searchResult.properties;
    let categories: string[] = [];
    let rating: number | null = generateRandomRating(); // <--- LẤY RATING NGẪU NHIÊN

    if (details) {
        finalProps = details.properties;
        // **LỌC CATEGORIES:** Áp dụng hàm xử lý mới
        categories = processCategories(finalProps.categories ?? []);

    } else {
        console.warn(`⚠️ Không lấy được chi tiết Geoapify (${placeId ?? 'N/A'}). Chỉ dùng dữ liệu tìm kiếm.`);
        categories = processCategories(finalProps.categories ?? []); // Vẫn lọc nếu có categories từ Geocoding
    }

    // 3. Sử dụng dữ liệu cuối cùng
    const lat = finalProps.lat;
    const lon = finalProps.lon;

    const images: string[] = [];
    const wikimediaUrl = finalProps.datasource?.raw?.wikimedia_commons;
    if (wikimediaUrl) images.push(wikimediaUrl);

    // 4. Lấy summary từ Wikipedia
    const wiki = await getWikiSummary(name);

    // 5. Build data object
    const embedMapUrl = `https://maps.geoapify.com/v1/embed?lat=${lat}&lon=${lon}&zoom=14.5&apiKey=${GEOAPIFY_KEY}`;

    const data = {
        name: finalProps.name ?? name,
        slug: (finalProps.name ?? name).toLowerCase().replace(/\s+/g, "-"),
        location: finalProps.formatted,
        image: images,
        rating: rating, // <--- ĐIỀN RATING
        categories: categories, // <--- ĐIỀN CATEGORIES ĐÃ XỬ LÝ
        description: wiki?.extract ?? "",
        avg_sentiment_score: null,
        lat,
        lon,
        embed_map_url: embedMapUrl,
        created_at: new Date().toISOString(),
        reviews: 0,
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

// ==================== RUN =====================
async function run() {
    const names = [
        // === Địa điểm Việt Nam (Vietnam Destinations - English Names) ===
        "Ha Long Bay",
        "Hoi An Ancient Town",
        "Imperial Citadel of Thang Long",
        "My Son Sanctuary",
        "Phong Nha-Ke Bang National Park",
        "Hanoi Old Quarter",
        "Ho Chi Minh Mausoleum",
        "Hoan Kiem Lake",
        "Temple of Literature",
        "Cu Chi Tunnels",
        "Ben Thanh Market",
        "Mekong Delta",
        "Golden Bridge Da Nang",
        "Dalat Flower Gardens",
        "Nha Trang Beach",
        "Phu Quoc Island",
        "One Pillar Pagoda",
        "Hue Imperial City",
        "Cat Ba Island",
        "Sapa Terraced Fields",

        // === Địa điểm Quốc tế (International Destinations) ===
        "Eiffel Tower",
        "Colosseum",
        "Statue of Liberty",
        "Great Wall of China",
        "Machu Picchu",
        "Pyramids of Giza",
        "Taj Mahal",
        "Acropolis of Athens",
        "Christ the Redeemer (Statue)",
        "Petra, Jordan",
        "The Louvre Museum",
        "Big Ben",
        "Sydney Opera House",
        "Bora Bora",
        "Mount Everest",
        "Grand Canyon National Park",
        "Times Square",
        "Yellowstone National Park",
        "Venice Canals",
        "Mount Fuji",
        "Burj Khalifa",
        "Stonehenge",
        "Red Square",
        "Tikal, Guatemala",
        "Mount Kilimanjaro",
        "Niagara Falls",
        "Galapagos Islands",
        "Victoria Falls",
        "Santorini, Greece",
        "Kremlin, Moscow",
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