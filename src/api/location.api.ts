export const getLocationById = async ({ queryKey }) => {
    const [, placeId] = queryKey
    if (!placeId) {
        throw new Error('Missing place_id in URL');
    }
    const [locationRes, similarRes] = await Promise.all([
        fetch(`http://localhost:3000/api/locations/${placeId}`),
        fetch(`http://localhost:3000/api/locations/similar/${placeId}`)
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