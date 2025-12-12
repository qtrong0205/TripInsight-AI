import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type FailureReason = 'email-exists' | 'email-unconfirmed';

export default function SignupFailed() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const reason: FailureReason = location.state?.reason || 'email-exists';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const isEmailExists = reason === 'email-exists';
    const isEmailUnconfirmed = reason === 'email-unconfirmed';

    const handleResendConfirmation = () => {
        // In a real app, this would trigger an API call to resend confirmation email
        alert(`Confirmation email has been resent to ${email}`);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md bg-card border-border">
                <CardHeader className="text-center pb-4">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isEmailUnconfirmed ? 'bg-warning/10' : 'bg-destructive/10'
                        }`}>
                        {isEmailUnconfirmed ? (
                            <Clock className="w-8 h-8 text-warning" strokeWidth={2} />
                        ) : (
                            <AlertCircle className="w-8 h-8 text-destructive" strokeWidth={2} />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-card-foreground mb-2">
                        {isEmailUnconfirmed ? 'Email Not Confirmed' : 'Sign Up Failed'}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEmailUnconfirmed
                            ? 'Please verify your email address'
                            : 'We couldn\'t create your account'
                        }
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Error Alert */}
                    <Alert className={isEmailUnconfirmed ? 'bg-warning/10 border-warning/20' : 'bg-destructive/10 border-destructive/20'}>
                        {isEmailUnconfirmed ? (
                            <Clock className="h-4 w-4 text-warning" strokeWidth={2} />
                        ) : (
                            <AlertCircle className="h-4 w-4 text-destructive" strokeWidth={2} />
                        )}
                        <AlertDescription className="text-card-foreground ml-2">
                            {isEmailExists && (
                                <>
                                    <strong className="font-semibold">Email Already Exists</strong>
                                    <p className="mt-1">
                                        An account with this email address already exists in our system.
                                    </p>
                                </>
                            )}
                            {isEmailUnconfirmed && (
                                <>
                                    <strong className="font-semibold">Email Verification Required</strong>
                                    <p className="mt-1">
                                        Your account exists but hasn't been verified yet. Please check your inbox for the confirmation email.
                                    </p>
                                </>
                            )}
                        </AlertDescription>
                    </Alert>

                    {/* Email Display */}
                    {email && (
                        <div className="bg-neutral rounded-lg p-4 flex items-center space-x-3">
                            <div className="bg-background rounded-full p-2">
                                <Mail className="w-5 h-5 text-primary" strokeWidth={2} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Email address</p>
                                <p className="font-medium text-card-foreground break-all">{email}</p>
                            </div>
                        </div>
                    )}

                    {/* Solutions */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-card-foreground">What you can do:</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {isEmailExists && (
                                <>
                                    <li className="flex items-start">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                                        <span>Try logging in with this email address instead</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                                        <span>Use a different email address to create a new account</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                                        <span>Reset your password if you've forgotten it</span>
                                    </li>
                                </>
                            )}
                            {isEmailUnconfirmed && (
                                <>
                                    <li className="flex items-start">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                                        <span>Check your email inbox (and spam folder) for the confirmation link</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                                        <span>Click the confirmation link in the email to activate your account</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                                        <span>Request a new confirmation email if you didn't receive one</span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                        {isEmailExists && (
                            <>
                                <Button
                                    onClick={() => navigate('/login', { state: { email } })}
                                    className="w-full bg-primary text-primary-foreground hover:bg-secondary"
                                >
                                    Go to Login
                                </Button>
                                <Button
                                    onClick={() => navigate('/register')}
                                    variant="outline"
                                    className="w-full bg-background text-foreground border-border hover:bg-neutral hover:text-foreground"
                                >
                                    Try Different Email
                                </Button>
                            </>
                        )}
                        {isEmailUnconfirmed && (
                            <>
                                <Button
                                    onClick={handleResendConfirmation}
                                    className="w-full bg-primary text-primary-foreground hover:bg-secondary"
                                >
                                    <Mail className="w-4 h-4 mr-2" strokeWidth={2} />
                                    Resend Confirmation Email
                                </Button>
                                <Button
                                    onClick={() => navigate('/login', { state: { email } })}
                                    variant="outline"
                                    className="w-full bg-background text-foreground border-border hover:bg-neutral hover:text-foreground"
                                >
                                    Go to Login
                                </Button>
                            </>
                        )}
                        <Button
                            onClick={() => navigate('/')}
                            variant="ghost"
                            className="w-full text-foreground hover:bg-neutral hover:text-foreground"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
                            Back to Home
                        </Button>
                    </div>

                    {/* Help Text */}
                    <div className="text-center pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                            Need help?{' '}
                            <button
                                onClick={() => navigate('/contact')}
                                className="text-primary hover:underline font-medium"
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
