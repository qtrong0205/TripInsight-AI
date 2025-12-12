import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/useAuth';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err: any) {
            // TODO: surface error to user via toast/UI
            console.error('Register failed:', err?.message || err);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-card-foreground">
                        Create Account
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-card-foreground">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-background text-foreground border-border"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-card-foreground">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-background text-foreground border-border"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-card-foreground">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-background text-foreground border-border"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground hover:bg-secondary"
                        >
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
