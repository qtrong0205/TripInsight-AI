import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/useAuth';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z
    .object({
        name: z.string().trim().min(1, "Tên không được để trống"),
        email: z.string().email("Email không hợp lệ"),
        password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
    });

export default function Signup() {
    const [error, setError] = useState('');
    const { register: registerApi, user } = useAuth();
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const { handleSubmit, register: rhfRegister, formState } = form;

    useEffect(() => {
        window.scrollTo(0, 0);
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    // submission handler
    const onSubmit = async (values: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
    }) => {
        try {
            await registerApi(values.name, values.email, values.password);
            // Đăng ký thành công -> navigate về trang chủ (user đã được auto login)
            navigate('/');
        } catch (err: any) {
            console.error("Register Error:", err);
            if (err?.code === "email-existed") {
                navigate('/signup-status?status=email-exists', {
                    state: { email: values.email }
                });
                return;
            }
            setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-card-foreground">
                        Create Account
                    </CardTitle>
                    <p className="text-center text-muted-foreground mt-2">
                        Join TravelHub and start exploring
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-card-foreground">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                {...rhfRegister("name")}
                                className="bg-background text-foreground border-border"
                            />
                            {formState.errors.name && (
                                <p className="text-sm text-destructive">
                                    {formState.errors.name.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-card-foreground">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                {...rhfRegister("email")}
                                className="bg-background text-foreground border-border"
                            />
                            {formState.errors.email && (
                                <p className="text-sm text-destructive">
                                    {formState.errors.email.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-card-foreground">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...rhfRegister("password")}
                                className="bg-background text-foreground border-border"
                            />
                            {formState.errors.password && (
                                <p className="text-sm text-destructive">
                                    {formState.errors.password.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password" className="text-card-foreground">
                                Confirm Password
                            </Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="••••••••"
                                {...rhfRegister("confirmPassword")}
                                className="bg-background text-foreground border-border"
                            />
                            {formState.errors.confirmPassword && (
                                <p className="text-sm text-destructive">
                                    {formState.errors.confirmPassword.message as string}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground hover:bg-secondary"
                        >
                            Sign Up
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Login
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}