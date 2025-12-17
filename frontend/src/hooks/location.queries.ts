import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchLocations, getLocationById } from "../api/location.api";
import { DestinationFilters } from "../data/destinations";

export const useLocationQuery = (placeId?: string | null) => {
    return useQuery({
        queryKey: ["placeId", placeId],
        queryFn: getLocationById,
        enabled: !!placeId,
        select: (res: any) => (res?.data ?? res),
    });
};

export const useLocationsInfinite = (filters: DestinationFilters) => {
    return useInfiniteQuery({
        queryKey: ["locations", filters],
        queryFn: ({ pageParam = 1 }) =>
            fetchLocations({
                pageParam,
                ...filters,
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage?.hasMore ? lastPage.nextPage : undefined,
        select: (data) => ({
            pages: data.pages.map((p: any) => p.data),
            pageParams: data.pageParams,
            hasMore: data.pages[data.pages.length - 1]?.hasMore ?? false,
        }),
    });
};
