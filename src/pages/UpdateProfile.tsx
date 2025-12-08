import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Camera, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../contexts/useAuth';

export default function EditProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!user) {
            navigate('/login');
        } else {
            setName(user.name);
            setEmail(user.email);
            setAvatar(user.avatar);
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // In a real app, you would upload the file to a server
            // For now, we'll create a local URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-background py-4 md:py-0">
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <Button
                        onClick={() => navigate('/profile')}
                        variant="ghost"
                        className="text-foreground hover:bg-neutral hover:text-foreground mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
                        Back to Profile
                    </Button>
                    <h1 className="text-4xl font-bold text-foreground">Edit Profile</h1>
                </div>

                <div className="max-w-2xl mx-auto">
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-card-foreground">Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Avatar Upload */}
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative">
                                        <Avatar className="w-32 h-32">
                                            <AvatarImage src={avatar} alt={name} />
                                            <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                                                {name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <label
                                            htmlFor="avatar-upload"
                                            className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-3 cursor-pointer hover:bg-secondary transition-colors shadow-lg"
                                        >
                                            <Camera className="w-5 h-5" strokeWidth={2} />
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Click the camera icon to upload a new avatar
                                    </p>
                                </div>

                                {/* Name Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-card-foreground flex items-center gap-2">
                                        <User className="w-4 h-4" strokeWidth={2} />
                                        Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="bg-background text-foreground border-border"
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-card-foreground flex items-center gap-2">
                                        <Mail className="w-4 h-4" strokeWidth={2} />
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-background text-foreground border-border"
                                    />
                                </div>

                                {/* Avatar URL Field (Alternative to file upload) */}
                                <div className="space-y-2">
                                    <Label htmlFor="avatar-url" className="text-card-foreground">
                                        Avatar URL (Optional)
                                    </Label>
                                    <Input
                                        id="avatar-url"
                                        type="url"
                                        placeholder="https://example.com/avatar.jpg"
                                        value={avatar}
                                        onChange={(e) => setAvatar(e.target.value)}
                                        className="bg-background text-foreground border-border"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        You can also paste a direct link to an image
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-primary text-primary-foreground hover:bg-secondary"
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate('/profile')}
                                        className="flex-1 bg-background text-foreground border-border hover:bg-neutral hover:text-foreground"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
