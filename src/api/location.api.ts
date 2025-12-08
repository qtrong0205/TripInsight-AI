export const getLocationById = async ({ queryKey }) => {
    const [, placeId] = queryKey
    if (!placeId) {
        throw new Error('Missing place_id in URL');
    }
    const res = await fetch(`http://localhost:3000/api/locations/${placeId}`);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    return res.json();
    // Optionally fetch similar destinations from backend
    // const simRes = await fetch(`http://localhost:3000/api/locations?similarTo=${placeId}&limit=4`);
    // const simData = await simRes.json();
    // setSimilarDestinations((simData?.data ?? simData) as Destination[]
}