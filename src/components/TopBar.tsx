import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, User, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useAuth } from '../contexts/AuthContext';

interface TopBarProps {
    onSearch?: (query: string) => void;
}

export default function TopBar({ onSearch }: TopBarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
        if (location.pathname !== '/') {
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-1 rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-xl">T</span>
                        </div>
                        <span className="font-bold text-xl text-foreground hidden sm:inline">TravelHub</span>
                    </Link>

                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Input
                                type="text"
                                placeholder="Search destinations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-4 pr-12 h-11 bg-neutral text-neutral-foreground border-border"
                            />
                            <Button
                                type="submit"
                                size="sm"
                                className="absolute right-1 top-1 h-9 bg-primary text-primary-foreground hover:bg-secondary"
                            >
                                <Search className="w-4 h-4" strokeWidth={2} />
                            </Button>
                        </div>
                    </form>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-6">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <Link
                                        to="/"
                                        className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary cursor-pointer ${isActive('/') ? 'text-primary' : 'text-foreground'
                                            }`}
                                    >
                                        Home
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link
                                        to="/favorites"
                                        className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary cursor-pointer flex items-center gap-2 ${isActive('/favorites') ? 'text-primary' : 'text-foreground'
                                            }`}
                                    >
                                        <Heart className="w-4 h-4" strokeWidth={2} />
                                        Favorites
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/profile">
                                    <Avatar className="w-10 h-10 cursor-pointer">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    size="sm"
                                    className="text-foreground hover:text-primary hover:bg-neutral"
                                >
                                    <LogOut className="w-4 h-4" strokeWidth={2} />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/register">
                                    <Button className="border border-border bg-background text-foreground hover:bg-neutral">
                                        Sign Up
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button className="bg-primary text-primary-foreground hover:bg-secondary">
                                        <User className="w-4 h-4 mr-2" strokeWidth={2} />
                                        Login
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden text-foreground hover:bg-neutral"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6 text-black" strokeWidth={2} />
                        ) : (
                            <Menu className="w-6 h-6 text-black" strokeWidth={2} />
                        )}
                    </Button>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="md:hidden pb-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search destinations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-4 pr-12 h-11 bg-neutral text-neutral-foreground border-border"
                        />
                        <Button
                            type="submit"
                            size="sm"
                            className="absolute right-1 top-1 h-9 bg-primary text-primary-foreground hover:bg-secondary"
                        >
                            <Search className="w-4 h-4" strokeWidth={2} />
                        </Button>
                    </div>
                </form>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-background border-t border-border">
                    <nav className="container mx-auto px-4 py-4 space-y-2">
                        <Link
                            to="/"
                            className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-neutral cursor-pointer ${isActive('/') ? 'bg-neutral text-primary' : 'text-foreground'
                                }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/favorites"
                            className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-neutral cursor-pointer flex items-center gap-2 ${isActive('/favorites') ? 'bg-neutral text-primary' : 'text-foreground'
                                }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Heart className="w-4 h-4" strokeWidth={2} />
                            Favorites
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-neutral cursor-pointer flex items-center gap-2 ${isActive('/profile') ? 'bg-neutral text-primary' : 'text-foreground'
                                        }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <User className="w-4 h-4" strokeWidth={2} />
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-neutral cursor-pointer flex items-center gap-2 text-foreground"
                                >
                                    <LogOut className="w-4 h-4" strokeWidth={2} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="block px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-neutral cursor-pointer text-foreground"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                                <Link
                                    to="/login"
                                    className="block px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-neutral cursor-pointer text-foreground"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
