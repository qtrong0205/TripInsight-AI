import { DataToInsert, DestinationFilters } from "../data/destinations";

const backendUrl = import.meta.env.VITE_BACKEND_URL

interface FetchLocationsParams extends DestinationFilters {
    pageParam?: number;
}

export const getLocationById = async ({ queryKey }) => {
    const [, placeId] = queryKey
    if (!placeId) {
        throw new Error('Missing place_id in URL');
    }
    const [locationRes, similarRes] = await Promise.all([
        fetch(`${backendUrl}/locations/${placeId}`),
        fetch(`${backendUrl}/locations/similar/${placeId}`)
    ]);

    if (!locationRes.ok) throw new Error("Failed to fetch location");
    if (!similarRes.ok) throw new Error("Failed to fetch similar");

    const location = await locationRes.json();
    const similar = await similarRes.json();

    return {
        location,
        similar,
    };
}

export const fetchLocations = async ({
    pageParam = 1,
    categories,
    rating,
    sentimentScore,
    sort,
}: FetchLocationsParams) => {
    const params = new URLSearchParams({
        page: String(pageParam),
        limit: "10",
    });

    if (categories && categories.length > 0) {
        params.append("categories", categories.join(","));
    }

    if (rating !== undefined) {
        params.append("rating", String(rating));
    }

    if (sentimentScore !== undefined) {
        params.append("sentimentScore", String(sentimentScore));
    }

    if (sort) {
        params.append("sort", sort);
    }

    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/locations?${params.toString()}`
    );

    if (!res.ok) throw new Error("Failed to fetch");

    return res.json(); // { data, nextPage, hasMore }
};

export const getLocationStat = async ({ queryKey }) => {
    const [, token] = queryKey;
    if (!token) {
        throw new Error("Missing access token");
    }

    const res = await fetch(`${backendUrl}/locations/admin/stat`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch location stat");
    }

    return res.json();
};

export const getLocationsAdmin = async ({
    token,
    page = 1,
    limit = 10,
}) => {
    if (!token) throw new Error("Missing access token");

    const res = await fetch(
        `${backendUrl}/locations/admin?page=${page}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch admin locations");
    }

    return res.json();
};


export const createPlaceApi = async (data: DataToInsert, token: string) => {
    const res = await fetch(`${backendUrl}/locations/admin/new`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        throw new Error("Failed to create location")
    }

    return res.json()
}

