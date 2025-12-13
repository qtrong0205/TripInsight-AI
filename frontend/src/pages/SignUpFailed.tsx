import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type FailureReason = 'email-exists';

export default function SignupFailed() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || '';
    const reason: FailureReason = location.state?.reason || 'email-exists';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const isEmailExists = reason === 'email-exists';

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md bg-card border-border">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-destructive/10">
                        <AlertCircle className="w-8 h-8 text-destructive" strokeWidth={2} />
                    </div>
                    <h1 className="text-3xl font-bold text-card-foreground mb-2">
                        Sign Up Failed
                    </h1>
                    <p className="text-muted-foreground">
                        We couldn't create your account
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Error Alert */}
                    {isEmailExists && (
                        <Alert className="bg-destructive/10 border-destructive/20">
                            <AlertCircle className="h-4 w-4 text-destructive" strokeWidth={2} />
                            <AlertDescription className="ml-2">
                                <strong>Email Already Exists</strong>
                                <p className="mt-1">
                                    An account with this email address already exists.
                                </p>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Email Display */}
                    {email && (
                        <div className="bg-neutral rounded-lg p-4 flex items-center space-x-3">
                            <div className="bg-background rounded-full p-2">
                                <Mail className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Email address</p>
                                <p className="font-medium break-all">{email}</p>
                            </div>
                        </div>
                    )}

                    {/* Solutions */}
                    <div className="space-y-3">
                        <h3 className="font-semibold">What you can do:</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Try logging in with this email</li>
                            <li>Use a different email address</li>
                            <li>Reset your password if forgotten</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={() => navigate('/login', { state: { email } })}
                            className="w-full"
                        >
                            Go to Login
                        </Button>

                        <Button
                            onClick={() => navigate('/register')}
                            variant="outline"
                            className="w-full"
                        >
                            Try Different Email
                        </Button>

                        <Button
                            onClick={() => navigate('/')}
                            variant="ghost"
                            className="w-full"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </div>

                    {/* Help Text */}
                    <div className="text-center pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            Need help?{' '}
                            <button
                                onClick={() => navigate('/contact')}
                                className="text-primary hover:underline"
                            >
                                Contact Support
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
