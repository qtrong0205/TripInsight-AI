import { useEffect } from 'react';
import { TrendingUp, MapPin, Star, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { useLocationsAdmin, useLocationStat } from '../../hooks/location.queries';

interface StatInterface {
    active: number;
    featured: number;
    inactive: number;
    monthlyChange: number;
    recent: number;
    total: number;
}

export default function AdminDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            // User is not logged in, redirect to login
            navigate("/login");
            return;
        }
        if (user && user.role !== "admin") {
            navigate("/");
        }
    }, [user, navigate]);

    const { data: statData, isLoading: statLoading, error: statError } = useLocationStat(
        user?.access_token
    ) as {
        data: StatInterface | undefined;
        isLoading: boolean;
        error: unknown;
    };

    const { data: locationsData, isLoading: locationsLoading, error: locationsError } = useLocationsAdmin(user?.access_token, 1, 4)

    // Show loading state while user or data is loading
    if (!user || statLoading || locationsLoading) {
        return (
            <div className="pt-20 md:pt-2 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (statError || locationsError) {
        return (
            <div className="pt-20 md:pt-2 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p>Error loading dashboard data</p>
                </div>
            </div>
        );
    }

    const stats = [
        {
            title: 'Total Destinations',
            value: statData?.total ?? 0,
            change: `+${statData?.monthlyChange ?? 0} this month`,
            icon: MapPin,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Featured Destinations',
            value: statData?.featured ?? 0,
            icon: Star,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
        },
        {
            title: 'Recently Added',
            value: statData?.recent ?? 0,
            change: 'Last 7 days',
            icon: TrendingUp,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
        },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // yyyy-mm-dd
    };

    const recentDestinations = (Array.isArray(locationsData) ? locationsData : []).slice(0, 4).map((item: any) => ({
        name: item.name,
        location: item.location,
        status: item.active ? "Active" : "Inactive",
        date: formatDate(item.created_at),
    }));

    return (
        <div className="pt-20 md:pt-2 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-4 sm:px-6 lg:px-8 py-6 lg:ml-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-500 mt-1">Welcome back, Admin</p>
                        </div>
                        <Link to="/admin/destinations/new">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                                <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                                Add Destination
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                                        <p className="text-sm text-gray-500">{stat.change}</p>
                                    </div>
                                    <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                                        <stat.icon className="w-6 h-6" strokeWidth={2} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <Card className="lg:col-span-2 bg-white border-gray-200">
                        <CardHeader className="border-b border-gray-100 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Recent Destinations
                                </CardTitle>
                                <Link to="/admin/destinations">
                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                        View All
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100">
                                {recentDestinations.map((dest, index) => (
                                    <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 mb-1">{dest.name}</h4>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                                                        {dest.location}
                                                    </span>
                                                    <span>{dest.date}</span>
                                                </div>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${dest.status === 'Active'
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-red-100 text-red-600'
                                                    }`}
                                            >
                                                {dest.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="bg-white border-gray-200">
                        <CardHeader className="border-b border-gray-100 px-6 py-4">
                            <CardTitle className="text-lg font-semibold text-gray-900">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-600">Active Destinations</span>
                                        <span className="text-sm font-bold text-gray-900">{statData?.active ?? 0}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${statData?.active ?? 0}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-600">Inactive Destinations</span>
                                        <span className="text-sm font-bold text-gray-900">{statData?.inactive ?? 0}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${statData?.inactive ?? 0}%` }}></div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-medium text-gray-600 mb-3">Top Categories</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700">Beach</span>
                                            <span className="font-medium text-gray-900">64</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700">Mountain</span>
                                            <span className="font-medium text-gray-900">52</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700">City</span>
                                            <span className="font-medium text-gray-900">48</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
