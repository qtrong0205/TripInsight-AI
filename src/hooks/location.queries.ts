import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchLocations, getLocationById } from "../api/location.api";

export const useLocationQuery = (placeId?: string | null) => {
    return useQuery({
        queryKey: ["placeId", placeId],
        queryFn: getLocationById,
        enabled: !!placeId,
        select: (res: any) => (res?.data ?? res),
    });
};

export const useLocationsInfinite = () => {
    return useInfiniteQuery({
        queryKey: ["locations"],
        queryFn: fetchLocations,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => (lastPage?.hasMore ? lastPage.nextPage : undefined),
        select: (data) => ({
            pages: data.pages.map((p: any) => (p?.data ?? p)),
            pageParams: data.pageParams,
            hasMore: data.pages[data.pages.length - 1]?.hasMore ?? false,
        }),
    });
};