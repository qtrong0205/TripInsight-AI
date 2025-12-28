import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Star, MoreVertical, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '../../contexts/useAuth';
import { useLocationsAdmin } from '../../hooks/location.queries';
import { AdminFilters } from '../../api/location.api';
import { useMemo } from 'react';

const ITEMS_PER_PAGE = 10;

export default function DestinationsManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive' | 'featured'>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const { user } = useAuth();
    const navigate = useNavigate();

    // Convert selectedFilter to AdminFilters
    const adminFilters: AdminFilters = useMemo(() => {
        switch (selectedFilter) {
            case 'active':
                return { active: true };
            case 'inactive':
                return { active: false };
            case 'featured':
                return { featured: true };
            default:
                return {};
        }
    }, [selectedFilter]);

    useEffect(() => {
        if (user === null) {
            navigate("/login");
            return;
        }
        if (user && user.role !== "admin") {
            navigate("/");
        }
    }, [user, navigate]);

    const { data: locationsData, isLoading, error } = useLocationsAdmin(
        user?.access_token ?? '',
        currentPage,
        ITEMS_PER_PAGE,
        adminFilters
    );

    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedFilter]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    // Loading state
    if (!user || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading destinations...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p>Error loading destinations</p>
                </div>
            </div>
        );
    }

    const destinations = locationsData?.data ?? [];
    const total = locationsData?.total ?? 0;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    // Calculate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-4 py-20 sm:px-6 sm:py-10 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Destinations</h1>
                            <p className="text-gray-500 mt-1">Manage all travel destinations</p>
                        </div>
                        <Link to="/admin/destinations/new">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm w-full sm:w-auto">
                                <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                                Add Destination
                            </Button>
                        </Link>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
                            <Input
                                type="text"
                                placeholder="Search destinations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-gray-50 border-gray-200 h-11"
                            />
                        </div>
                        <Button variant="outline" className="border-gray-200 h-11 px-4">
                            <Filter className="w-4 h-4 mr-2" strokeWidth={2} />
                            Filters
                        </Button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 -mb-2">
                        {(['all', 'active', 'inactive', 'featured'] as const).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedFilter === filter
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Desktop Table View - Hidden on mobile/tablet */}
                <Card className="bg-white border-gray-200 overflow-hidden hidden lg:block">
                    <CardContent className="p-0">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
                            <div className="col-span-4">Destination</div>
                            <div className="col-span-4 text-left">Location</div>
                            <div className="col-span-1 text-right">Rating</div>
                            <div className="col-span-2 text-right">Status</div>
                            <div className="col-span-1 text-right">Actions</div>
                        </div>

                        {/* Table Rows */}
                        <div className="divide-y divide-gray-100">
                            {destinations.map((dest: any) => (
                                <div
                                    key={dest.place_id}
                                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                                >
                                    {/* Destination with Image */}
                                    <div className="col-span-4 flex items-center gap-4">
                                        <img
                                            src={dest.image?.[0] ?? 'https://via.placeholder.com/64'}
                                            alt={dest.name}
                                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-gray-900 truncate">{dest.name}</h4>
                                                {dest.is_featured && (
                                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" strokeWidth={2} />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-0.5">ID: #{dest.place_id}</p>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="col-span-4 text-gray-700 text-left truncate">{dest.location}</div>

                                    {/* Rating */}
                                    <div className="col-span-1 flex items-center justify-end gap-1">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" strokeWidth={2} />
                                        <span className="font-medium text-gray-900">{dest.rating ?? 'N/A'}</span>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-2 text-right">
                                        <span
                                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${dest.active
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {dest.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                        >
                                            <Edit2 className="w-4 h-4" strokeWidth={2} />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                >
                                                    <MoreVertical className="w-4 h-4" strokeWidth={2} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem className="text-gray-700">
                                                    <Star className="w-4 h-4 mr-2" strokeWidth={2} />
                                                    Toggle Featured
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-gray-700">
                                                    <Edit2 className="w-4 h-4 mr-2" strokeWidth={2} />
                                                    Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Mobile/Tablet Card View - Visible only on small/medium screens */}
                <div className="lg:hidden space-y-4">
                    {destinations.map((dest: any) => (
                        <Card key={dest.place_id} className="bg-white border-gray-200 overflow-hidden">
                            <CardContent className="p-0">
                                {/* Card Header with Image */}
                                <div className="flex items-start gap-4 p-4 border-b border-gray-100">
                                    <img
                                        src={dest.image?.[0] ?? 'https://via.placeholder.com/96'}
                                        alt={dest.name}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                                                        {dest.name}
                                                    </h3>
                                                    {dest.is_featured && (
                                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" strokeWidth={2} />
                                                    )}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                                    <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" strokeWidth={2} />
                                                    <span className="truncate">{dest.location}</span>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 -mr-2"
                                                    >
                                                        <MoreVertical className="w-5 h-5" strokeWidth={2} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem className="text-gray-700">
                                                        <Edit2 className="w-4 h-4 mr-2" strokeWidth={2} />
                                                        Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-gray-700">
                                                        <Star className="w-4 h-4 mr-2" strokeWidth={2} />
                                                        Toggle Featured
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Mobile Meta Info */}
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" strokeWidth={2} />
                                                <span className="font-medium text-gray-900">{dest.rating ?? 'N/A'}</span>
                                            </div>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-xs text-gray-500">ID: #{dest.place_id}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer with Status */}
                                <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                                    <span className="text-sm text-gray-600 font-medium">Status</span>
                                    <span
                                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${dest.active
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        {dest.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                        <p className="text-sm text-gray-600">
                            Showing {startItem}-{endItem} of {total} destinations
                        </p>
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-200"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            >
                                Previous
                            </Button>

                            {getPageNumbers().map((page, index) => (
                                page === '...' ? (
                                    <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                                ) : (
                                    <Button
                                        key={page}
                                        variant="outline"
                                        size="sm"
                                        className={`border-gray-200 ${currentPage === page ? 'bg-blue-50 text-blue-700' : ''}`}
                                        onClick={() => setCurrentPage(page as number)}
                                    >
                                        {page}
                                    </Button>
                                )
                            ))}

                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-200"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
