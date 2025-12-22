import { searchPlaceGeoapify } from "./geoapify.service";
import supabase from "../config/supabase";

interface PlaceLocationResult {
    destName: string;
    lat: number;
    lon: number;
}

// ==================== SLUG UTILITIES ====================

/**
 * Tạo slug từ tên địa điểm
 * - Chuyển về chữ thường
 * - Loại bỏ dấu tiếng Việt
 * - Thay khoảng trắng bằng dấu gạch ngang
 * - Loại bỏ ký tự đặc biệt
 */
export function generateSlug(name: string): string {
    // Bảng chuyển đổi dấu tiếng Việt
    const vietnameseMap: Record<string, string> = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'đ': 'd',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    };

    let slug = name.toLowerCase();

    // Thay thế các ký tự tiếng Việt
    for (const [vietnamese, ascii] of Object.entries(vietnameseMap)) {
        slug = slug.replace(new RegExp(vietnamese, 'g'), ascii);
    }

    // Loại bỏ ký tự đặc biệt, chỉ giữ chữ cái, số và khoảng trắng
    slug = slug.replace(/[^a-z0-9\s-]/g, '');

    // Thay khoảng trắng bằng dấu gạch ngang
    slug = slug.replace(/\s+/g, '-');

    // Loại bỏ các dấu gạch ngang liên tiếp
    slug = slug.replace(/-+/g, '-');

    // Loại bỏ dấu gạch ngang ở đầu và cuối
    slug = slug.replace(/^-|-$/g, '');

    return slug;
}

/**
 * Kiểm tra slug đã tồn tại trong database chưa
 */
export async function checkSlugExists(slug: string): Promise<boolean> {
    const { count, error } = await supabase
        .from('places')
        .select('*', { count: 'exact', head: true })
        .eq('slug', slug);

    if (error) throw error;
    return (count ?? 0) > 0;
}

/**
 * Tạo slug unique bằng cách thêm số nếu slug đã tồn tại
 */
export async function generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (await checkSlugExists(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}

// ==================== PLACE DATA UTILITIES ====================

export async function buildPlaceData(name: string, location: string): Promise<PlaceLocationResult | null> {
    const searchText = location
        ? `${name}, ${location}`
        : name;

    const searchResult = await searchPlaceGeoapify(searchText);
    if (!searchResult) {
        return null;
    }

    const props = searchResult.properties;

    if (
        typeof props.lat !== "number" ||
        typeof props.lon !== "number"
    ) {
        return null;
    }

    return {
        destName: props.name ?? name,
        lat: props.lat,
        lon: props.lon,
    };
}

export function buildStaticMapUrl(lat: number, lon: number) {
    const params = new URLSearchParams({
        style: "osm-carto",
        center: `lonlat:${lon},${lat}`,
        zoom: "14",
        width: "600",
        height: "300",
        apiKey: process.env.GEOAPIFY_API_KEY!,
    });

    return `https://maps.geoapify.com/v1/staticmap?${params.toString()}`;
}
