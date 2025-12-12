const backendUrl = import.meta.env.VITE_BACKEND_URL

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

export const fetchLocations = async ({ pageParam = 1 }) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/locations?page=${pageParam}&limit=10`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json(); // backend trả về { data, nextPage, hasMore }
};