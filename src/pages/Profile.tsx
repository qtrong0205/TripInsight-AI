import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../contexts/useAuth';
import { useFavorites } from '../contexts/FavoritesContext';
import { destinations } from '../data/destinations';

export default function Profile() {
    const { user } = useAuth();
    const { favorites } = useFavorites();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const memberSince = useMemo(() => {
        if (!user?.createdAt) return '—';
        const d = new Date(user.createdAt);
        // Format month + year in English locale and capitalize first letter
        const formatted = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }, [user?.createdAt]);

    if (!user) {
        return null;
    }

    const favoriteDestinations = destinations.filter((dest) => favorites.includes(dest.id));

    return (
        <div className="min-h-screen bg-background">
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-foreground mb-8">My Profile</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="bg-card border-border">
                            <CardContent className="p-6 text-center">
                                <Avatar className="w-24 h-24 mx-auto mb-4">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                        {user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-2xl font-bold text-card-foreground mb-2">{user.name}</h2>
                                <p className="text-muted-foreground mb-6">{user.email}</p>
                                <Link to={"/edit-profile"}>
                                    <Button
                                        variant="outline"
                                        className="w-full bg-background text-foreground border-border hover:bg-neutral hover:text-foreground"
                                    >
                                        Edit Profile
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* User Info */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-card-foreground">Account Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <User className="w-5 h-5 text-primary" strokeWidth={2} />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Full Name</div>
                                        <div className="font-medium text-card-foreground">{user.name}</div>
                                    </div>
                                </div>
                                <Separator className="bg-border" />
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-primary" strokeWidth={2} />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Email</div>
                                        <div className="font-medium text-card-foreground">{user.email}</div>
                                    </div>
                                </div>
                                <Separator className="bg-border" />
                                <div className="flex items-center space-x-3">
                                    <Calendar className="w-5 h-5 text-primary" strokeWidth={2} />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Member Since</div>
                                        <div className="font-medium text-card-foreground">{memberSince}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Favorites Summary */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-card-foreground">My Favorites</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {favoriteDestinations.length > 0 ? (
                                        <>
                                            {favoriteDestinations.slice(0, 3).map((dest) => (
                                                <div
                                                    key={dest.id}
                                                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-neutral transition-colors cursor-pointer"
                                                    onClick={() => navigate(`/destination/${dest.slug}`)}
                                                >
                                                    <img
                                                        src={dest.image}
                                                        alt={dest.name}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                        loading="lazy"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-card-foreground">{dest.name}</h4>
                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                            <MapPin className="w-3 h-3 mr-1" strokeWidth={2} />
                                                            {dest.location}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {favoriteDestinations.length > 3 && (
                                                <Button
                                                    onClick={() => navigate('/favorites')}
                                                    variant="outline"
                                                    className="w-full bg-background text-foreground border-border hover:bg-neutral hover:text-foreground"
                                                >
                                                    View All Favorites ({favoriteDestinations.length})
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-4">No favorites yet</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
