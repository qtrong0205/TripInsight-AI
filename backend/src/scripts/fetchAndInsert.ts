import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";
import { searchPlaceGeoapify, getPlaceDetailsGeoapify, GeoapifyPlace } from "../service/geoapify.service";

const GEOAPIFY_KEY = process.env.GEOAPIFY_API_KEY!;
const SUPABASE_URL = env.supabaseUrl;
const SUPABASE_SERVICE_ROLE = env.supabaseServiceRoleKey;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// ==================== TYPES =====================
interface WikiSummary {
    extract?: string;
}

// ==================== LOCATION NORMALIZATION =====================
function simplifyLocation(formatted: string): string {
    if (!formatted) return "";
    const tokens = formatted
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

    // Loại bỏ các token không mong muốn
    const blacklist = [/street/i, /district/i, /ward/i, /province/i, /city/i];
    const cleaned = tokens.filter(t => {
        const hasDigit = /\d/.test(t);
        const isBlack = blacklist.some(rx => rx.test(t));
        return !hasDigit && !isBlack;
    });

    // Lấy quốc gia là token cuối cùng sau khi lọc (nếu có)
    const country = (cleaned[cleaned.length - 1] ?? tokens[tokens.length - 1] ?? "").replace(/\.$/, "");
    // Thành phố: tìm token gần cuối còn lại (ví dụ: Hanoi)
    const cityCandidates = cleaned.slice(0, -1);
    const city = (cityCandidates[cityCandidates.length - 1] ?? "").replace(/\.$/, "");

    const parts = [city, country].filter(Boolean);
    // Return in "City, Country" format 
    return parts.join(", ").trim();
}

// ==================== HÀM XỬ LÝ DỮ LIỆU MỚI =====================
function processCategories(categories: string[]): string[] {
    if (!categories || categories.length === 0) return [];

    const regex = /[^a-z\s]/g;

    const cleaned = categories
        .map(cat => cat.toLowerCase().replace(regex, '').trim()) // Lọc ký tự, chuyển thành chữ thường, cắt khoảng trắng
        .filter(cat => cat.length > 0);

    // Tách các cụm thành từng từ và viết hoa chữ cái đầu
    const words = cleaned
        .flatMap(cat => cat.split(/\s+/)) // tách theo khoảng trắng
        .filter(w => w.length > 0)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1));

    // Loại bỏ trùng lặp, giữ thứ tự xuất hiện
    return words.filter((w, idx, self) => self.indexOf(w) === idx);
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

/**
 * 🎯 Tạo điểm cảm xúc (sentiment) ngẫu nhiên trong khoảng 75-100
 */
function generateRandomSentiment(): number {
    const min = 75;
    const max = 100;
    const value = Math.random() * (max - min) + min;
    return Math.round(value);
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
        location: simplifyLocation(finalProps.formatted),
        image: images,
        rating: rating,
        categories: categories,
        description: wiki?.extract ?? "",
        avg_sentiment_score: generateRandomSentiment(),
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

// run();