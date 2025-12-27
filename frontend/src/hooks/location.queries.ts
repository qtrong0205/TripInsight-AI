import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlaceApi, fetchLocations, getLocationById, getLocationsAdmin, getLocationStat } from "../api/location.api";
import { DataToInsert, DestinationFilters } from "../data/destinations";

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

export const useLocationsAdmin = (
    token: string,
    page = 1,
    limit = 10
) => {
    return useQuery({
        queryKey: ["locations-admin", page, limit],
        queryFn: () =>
            getLocationsAdmin({ token, page, limit }),
        enabled: !!token,
        select: (res: any) => (res?.data ?? res),
    });
};


export const useLocationStat = (token: string) => {
    return useQuery({
        queryKey: ["location-stat", token],
        queryFn: getLocationStat,
        select: (res: any) => (res?.data ?? res),
    })
}

export const useCreatePlace = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ data, token }: { data: DataToInsert; token: string }) =>
            createPlaceApi(data, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['places'] })
        }
    })
}
