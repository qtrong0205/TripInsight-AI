import { useQuery } from "@tanstack/react-query";
import { getLocationById } from "../api/location.api";

export const useLocationQuery = (placeId?: string | null) => {
    return useQuery({
        queryKey: ["placeId", placeId],
        queryFn: getLocationById,
        enabled: !!placeId,
        // Many APIs wrap the payload as { data: ... }; unwrap if present
        select: (res: any) => (res?.data ?? res),
    });
};
